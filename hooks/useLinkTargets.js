import { useEffect, useState } from "react";
import ContentService from "../services/contentService";
import { SITE_URL, buildLinkTargets } from "../utils/internalLinks";
import { listingPath } from "../utils/listingRoutes";

/**
 * Entrades del web que es poden enllaçar des de l'editor.
 *
 * L'API no té cap cerca per text que cobreixi tots els tipus de contingut, i
 * un `$regex` de Mongo tampoc no trobaria "Història" escrivint "historia". Com
 * que el catàleg és de pocs centenars d'entrades, es demanen els llistats
 * sencers la primera vegada que s'obre el cercador d'enllaços i es cerca al
 * navegador.
 *
 * L'índex es comparteix entre tots els editors de la pàgina i es torna a
 * demanar passats uns minuts, perquè hi surti el que s'acabi de publicar.
 */

const MAX_AGE_MS = 5 * 60 * 1000;

const SOURCES = {
	activities: (service) => service.activities(),
	places: (service) => service.getAllPlaces(),
	stories: (service) => service.getAllStories(),
	lists: (service) => service.getAllLists(),
	tripEntries: (service) => service.getAllTripEntries(),
	tripCategories: (service) => service.getTripCategories(),
	destinations: (service) => service.getDestinations(),
	categories: (service) => service.getCategories(),
};

let cache = null;

const fetchLinkTargets = () => {
	if (cache && Date.now() - cache.loadedAt < MAX_AGE_MS) {
		return cache.promise;
	}

	const service = new ContentService();
	const keys = Object.keys(SOURCES);
	const promise = Promise.allSettled(
		keys.map((key) => SOURCES[key](service)),
	).then((results) => {
		const data = {};
		let failed = 0;
		results.forEach((result, index) => {
			if (result.status === "fulfilled") data[keys[index]] = result.value;
			else failed += 1;
		});
		if (failed === keys.length) {
			throw new Error("No s'ha pogut carregar cap llistat de contingut.");
		}
		// Si en falla només algun, s'ofereix la resta i es diu.
		return { targets: buildLinkTargets(data), partial: failed > 0 };
	});

	cache = { promise, loadedAt: Date.now() };
	promise.catch(() => {
		if (cache && cache.promise === promise) cache = null;
	});
	return promise;
};

const DETAIL_FETCHERS = {
	activity: (service, slug) => service.activityDetails(slug),
	place: (service, slug) => service.getPlaceDetails(slug),
};

const resolvedUrls = new Map();

/**
 * URL definitiva d'una entrada.
 *
 * La de les fitxes és `/{categoria}/{slug}`, però els llistats de l'API no
 * porten la categoria. Es demana el detall de la fitxa triada —una sola
 * crida, i es recorda— en lloc de paginar tot el catàleg. Si falla, queda la
 * ruta de reserva, que redirigeix a la canònica.
 */
const resolveTargetUrl = (target) => {
	const fetchDetails = DETAIL_FETCHERS[target.type];
	if (!fetchDetails) return Promise.resolve(target.url);

	if (!resolvedUrls.has(target.key)) {
		const promise = fetchDetails(new ContentService(), target.slug)
			.then((details) =>
				details && details.slug
					? `${SITE_URL}${listingPath(details)}`
					: target.url,
			)
			.catch(() => {
				resolvedUrls.delete(target.key);
				return target.url;
			});
		resolvedUrls.set(target.key, promise);
	}
	return resolvedUrls.get(target.key);
};

/**
 * @returns {{status: "loading"|"ready"|"error", targets: object[], partial: boolean}}
 */
const useLinkTargets = () => {
	const [state, setState] = useState({
		status: "loading",
		targets: [],
		partial: false,
	});

	useEffect(() => {
		let isActive = true;
		fetchLinkTargets()
			.then(({ targets, partial }) => {
				if (isActive) setState({ status: "ready", targets, partial });
			})
			.catch(() => {
				if (isActive) {
					setState({ status: "error", targets: [], partial: false });
				}
			});
		return () => {
			isActive = false;
		};
	}, []);

	return state;
};

export default useLinkTargets;
export { resolveTargetUrl };
