/**
 * handleFilesUpload
 *
 * Utility function to upload images to Cloudinary CDN
 * The function expects two parameters
 *
 * @param {string} coverImage
 * @param {array} bodyImages
 */

import ContentService from "../services/contentService";

const handleFilesUpload = async (coverImage, bodyImages) => {
	const service = new ContentService();

	const uploadCoverImage = async () => {
		const uploadData = new FormData();
		uploadData.append("imageUrl", coverImage);
		const response = await service.uploadFile(uploadData);
		return response.path;
	};

	const uploadedCover = await uploadCoverImage();
	let uploadedImages = [];

	const uploadBodyImages = async (index, bodyImages) => {
		const uploadData = new FormData();
		uploadData.append("imageUrl", bodyImages[index]);

		try {
			const uploadedFile = await service.uploadFile(uploadData);
			uploadedImages.push(uploadedFile.path);
			if (index + 1 < bodyImages.length) {
				await uploadBodyImages(index + 1, bodyImages);
			}
			if (uploadedImages.length === bodyImages.length) {
				return {
					uploadedCover,
					uploadedImages,
				};
			}
		} catch (error) {
			console.error(error);
		}
	};

	return await uploadBodyImages(0, bodyImages);
};

/**
 * removeImage
 *
 * Utility function to remove images from the state images array
 * The function expects three parameters
 *
 * @param {number} elIdx
 * @param {array} blopImages
 * @param {array} images
 */

const removeImage = (elIdx, blopImages, images) => {
	const arrBlopImages = blopImages;
	const arrImages = images;

	arrBlopImages.forEach((img, imgIdx) => {
		if (imgIdx === elIdx) {
			arrBlopImages.splice(elIdx, 1);
		}
	});

	arrImages.forEach((img, imgIdx) => {
		if (imgIdx === elIdx) {
			arrImages.splice(elIdx, 1);
		}
	});

	return {
		arrBlopImages,
		arrImages,
	};
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

export { handleFilesUpload, removeImage, formatDateTimeToISODate };
