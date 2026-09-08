/**
 * Single segment for getaways-guru/{model}/{segment}/ — prefer slug, else slugified title.
 * Ignores the literal "slug" used as an empty placeholder in some forms.
 */
const destinationUploadFolderKey = (slug, title) => {
	let key = (slug || "").trim();
	if (key === "slug") {
		key = "";
	}
	if (key) return key;
	if (title && typeof title === "string") {
		key = title
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "")
			.slice(0, 80);
	}
	return key || "sense-slug";
};

/**
 * Align activity/place destination values with checkbox values (Mongo _id strings).
 * Accepts stored slugs or id strings; returns unique id strings using loaded docs.
 */
const normalizeDestinationRefsToIds = (refs, destinationDocs) => {
	if (!Array.isArray(refs)) return [];
	if (!Array.isArray(destinationDocs) || destinationDocs.length === 0) {
		return [...refs].filter((r) => r != null && r !== "");
	}
	return [
		...new Set(
			refs
				.map((ref) => {
					if (ref == null || ref === "") return null;
					const s = String(ref);
					const byId = destinationDocs.find(
						(d) => d._id != null && String(d._id) === s,
					);
					if (byId) return String(byId._id);
					const bySlug = destinationDocs.find((d) => d.slug === s);
					if (bySlug) return String(bySlug._id);
					return s;
				})
				.filter(Boolean),
		),
	];
};

/**
 * Upload File entries in a carousel list; keep existing remote URL strings.
 *
 * @param {Array<File|string>} items
 * @param {(formData: FormData) => Promise<{ path: string }>} uploadFile
 */
const uploadCarouselMediaItems = async (items, uploadFile) => {
	const paths = [];
	for (const item of items) {
		if (typeof File !== "undefined" && item instanceof File) {
			const uploadData = new FormData();
			uploadData.append("imageUrl", item);
			const uploadedFile = await uploadFile(uploadData);
			paths.push(uploadedFile.path);
		} else if (item != null && item !== "") {
			paths.push(item);
		}
	}
	return paths;
};

/**
 * formatDateTimeToISODate
 *
 * Utility function to convert datetime values to formatted date
 * The function expects one parameter:
 *
 * @param {string} storyDetails
 */

const formatDateTimeToISODate = (datetime) => {
	return new Date(datetime).toLocaleDateString("ca-es", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

/**
 * getSeasonPictures
 *
 * Utility function to select an image from an object of seasons
 * based on the current date.
 * The function expects two parameters:
 *
 * @param {string} thisDate
 * @param {object} objImages
 */

const getPicturesBySeason = (thisDate, objImages) => {
	const currentYear = thisDate.getFullYear();
	const lastYear = thisDate.getFullYear() - 1;
	const nextYear = thisDate.getFullYear() + 1;
	const currentMonth = thisDate.getMonth() + 1;
	const currentDay = thisDate.getUTCDate();

	let currentDate = currentMonth + "/" + currentDay + "/" + currentYear;
	// currentDate = '01/21/2024';

	const triggers = {
		spring: "03/21/" + currentYear,
		summer: "06/21/" + currentYear,
		autumn: "09/21/" + currentYear,
		winter: "12/21/" + currentYear,
	};

	const triggersLastYear = {
		spring: "03/21/" + lastYear,
		summer: "06/21/" + lastYear,
		autumn: "09/21/" + lastYear,
		winter: "12/21/" + lastYear,
	};

	const triggersNextYear = {
		spring: "03/21/" + nextYear,
		summer: "06/21/" + nextYear,
		autumn: "09/21/" + nextYear,
		winter: "12/21/" + nextYear,
	};

	let selectedImages;

	switch (true) {
		case (new Date(currentDate) <= new Date(triggers.spring) &&
			new Date(currentDate) >= new Date(triggersLastYear.winter)) ||
			(new Date(currentDate) >= new Date(triggers.winter) &&
				new Date(currentDate) <= new Date(triggersNextYear.spring)):
			selectedImages = objImages.winter;
			break;
		case new Date(currentDate) <= new Date(triggers.summer) &&
			new Date(currentDate) >= new Date(triggers.spring):
			selectedImages = objImages.spring;
			break;
		case new Date(currentDate) <= new Date(triggers.autumn) &&
			new Date(currentDate) >= new Date(triggers.summer):
			selectedImages = objImages.summer;
			break;
		case new Date(currentDate) <= new Date(triggers.winter) &&
			new Date(currentDate) >= new Date(triggers.autumn):
			selectedImages = objImages.autumn;
			break;
	}

	return selectedImages;
};

/**
 * copyContentToClipboard
 *
 * Utility function to copy the innerText of the clicked element into the clipboard
 *
 * @param {object} e
 */

const copyTextToClipboard = (e) => {
	e.preventDefault();
	navigator.clipboard.writeText(e.currentTarget.innerText);
};

export {
	destinationUploadFolderKey,
	normalizeDestinationRefsToIds,
	uploadCarouselMediaItems,
	formatDateTimeToISODate,
	getPicturesBySeason,
	copyTextToClipboard,
};
