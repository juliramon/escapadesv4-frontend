import { useState } from "react";
import ContentService from "../../services/contentService";
import {
	destinationUploadFolderKey,
	uploadCarouselMediaItems,
} from "../../utils/helpers";
import AdminModal from "../admin/AdminModal";
import ImageUploadField from "../admin/ImageUploadField";
import GalleryField from "../admin/GalleryField";
import {
	CheckboxField,
	ImagePreview,
	TextAreaField,
	TextField,
} from "../admin/FormFields";
import RichTextField from "../forms/RichTextField";
import useRichTextEditor, { htmlOf } from "../../hooks/useRichTextEditor";
import { readValidationError } from "../../utils/apiErrors";

/**
 * Modal de categories de viatge, per crear-ne una de nova o editar-ne una
 * d'existent.
 *
 * Substitueix `CreateTripCategoryModal` i `EditTripCategoryModal`.
 *
 * Respecte de la versió anterior:
 *  - Els sis editors es declaraven amb `extensions: [StarterKit, Image]` sense
 *    haver importat mai `@tiptap/extension-image`: el que hi arribava era el
 *    constructor `Image` del navegador.
 *  - Desar era una funció que deixava la pujada d'imatges a l'estat i un
 *    `useEffect` que vigilava tot l'objecte per disparar l'enviament.
 *  - Els errors de validació de l'API arriben dins d'una resposta correcta;
 *    ara es llegeixen i es mostren.
 */
