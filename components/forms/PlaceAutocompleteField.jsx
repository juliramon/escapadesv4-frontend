import Autocomplete from "react-google-autocomplete";

/**
 * Cercador de localitzacions de Google Places per a les fitxes.
 *
 * El mateix bloc de 140 línies —desmuntar `address_components`, llegir les
 * coordenades i quedar-se amb l'horari— estava copiat a les quatre pàgines
 * d'activitats i d'allotjaments.
 *
 * Dos errors que arrossegava i que aquí queden resolts:
 *  - Les coordenades es llegien de `geometry.viewport`, que és la capsa que
 *    emmarca el lloc, no el lloc: cada fitxa es desava amb el punt d'un cantó
 *    del rectangle. Ara es llegeix `geometry.location`, que és la posició real,
 *    i el `viewport` només serveix de reserva.
 *  - A la pàgina de crear activitats l'identificador de Google es desava com a
 *    `activity_id`, un camp que no existeix enlloc, de manera que el
 *    `place_id` no arribava mai a la base de dades.
 */

/** Les coordenades venen com a funció o com a número segons la versió de l'SDK. */
const numberFrom = (candidate) => {
	if (typeof candidate === "function") return candidate();
	if (typeof candidate === "number") return candidate;
	return undefined;
};

const coordinatesOf = (geometry) => {
	if (!geometry) return {};

	const location = geometry.location;
	const lat = numberFrom(location?.lat);
	const lng = numberFrom(location?.lng);
	if (lat !== undefined && lng !== undefined) return { lat, lng };

	// Reserva: alguns resultats arriben sense `location`.
	const viewport = geometry.viewport;
	if (!viewport) return {};
	const center =
		typeof viewport.getCenter === "function" ? viewport.getCenter() : null;
	return {
		lat: numberFrom(center?.lat),
		lng: numberFrom(center?.lng),
	};
};

const COMPONENT_KEYS = {
	locality: "locality",
	administrative_area_level_2: "province",
	administrative_area_level_1: "state",
	country: "country",
};

const PlaceAutocompleteField = ({
	label,
	placeholder,
	defaultValue,
	onSelect,
}) => (
	<div className="form__group">
		<label htmlFor="location" className="form__label">
			{label}
		</label>
		<Autocomplete
			id="location"
			className="form__control"
			apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
			style={{ width: "100%" }}
			defaultValue={defaultValue || ""}
			types={["establishment"]}
			placeholder={placeholder}
			fields={[
				"rating",
				"place_id",
				"opening_hours",
				"address_components",
				"formatted_address",
				"geometry",
			]}
			onPlaceSelected={(place) => {
				const parts = {};
				(place.address_components || []).forEach((component) => {
					const key = COMPONENT_KEYS[component.types[0]];
					if (key) parts[key] = component.long_name;
				});

				const { lat, lng } = coordinatesOf(place.geometry);

				onSelect({
					full_address: place.formatted_address || "",
					locality: parts.locality || "",
					province: parts.province || "",
					state: parts.state || "",
					country: parts.country || "",
					lat: lat ?? "",
					lng: lng ?? "",
					rating: place.rating || 0,
					place_id: place.place_id || "",
					opening_hours: place.opening_hours?.weekday_text || "",
				});
			}}
		/>
	</div>
);

export default PlaceAutocompleteField;
