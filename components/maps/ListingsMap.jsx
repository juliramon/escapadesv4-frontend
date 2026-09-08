import GoogleMapReact from "google-map-react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { cloudinaryImage } from "../../utils/cloudinary";
import { listingPath } from "../../utils/listingRoutes";

/**
 * Mapa compartit dels llistats.
 *
 * Substitueix les tres còpies de `renderMarker` que hi havia a experiències,
 * allotjaments i destinacions, i arregla dues coses:
 *
 *  1. Cada marcador tenia la seva pròpia `InfoWindow`, així que en clicar-ne
 *     diversos es quedaven totes obertes damunt del mapa. Ara n'hi ha una de
 *     sola que es reaprofita i es tanca al clicar fora.
 *  2. Amb un centenar de marcadors, el mapa era una taca de xinxetes
 *     superposades. Ara s'agrupen en clústers que es van obrint a mesura que
 *     s'hi fa zoom.
 */

/** Centre aproximat de Catalunya, per si no hi ha cap marcador amb posició. */
const DEFAULT_CENTER = { lat: 41.79, lng: 1.62 };

const PLACE_TYPE_LABELS = {
	hotel: "Hotel",
	casarural: "Casa rural",
	apartament: "Apartament",
	carabana: "Caravana",
	casaarbre: "Casa als arbres",
	refugi: "Refugi",
	camping: "Càmping",
};

const escapeHtml = (value) =>
	String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");

const typeLabel = (item) => {
	if (item.type === "place") {
		const key =
			Array.isArray(item.placeType) && item.placeType.length
				? Object.keys(PLACE_TYPE_LABELS).find((entry) =>
						item.placeType[0].includes(entry)
				  )
				: null;
		return key ? PLACE_TYPE_LABELS[key] : "Allotjament";
	}
	return item.duration ? `Activitat · ${item.duration} h` : "Activitat";
};

/** Contingut HTML de la fitxa emergent d'un marcador. */
const infoWindowContent = (item) => {
	const image = cloudinaryImage(item.cover, 180, 180);
	const href = listingPath(item);
	const meta = [
		item.rating
			? `<span class="gmaps-infobox__rating">★ ${item.rating}</span>`
			: "",
		item.price ? `des de <strong>${item.price} €</strong>` : "",
	]
		.filter(Boolean)
		.join(" · ");

	// Quan la projecció de l'API no porta preu ni valoració, el subtítol és
	// la informació més útil que queda per decidir si val la pena entrar-hi.
	const secondary = meta
		? `<span class="gmaps-infobox__meta">${meta}</span>`
		: item.subtitle
		? `<span class="gmaps-infobox__intro">${escapeHtml(
				item.subtitle
		  )}</span>`
		: "";

	return `<a href="${href}" title="${escapeHtml(
		item.title
	)}" class="gmaps-infobox" target="_blank" rel="noopener">
	<span class="gmaps-infobox__picture">
		${
			image.src
				? `<img src="${image.src}" alt="${escapeHtml(
						item.title
				  )}" width="90" height="90" loading="lazy">`
				: ""
		}
	</span>
	<span class="gmaps-infobox__text">
		<span class="gmaps-infobox__kicker">${escapeHtml(typeLabel(item))}${
		item.locality ? ` · ${escapeHtml(item.locality)}` : ""
	}</span>
		<span class="gmaps-infobox__title">${escapeHtml(item.title)}</span>
		${secondary}
		<span class="gmaps-infobox__cta">Veure la fitxa</span>
	</span>
</a>`;
};

const mapOptions = (maps) => ({
	disableDefaultUI: false,
	fullscreenControl: false,
	streetViewControl: false,
	mapTypeControl: false,
	zoomControl: true,
	gestureHandling: "greedy",
	styles: [
		{
			featureType: "poi",
			elementType: "labels",
			stylers: [{ visibility: "off" }],
		},
		{
			featureType: "poi.park",
			elementType: "labels",
			stylers: [{ visibility: "on" }],
		},
		{
			featureType: "transit",
			elementType: "labels.icon",
			stylers: [{ visibility: "off" }],
		},
	],
});

/** Cercle fosc amb el nombre d'elements agrupats. */
const buildClusterRenderer = (maps) => ({
	render: ({ count, position }) => {
		const size = count < 10 ? 42 : count < 50 ? 50 : 58;
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
			<circle cx="${size / 2}" cy="${size / 2}" r="${
			size / 2 - 1
		}" fill="#232323" fill-opacity="0.18"/>
			<circle cx="${size / 2}" cy="${size / 2}" r="${
			size / 2 - 6
		}" fill="#232323"/>
		</svg>`;

		return new maps.Marker({
			position,
			icon: {
				url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
					svg
				)}`,
				scaledSize: new maps.Size(size, size),
				anchor: new maps.Point(size / 2, size / 2),
			},
			label: {
				text: String(count),
				color: "#ffffff",
				fontSize: "13px",
				fontWeight: "600",
			},
			title: `${count} escapades en aquesta zona`,
			zIndex: 1000 + count,
		});
	},
});

const ListingsMap = ({ items = [], className = "" }) => {
	const points = items.filter(
		(item) => item && item.lat !== null && item.lng !== null
	);

	const handleApiLoaded = ({ map, maps }) => {
		if (!points.length) return;

		const infoWindow = new maps.InfoWindow({ maxWidth: 320 });
		const bounds = new maps.LatLngBounds();

		const markers = points.map((item) => {
			const position = { lat: item.lat, lng: item.lng };
			const marker = new maps.Marker({
				position,
				icon: {
					url: "/map-marker.svg",
					scaledSize: new maps.Size(32, 40),
					anchor: new maps.Point(16, 40),
				},
				title: item.title,
			});

			marker.addListener("click", () => {
				// Una sola finestra reaprofitada: obrir-ne una tanca l'anterior.
				infoWindow.close();
				infoWindow.setContent(infoWindowContent(item));
				infoWindow.open({ anchor: marker, map });
			});

			bounds.extend(position);
			return marker;
		});

		// Clicar el mapa tanca la fitxa oberta.
		map.addListener("click", () => infoWindow.close());

		new MarkerClusterer({
			map,
			markers,
			renderer: buildClusterRenderer(maps),
		});

		if (!bounds.isEmpty()) {
			map.fitBounds(bounds, 56);
		}
	};

	return (
		<div className={`w-full h-full ${className}`}>
			<GoogleMapReact
				bootstrapURLKeys={{
					key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
				}}
				defaultCenter={DEFAULT_CENTER}
				defaultZoom={7}
				options={mapOptions}
				yesIWantToUseGoogleMapApiInternals
				onGoogleApiLoaded={handleApiLoaded}
			/>
		</div>
	);
};

export default ListingsMap;
