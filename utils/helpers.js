/**
 * HandleFilesUpload
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

	const uploadedCover = uploadCoverImage();
	let uploadedImages = [];

	const uploadBodyImages = (index, bodyImages) => {
		const uploadData = new FormData();
		uploadData.append("imageUrl", bodyImages[index]);

		try {
			service.uploadFile(uploadData).then((res) => {
				uploadedImages.push(res.path);
				if (index + 1 < bodyImages.length)
					uploadBodyImages(index + 1, bodyImages);
			});
		} catch (error) {
			console.error(error);
		}
	};

	uploadBodyImages(0, bodyImages);

	if (uploadedImages.length === bodyImages.length) {
		setState({
			...state,
			formData: {
				...state.formData,
				cloudImages: uploadedImages,
				coverCloudImage: uploadedCover.path,
				cloudImagesUploaded: true,
				coverCloudImageUploaded: true,
			},
		});
	}
};

/**
 * RemoveImage
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

export { handleFilesUpload, removeImage };