const TripCategoryModal = ({
	mode = "create",
	visibility,
	hideModal,
	id,
	title,
	richTitle,
	image,
	carouselImages,
	country,
	mapLocation,
	reviewText,
	mostLikedText,
	pointsOfInterestText,
	mustSeeText,
	seoTextHeader,
	seoText,
	slug,
	isSponsored,
	isFeatured,
	sponsorURL,
	sponsorLogo,
	sponsorClaim,
	fetchData,
}) => {
	const isEdit = mode === "edit";
	const service = new ContentService();

	const [isSaving, setIsSaving] = useState(false);
	const [submitError, setSubmitError] = useState(null);

	const [tripCategory, setTripCategory] = useState({
		id: id || "",
		slug: slug || "",
		title: title || "",
		richTitle: richTitle || "",
		country: country || "",
		mapLocation: mapLocation || "",
		image: "",
		blopImage: "",
		cloudImage: image || "",
		updatedImage: false,
		carouselImages: carouselImages || [],
		blopCarouselImages: carouselImages || [],
		isSponsored: isSponsored || false,
		isFeatured: isFeatured || false,
		sponsorURL: sponsorURL || "",
		sponsorLogo: "",
		blopSponsorLogo: "",
		cloudSponsorLogo: sponsorLogo || "",
		updatedSponsorLogo: false,
		sponsorClaim: sponsorClaim || "",
	});

	const editorReviewText = useRichTextEditor(reviewText);
	const editorMostLikedText = useRichTextEditor(mostLikedText);
	const editorPointsOfInterestText = useRichTextEditor(pointsOfInterestText);
	const editorMustSeeText = useRichTextEditor(mustSeeText);
	const editorHeader = useRichTextEditor(seoTextHeader);
	const editorSeoText = useRichTextEditor(seoText);

	const handleChange = (e) =>
		setTripCategory((previous) => ({
			...previous,
			[e.target.name]: e.target.value,
		}));

	const handleCheck = (e) =>
		setTripCategory((previous) => ({
			...previous,
			[e.target.name]: e.target.checked,
		}));

	const saveSingleFile = (field) => (e) => {
		const fileToUpload = e.target.files[0];
		if (!fileToUpload) return;
		const capitalised = `${field[0].toUpperCase()}${field.slice(1)}`;
		setTripCategory((previous) => ({
			...previous,
			[field]: fileToUpload,
			[`blop${capitalised}`]: URL.createObjectURL(fileToUpload),
			[`updated${capitalised}`]: true,
		}));
	};

	const saveCarouselToStatus = (e) => {
		const files = Array.prototype.slice.call(e.target.files);
		if (!files.length) return;
		setTripCategory((previous) => ({
			...previous,
			carouselImages: [...previous.carouselImages, ...files],
			blopCarouselImages: [
				...previous.blopCarouselImages,
				...files.map((file) => URL.createObjectURL(file)),
			],
		}));
	};

	const removeCarouselImage = (index) =>
		setTripCategory((previous) => ({
			...previous,
			carouselImages: previous.carouselImages.filter(
				(_, idx) => idx !== index,
			),
			blopCarouselImages: previous.blopCarouselImages.filter(
				(_, idx) => idx !== index,
			),
		}));

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSaving) return;

		setIsSaving(true);
		setSubmitError(null);

		try {
			const uploadFolder = destinationUploadFolderKey(
				tripCategory.slug,
				tripCategory.title,
			);
			const upload = (payload) =>
				service.uploadFile(payload, uploadFolder);

			const uploadSingle = async (file, current) => {
				const uploadData = new FormData();
				uploadData.append("imageUrl", file);
				const uploaded = await upload(uploadData);
				return uploaded?.path || current;
			};

			const categoryImage = tripCategory.updatedImage
				? await uploadSingle(
						tripCategory.image,
						tripCategory.cloudImage,
					)
				: tripCategory.cloudImage;

			const categorySponsorLogo = tripCategory.updatedSponsorLogo
				? await uploadSingle(
						tripCategory.sponsorLogo,
						tripCategory.cloudSponsorLogo,
					)
				: tripCategory.cloudSponsorLogo;

			// Conserva les imatges que ja eren al servidor i només puja les noves.
			const categoryCarousel = await uploadCarouselMediaItems(
				tripCategory.carouselImages,
				upload,
			);

			const args = [
				tripCategory.slug,
				tripCategory.title,
				tripCategory.richTitle,
				categoryImage,
				categoryCarousel,
				tripCategory.country,
				tripCategory.mapLocation,
				htmlOf(editorReviewText),
				htmlOf(editorMostLikedText),
				htmlOf(editorPointsOfInterestText),
				htmlOf(editorMustSeeText),
				htmlOf(editorHeader),
				htmlOf(editorSeoText),
				tripCategory.isSponsored,
				tripCategory.isFeatured,
				tripCategory.sponsorURL,
				categorySponsorLogo,
				tripCategory.sponsorClaim,
			];

			const response = await (isEdit
				? service.editTripCategoryDetails(tripCategory.id, ...args)
				: service.createTripCategory(...args));

			const failure = readValidationError(response);
			if (failure) {
				setSubmitError(failure);
				setIsSaving(false);
				return;
			}

			hideModal();
			fetchData();
		} catch (error) {
			console.error(error);
			setSubmitError(
				error?.response?.data?.message ||
					error?.message ||
					"S'ha produït un error. Torna-ho a provar.",
			);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<AdminModal
			visibility={visibility}
			hideModal={hideModal}
			title={
				isEdit
					? "Edita la categoria de viatge"
					: "Crea una nova categoria de viatge"
			}
			footer={
				<button
					type="button"
					className="button button__primary button__med"
					onClick={handleSubmit}
					disabled={isSaving}
				>
					{isSaving
						? "Enviant…"
						: isEdit
							? "Modificar"
							: "Crear categoria"}
				</button>
			}
		>
			{submitError ? (
				<div
					className="mb-3 px-4 py-3 rounded-lg bg-red-50 text-red-800 text-sm border border-red-100"
					role="alert"
				>
					{submitError}
				</div>
			) : null}

			<form className="form" onSubmit={(e) => e.preventDefault()}>
				<TextField
					name="title"
					label="Títol de la categoria"
					placeholder="Entra el nom de la categoria de viatge"
					value={tripCategory.title}
					onChange={handleChange}
				/>
				<TextField
					name="richTitle"
					label="Títol enriquit"
					placeholder="Entra el títol enriquit"
					value={tripCategory.richTitle}
					onChange={handleChange}
				/>
				<TextField
					name="country"
					label="País"
					placeholder="Entra el país"
					value={tripCategory.country}
					onChange={handleChange}
				/>
				<TextAreaField
					name="mapLocation"
					label="Localització (iframe)"
					placeholder="Entra l'iframe de la localització"
					rows={6}
					value={tripCategory.mapLocation}
					onChange={handleChange}
				/>
				<ImageUploadField
					label="Imatge de la categoria"
					name="image"
					onChange={saveSingleFile("image")}
					hasImage={Boolean(
						tripCategory.image || tripCategory.cloudImage,
					)}
					preview={
						<ImagePreview
							blob={tripCategory.blopImage}
							current={tripCategory.cloudImage}
						/>
					}
				/>
				<GalleryField
					label="Carousel d'imatges"
					name="carouselImages"
					previews={tripCategory.blopCarouselImages}
					onChange={saveCarouselToStatus}
					onRemove={removeCarouselImage}
				/>
				<TextField
					name="slug"
					label="URL de la categoria"
					placeholder="Entra l'slug de la categoria"
					value={tripCategory.slug}
					onChange={handleChange}
				/>
				<CheckboxField
					name="isFeatured"
					label="Categoria destacada?"
					checked={tripCategory.isFeatured}
					onChange={handleCheck}
				/>
				<CheckboxField
					name="isSponsored"
					label="Categoria patrocinada?"
					checked={tripCategory.isSponsored}
					onChange={handleCheck}
				/>
				<TextField
					name="sponsorURL"
					label="URL del patrocinador"
					placeholder="Entra la URL del patrocinador"
					value={tripCategory.sponsorURL}
					onChange={handleChange}
				/>
				<ImageUploadField
					label="Logo del patrocinador"
					name="sponsorLogo"
					onChange={saveSingleFile("sponsorLogo")}
					hasImage={Boolean(
						tripCategory.sponsorLogo ||
						tripCategory.cloudSponsorLogo,
					)}
					preview={
						<ImagePreview
							blob={tripCategory.blopSponsorLogo}
							current={tripCategory.cloudSponsorLogo}
						/>
					}
				/>
				<TextField
					name="sponsorClaim"
					label="Claim del patrocinador"
					placeholder="Entra el claim del patrocinador"
					value={tripCategory.sponsorClaim}
					onChange={handleChange}
				/>
			</form>

			<RichTextField
				label="Review de la categoria"
				hint="reviewText"
				editor={editorReviewText}
			/>
			<RichTextField
				label="El que ens ha agradat més"
				hint="mostLikedText"
				editor={editorMostLikedText}
			/>
			<RichTextField
				label="Punts d'interès"
				hint="pointsOfInterestText"
				editor={editorPointsOfInterestText}
			/>
			<RichTextField
				label="Què s'ha de fer sí o sí"
				hint="mustSeeText"
				editor={editorMustSeeText}
			/>
			<RichTextField
				label="Text SEO header"
				hint="seoTextHeader"
				editor={editorHeader}
			/>
			<RichTextField
				label="Text SEO"
				hint="seoText"
				editor={editorSeoText}
			/>
		</AdminModal>
	);
};

export default TripCategoryModal;
