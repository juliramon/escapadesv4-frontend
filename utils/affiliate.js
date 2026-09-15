/**
 * Detecció del destí real dels enllaços de reserva.
 *
 * Els enllaços d'allotjament passen per la xarxa d'afiliació (CJ), que
 * embolcalla la URL final dins del paràmetre `url=`. Saber on acabarà
 * l'usuari permet dir-l'hi al botó —"Veure preus a Booking.com" converteix
 * bastant més que un "Reservar" a seques— i deixar clar que s'obrirà en una
 * pestanya nova.
 *
 * El mateix coneixement serveix per marcar-los com cal: Google demana
 * `rel="sponsored"` als enllaços pagats o d'afiliació, i fins ara tots els
 * externs sortien només amb `nofollow` (`utils/internalLinks.js`).
 */

const AFFILIATE_TARGETS = [
	{ match: "booking.com", label: "Booking.com" },
	{ match: "centraldereservas", label: "Centraldereservas" },
	{ match: "civitatis", label: "Civitatis" },
	{ match: "getyourguide", label: "GetYourGuide" },
	{ match: "iatiseguros", label: "IATI Seguros" },
];

/**
 * Dominis que només existeixen per redirigir a través d'una xarxa
 * d'afiliació: si l'enllaç hi passa, és d'afiliació segur.
 */
const AFFILIATE_NETWORK_HOSTS = [
	// Commission Junction
	"anrdoezrs.net",
	"jdoqocy.com",
	"tkqlhce.com",
	"dpbolvw.net",
	"kqzyfj.com",
	"qksrv.net",
	// Awin
	"awin1.com",
	"tidd.ly",
	// Impact, Rakuten, TradeDoubler, TradeTracker
	"prf.hn",
	"linksynergy.com",
	"tradedoubler.com",
	"tradetracker.net",
];

/**
 * Paràmetres que identifiquen qui cobra la comissió. N'hi ha de generals,
 * propis de cada xarxa, i n'hi ha que només compten al web del partner: `tag`
 * és l'identificador d'Amazon, però en un altre web pot ser una etiqueta de
 * blog qualsevol.
 */
const AFFILIATE_PARAMS = [
	"affiliate",
	"affiliate_id",
	"affiliateid",
	"aff",
	"aff_id",
	"cjevent",
	"awc",
	"irclickid",
	"ranmid",
	"ransiteid",
	"partner_id",
	"partnerid",
];

const HOST_AFFILIATE_PARAMS = [
	{ match: "amazon.", params: ["tag", "ascsubtag"] },
	{ match: "booking.com", params: ["aid", "label"] },
	{ match: "centraldereservas", params: ["idafiliado", "afiliado"] },
	{ match: "civitatis", params: ["aid", "partner", "ag"] },
	{ match: "getyourguide", params: ["partner_id", "cmp"] },
	{ match: "iatiseguros", params: ["agencia", "partner"] },
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

/**
 * `true` si l'enllaç fa guanyar una comissió: passa per una xarxa
 * d'afiliació, embolcalla la destinació dins del paràmetre `url=` o porta el
 * paràmetre que identifica el web com a afiliat.
 *
 * Es queda curt a posta: val més deixar un enllaç per marcar que marcar-ne un
 * de normal com a pagat. Els que queden fora els llista l'script de
 * manteniment perquè es revisin a mà.
 *
 * @param {string} url
 * @returns {boolean}
 */
const isAffiliateUrl = (url) => {
	let parsed;
	try {
		parsed = new URL(String(url || "").trim());
	} catch (error) {
		return false;
	}
	if (!/^https?:$/i.test(parsed.protocol)) return false;

	const host = parsed.hostname.toLowerCase();
	if (AFFILIATE_NETWORK_HOSTS.some((network) => host.endsWith(network))) {
		return true;
	}

	// L'embolcall de CJ: la destinació real viatja dins de `url=`.
	const wrapped = parsed.searchParams.get("url");
	if (wrapped && /^https?:\/\//i.test(decodeURIComponent(wrapped)))
		return true;

	const params = new Set(
		[...parsed.searchParams.keys()].map((key) => key.toLowerCase()),
	);
	if (AFFILIATE_PARAMS.some((param) => params.has(param))) return true;

	return HOST_AFFILIATE_PARAMS.some(
		(partner) =>
			host.includes(partner.match) &&
			partner.params.some((param) => params.has(param)),
	);
};

/** Un enllaç buit o marcat amb "-" compta com a inexistent. */
const hasLink = (value) =>
	Boolean(value) && value !== "-" && String(value).trim() !== "";

export {
	AFFILIATE_TARGETS,
	AFFILIATE_NETWORK_HOSTS,
	resolveTargetUrl,
	resolveAffiliate,
	isAffiliateUrl,
	hasLink,
};
