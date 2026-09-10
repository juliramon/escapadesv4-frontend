import slugify from "slugify";

/**
 * Anàlisi SEO dels formularis de composició.
 *
 * Els formularis demanaven el meta títol, la meta descripció i el slug sense
 * dir mai si el que s'hi escrivia era bo: ni la llargada, ni si el slug tenia
 * accents o espais, ni si la publicació tenia prou text. Aquí viuen totes les
 * comprovacions, que són les mateixes per a fitxes, històries, llistes i
 * entrades de viatge.
 *
 * És codi pur, sense React: així es pot fer servir tant per pintar els
 * indicadors com per calcular la puntuació que surt a la pestanya.
 */

/** Límits amb què treballen Google i la resta d'eines de SEO. */
const SEO_LIMITS = {
	metaTitle: { min: 30, max: 60 },
	metaDescription: { min: 70, max: 160 },
	slug: { max: 75 },
	words: { min: 300 },
};

const SITE_URL = "https://escapadesenparella.cat";

/** Slug net a partir d'un text lliure. */
const buildSlug = (value) =>
	slugify(String(value || ""), {
		lower: true,
		strict: true,
		trim: true,
	});

/** Text pla d'un HTML de l'editor, per comptar paraules i cercar la paraula clau. */
const stripHtml = (html) =>
	String(html || "")
		.replace(/<[^>]*>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/&[a-z]+;/g, " ")
		.replace(/\s+/g, " ")
		.trim();

const countWords = (html) => {
	const text = stripHtml(html);
	return text ? text.split(" ").length : 0;
};

/** Sense accents i en minúscules, per comparar la paraula clau amb el text. */
const normalize = (value) =>
	String(value || "")
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");

/**
 * La paraula clau es dona per trobada quan hi surten totes les seves paraules,
 * no quan hi surt la frase literal: "globus Cerdanya" es considera present a
 * "Passeig en globus per la Cerdanya", que és com s'escriuen els títols.
 */
const containsKeyword = (text, keyword) => {
	if (!keyword) return false;
	const haystack = normalize(text);
	const words = normalize(keyword)
		.split(/[^a-z0-9]+/)
		.filter((word) => word.length > 2);
	if (!words.length) return haystack.includes(normalize(keyword));
	return words.every((word) => haystack.includes(word));
};

/**
 * Estat d'un camp de llargada acotada.
 *
 * @returns {"empty"|"short"|"ok"|"long"}
 */
const lengthState = (value, limits) => {
	const length = String(value || "").length;
	if (length === 0) return "empty";
	if (length < limits.min) return "short";
	if (length > limits.max) return "long";
	return "ok";
};

const STATUS_WEIGHT = { ok: 1, warn: 0.5, error: 0 };

/**
 * @param {object} input dades del formulari
 * @param {string} input.title títol de la publicació
 * @param {string} [input.subtitle]
 * @param {string} [input.metaTitle]
 * @param {string} [input.metaDescription]
 * @param {string} [input.slug]
 * @param {string} [input.html] cos de la publicació
 * @param {boolean} [input.hasCover]
 * @param {string} [input.keyword] paraula clau objectiu
 * @returns {{score: number, level: string, checks: object[], counts: object}}
 */
