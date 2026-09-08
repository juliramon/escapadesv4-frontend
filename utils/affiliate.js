/**
 * Detecció del destí real dels enllaços de reserva.
 *
 * Els enllaços d'allotjament passen per la xarxa d'afiliació (CJ), que
 * embolcalla la URL final dins del paràmetre `url=`. Saber on acabarà
 * l'usuari permet dir-l'hi al botó —"Veure preus a Booking.com" converteix
 * bastant més que un "Reservar" a seques— i deixar clar que s'obrirà en una
 * pestanya nova.
 */

const AFFILIATE_TARGETS = [
	{ match: "booking.com", label: "Booking.com" },
	{ match: "centraldereservas", label: "Centraldereservas" },
	{ match: "civitatis", label: "Civitatis" },
	{ match: "getyourguide", label: "GetYourGuide" },
	{ match: "iatiseguros", label: "IATI Seguros" },
];

/** Treu la URL final d'un enllaç d'afiliació; si no n'és, torna la mateixa. */
const resolveTargetUrl = (website) => {
	if (!website || typeof website !== "string") return "";
	try {
		const parsed = new URL(website);
		const inner = parsed.searchParams.get("url");
		return inner ? decodeURIComponent(inner) : website;
	} catch (error) {
		return website;
	}
};

/**
 * @param {string} website
 * @returns {{label: string}|null} el partner de destí, si es reconeix
 */
const resolveAffiliate = (website) => {
	const target = resolveTargetUrl(website).toLowerCase();
	if (!target) return null;
	return (
		AFFILIATE_TARGETS.find((partner) => target.includes(partner.match)) ||
		null
	);
};

/** Un enllaç buit o marcat amb "-" compta com a inexistent. */
const hasLink = (value) =>
	Boolean(value) && value !== "-" && String(value).trim() !== "";

export { AFFILIATE_TARGETS, resolveTargetUrl, resolveAffiliate, hasLink };