const analyzeSeo = ({
	title = "",
	subtitle = "",
	metaTitle = "",
	metaDescription = "",
	slug = "",
	html = "",
	hasCover = false,
	keyword = "",
}) => {
	const body = String(html || "");
	const text = stripHtml(body);
	const words = text ? text.split(" ").length : 0;
	const titleState = lengthState(metaTitle, SEO_LIMITS.metaTitle);
	const descriptionState = lengthState(
		metaDescription,
		SEO_LIMITS.metaDescription,
	);
	const images = body.match(/<img[^>]*>/gi) || [];
	const imagesWithoutAlt = images.filter(
		(image) => !/alt\s*=\s*"[^"]+"/i.test(image),
	);
	const headings = (body.match(/<h[23][^>]*>/gi) || []).length;
	const links = (body.match(/<a[^>]*href=/gi) || []).length;
	const cleanSlug = buildSlug(slug);

	const checks = [];
	const add = (check) => checks.push({ weight: 1, ...check });

	add({
		id: "title",
		label: "Títol de la publicació",
		status: title.trim() ? "ok" : "error",
		hint: title.trim()
			? "El títol és el primer senyal que llegeix Google."
			: "Sense títol la publicació no es pot indexar bé.",
	});

	add({
		id: "metaTitle",
		label: `Meta títol (${metaTitle.length} car.)`,
		weight: 2,
		status:
			titleState === "ok"
				? "ok"
				: titleState === "empty"
					? "error"
					: "warn",
		hint: {
			empty: "Encara no n'hi ha cap: Google hi posarà el títol de la publicació.",
			short: `Queda curt. Entre ${SEO_LIMITS.metaTitle.min} i ${SEO_LIMITS.metaTitle.max} caràcters aprofita tot l'espai del resultat.`,
			long: `Massa llarg. A partir de ${SEO_LIMITS.metaTitle.max} caràcters Google el talla.`,
			ok: "Llargada correcta.",
		}[titleState],
	});

	add({
		id: "metaDescription",
		label: `Meta descripció (${metaDescription.length} car.)`,
		weight: 2,
		status:
			descriptionState === "ok"
				? "ok"
				: descriptionState === "empty"
					? "error"
					: "warn",
		hint: {
			empty: "Sense meta descripció, Google es munta el resum com pot.",
			short: `Queda curta. Mira d'arribar als ${SEO_LIMITS.metaDescription.min} caràcters.`,
			long: `Massa llarga. A partir de ${SEO_LIMITS.metaDescription.max} caràcters es talla.`,
			ok: "Llargada correcta.",
		}[descriptionState],
	});

	const slugStatus = !slug.trim()
		? "error"
		: slug !== cleanSlug || slug.length > SEO_LIMITS.slug.max
			? "warn"
			: "ok";
	add({
		id: "slug",
		label: "Slug de la URL",
		status: slugStatus,
		hint: !slug.trim()
			? "Cal un slug per publicar."
			: slug !== cleanSlug
				? `Té majúscules, accents o símbols. Hauria de ser «${cleanSlug}».`
				: slug.length > SEO_LIMITS.slug.max
					? "És llarg; les URL curtes es comparteixen millor."
					: "Slug net.",
	});

	add({
		id: "words",
		label: `Extensió del contingut (${words} paraules)`,
		status:
			words >= SEO_LIMITS.words.min ? "ok" : words > 0 ? "warn" : "error",
		hint:
			words >= SEO_LIMITS.words.min
				? "Prou text per posicionar."
				: `Les publicacions que posicionen passen de les ${SEO_LIMITS.words.min} paraules.`,
	});

	add({
		id: "headings",
		label: "Subtítols (H2/H3)",
		status: headings >= 2 ? "ok" : headings === 1 ? "warn" : "error",
		hint:
			headings >= 2
				? `${headings} subtítols dins del text.`
				: "Parteix el text amb subtítols: ajuda a llegir-lo i a entendre'l.",
	});

	add({
		id: "cover",
		label: "Imatge de portada",
		status: hasCover ? "ok" : "error",
		hint: hasCover
			? "Hi ha portada per als resultats i les xarxes."
			: "Sense portada, l'enllaç es comparteix sense imatge.",
	});

	add({
		id: "alt",
		label: "Text alternatiu de les imatges",
		status:
			images.length === 0 ? "warn" : imagesWithoutAlt.length ? "warn" : "ok",
		hint:
			images.length === 0
				? "El cos del text no té cap imatge."
				: imagesWithoutAlt.length
					? `${imagesWithoutAlt.length} de ${images.length} imatges no tenen text alternatiu.`
					: "Totes les imatges tenen text alternatiu.",
	});

	add({
		id: "links",
		label: "Enllaços dins del text",
		status: links > 0 ? "ok" : "warn",
		hint:
			links > 0
				? `${links} enllaços.`
				: "Enllaça altres publicacions del web per repartir autoritat.",
	});

	add({
		id: "subtitle",
		label: "Subtítol",
		weight: 0,
		status: subtitle && subtitle.trim() ? "ok" : "warn",
		hint: "El subtítol encapçala la publicació i sol ser el millor esborrany de la meta descripció.",
	});

	if (keyword && keyword.trim()) {
		const inTitle = containsKeyword(metaTitle || title, keyword);
		const inDescription = containsKeyword(metaDescription, keyword);
		const inSlug = containsKeyword(slug, keyword);
		const inText = containsKeyword(text.slice(0, 600), keyword);

		add({
			id: "keyword-title",
			label: "Paraula clau al títol",
			status: inTitle ? "ok" : "warn",
			hint: inTitle
				? "Hi és."
				: "Google marca en negreta la paraula clau dins del títol.",
		});
		add({
			id: "keyword-description",
			label: "Paraula clau a la meta descripció",
			status: inDescription ? "ok" : "warn",
			hint: inDescription ? "Hi és." : "Encara no hi surt.",
		});
		add({
			id: "keyword-slug",
			label: "Paraula clau al slug",
			status: inSlug ? "ok" : "warn",
			hint: inSlug ? "Hi és." : "Encara no hi surt.",
		});
		add({
			id: "keyword-intro",
			label: "Paraula clau a l'entrada del text",
			status: inText ? "ok" : "warn",
			hint: inText
				? "Surt al primer tros del contingut."
				: "Mira de fer-la sortir als primers paràgrafs.",
		});
	} else {
		add({
			id: "keyword",
			label: "Paraula clau objectiu",
			weight: 0,
			status: "warn",
			hint: "Indica-la aquí sota i es comprovarà on surt.",
		});
	}

	const weighted = checks.filter((check) => check.weight > 0);
	const obtained = weighted.reduce(
		(total, check) => total + check.weight * STATUS_WEIGHT[check.status],
		0,
	);
	const total = weighted.reduce((sum, check) => sum + check.weight, 0);
	const score = total ? Math.round((obtained / total) * 100) : 0;

	return {
		score,
		level: score >= 80 ? "good" : score >= 50 ? "ok" : "poor",
		checks,
		counts: {
			metaTitle: metaTitle.length,
			metaDescription: metaDescription.length,
			slug: slug.length,
			words,
			images: images.length,
			headings,
			links,
		},
	};
};

/**
 * Puntuació de SEO a partir de les metadades, sense el cos de la publicació.
 *
 * Els llistats del panell arriben retallats des de l'API —enviar la descripció
 * sencera de cent fitxes per pintar una llista seria absurd—, o sigui que aquí
 * només es miren els senyals que hi caben: títol, meta títol, meta descripció,
 * slug i portada. És la meitat de `analyzeSeo`, la que es pot respondre sense
 * llegir el text, i per això es puntua a part: barrejar-la amb la puntuació
 * completa faria semblar dolentes publicacions que només estan sense mirar.
 *
 * @param {object} input
 * @returns {{score: number, level: string, checks: object[]}}
 */
const analyzeListingSeo = ({
	title = "",
	subtitle = "",
	metaTitle = "",
	metaDescription = "",
	slug = "",
	hasCover = false,
}) => {
	// A les taxonomies, el que fa de meta títol i de meta descripció són camps
	// del document (el títol, el subtítol o el text SEO de capçalera) i alguns
	// s'editen amb l'editor de text ric: es mesura el text, no les etiquetes.
	metaTitle = stripHtml(metaTitle);
	metaDescription = stripHtml(metaDescription);

	const titleState = lengthState(metaTitle, SEO_LIMITS.metaTitle);
	const descriptionState = lengthState(
		metaDescription,
		SEO_LIMITS.metaDescription,
	);
	const cleanSlug = buildSlug(slug);

	const checks = [
		{
			id: "title",
			label: "Títol",
			weight: 1,
			status: title.trim() ? "ok" : "error",
		},
		{
			id: "metaTitle",
			label: `Meta títol (${metaTitle.length} car.)`,
			weight: 2,
			status:
				titleState === "ok"
					? "ok"
					: titleState === "empty"
						? "error"
						: "warn",
		},
		{
			id: "metaDescription",
			label: `Meta descripció (${metaDescription.length} car.)`,
			weight: 2,
			status:
				descriptionState === "ok"
					? "ok"
					: descriptionState === "empty"
						? "error"
						: "warn",
		},
		{
			id: "slug",
			label: "Slug",
			weight: 1,
			status: !slug.trim()
				? "error"
				: slug !== cleanSlug || slug.length > SEO_LIMITS.slug.max
					? "warn"
					: "ok",
		},
		{
			id: "cover",
			label: "Imatge de portada",
			weight: 1,
			status: hasCover ? "ok" : "error",
		},
		{
			id: "subtitle",
			label: "Subtítol",
			weight: 0,
			status: subtitle && subtitle.trim() ? "ok" : "warn",
		},
	];

	const weighted = checks.filter((check) => check.weight > 0);
	const obtained = weighted.reduce(
		(total, check) => total + check.weight * STATUS_WEIGHT[check.status],
		0,
	);
	const total = weighted.reduce((sum, check) => sum + check.weight, 0);
	const score = total ? Math.round((obtained / total) * 100) : 0;

	return {
		score,
		level: score >= 80 ? "good" : score >= 50 ? "ok" : "poor",
		checks,
	};
};

/**
 * Com es veurà el resultat a Google. El cercador talla pel píxel i no pel
 * caràcter, o sigui que això és una guia i no una mesura exacta.
 */
const serpPreview = ({
	metaTitle,
	title,
	metaDescription,
	subtitle,
	path,
}) => ({
	title: (metaTitle || title || "Sense títol").slice(0, 68),
	description: (
		metaDescription ||
		stripHtml(subtitle) ||
		"Sense meta descripció."
	).slice(0, 180),
	url: `${SITE_URL}${path || "/"}`,
});

export {
	SEO_LIMITS,
	analyzeListingSeo,
	SITE_URL,
	analyzeSeo,
	buildSlug,
	countWords,
	lengthState,
	serpPreview,
	stripHtml,
};
