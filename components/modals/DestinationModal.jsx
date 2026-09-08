import { useState } from "react";
import ContentService from "../../services/contentService";
import { uploadCarouselMediaItems } from "../../utils/helpers";
import {
	UPLOAD_MODELS,
	createUploader,
	uploadSingleFile,
} from "../../utils/uploads";
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
 * Modal de destinacions, per crear-ne una de nova o editar-ne una d'existent.
 *
 * Substitueix `CreateDestinationModal` i `EditDestinationModal`.
 *
 * Respecte de la versió anterior:
 *  - Els sis camps de text ric tenien cadascun el seu `useState` i el seu
 *    `onUpdate`; ara el contingut es llegeix de l'editor en desar.
 *  - Desar era una funció que deixava la pujada d'imatges a l'estat i un
 *    `useEffect` que vigilava tot l'objecte `destination` per disparar
 *    l'enviament. Qualsevol altre canvi d'estat el podia tornar a disparar.
 *    Ara és una sola funció asíncrona.
 *  - L'API respon amb els errors de validació dins d'una resposta correcta;
 *    ara es llegeixen i es mostren, com a la resta de formularis.
 */
const DestinationModal = ({
	mode = "create",
	visibility,
	hideModal,
	id,
	slug,
	title,
	longTitle,
	subtitle,
	image,
	reviewText,
	carouselImages,
	mapLocation,
	mostLikedText,
	pointsOfInterestText,
	mustSeeText,
	seoTextHeader,
	seoText,
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

	const [destination, setDestination] = useState({
		id: id || "",
		slug: slug || "",
		title: title || "",
		longTitle: longTitle || "",
		subtitle: subtitle || "",
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
		setDestination((previous) => ({
			...previous,
			[e.target.name]: e.target.value,
		}));

	const handleCheck = (e) =>
		setDestination((previous) => ({
			...previous,
			[e.target.name]: e.target.checked,
		}));

	const saveSingleFile = (field) => (e) => {
		const fileToUpload = e.target.files[0];
		if (!fileToUpload) return;
		setDestination((previous) => ({
			...previous,
			[field]: fileToUpload,
			[`blop${field[0].toUpperCase()}${field.slice(1)}`]:
				URL.createObjectURL(fileToUpload),
			[`updated${field[0].toUpperCase()}${field.slice(1)}`]: true,
		}));
	};

	const saveCarouselToStatus = (e) => {
		const files = Array.prototype.slice.call(e.target.files);
		if (!files.length) return;
		setDestination((previous) => ({
			...previous,
			carouselImages: [...previous.carouselImages, ...files],
			blopCarouselImages: [
				...previous.blopCarouselImages,
				...files.map((file) => URL.createObjectURL(file)),
			],
		}));
	};

	const removeCarouselImage = (index) =>
		setDestination((previous) => ({
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
			const upload = createUploader(
				service,
				UPLOAD_MODELS.destinations,
				destination,
			);

			const destinationImage = destination.updatedImage
				? await uploadSingleFile(
						upload,
						destination.image,
						destination.cloudImage,
					)
				: destination.cloudImage;

			const destinationSponsorLogo = destination.updatedSponsorLogo
				? await uploadSingleFile(
						upload,
						destination.sponsorLogo,
						destination.cloudSponsorLogo,
					)
				: destination.cloudSponsorLogo;

			// Conserva les imatges que ja eren al servidor i només puja les noves.
			const destinationCarousel = await uploadCarouselMediaItems(
				destination.carouselImages,
				upload,
			);

			const args = [
				destination.slug,
				destination.title,
				destination.longTitle,
				destination.subtitle,
				destinationImage,
				htmlOf(editorReviewText),
				destinationCarousel,
				destination.mapLocation,
				htmlOf(editorMostLikedText),
				htmlOf(editorPointsOfInterestText),
				htmlOf(editorMustSeeText),
				htmlOf(editorHeader),
				htmlOf(editorSeoText),
				destination.isSponsored,
				destination.isFeatured,
				destination.sponsorURL,
				destinationSponsorLogo,
				destination.sponsorClaim,
			];

			const response = await (isEdit
				? service.editDestination(destination.id, ...args)
				: service.createDestination(...args));

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
			title={isEdit ? "Edita la destinació" : "Crea una nova destinació"}
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
							: "Crear destinació"}
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
					label="Títol de la destinació"
					placeholder="Entra el nom de la destinació"
					value={destination.title}
					onChange={handleChange}
				/>
				<TextField
					name="longTitle"
					label="Títol llarg de la destinació"
					placeholder="Entra el títol llarg de la destinació"
					value={destination.longTitle}
					onChange={handleChange}
				/>
				<TextField
					name="subtitle"
					label="Subtítol de la destinació"
					placeholder="Entra el subtítol de la destinació"
					value={destination.subtitle}
					onChange={handleChange}
				/>
				<TextAreaField
					name="mapLocation"
					label="Localització de la destinació (iframe)"
					placeholder="Entra l'iframe de la localització de la destinació"
					rows={6}
					value={destination.mapLocation}
					onChange={handleChange}
				/>
				<ImageUploadField
					label="Imatge de la destinació"
					name="image"
					onChange={saveSingleFile("image")}
					hasImage={Boolean(
						destination.image || destination.cloudImage,
					)}
					preview={
						<ImagePreview
							blob={destination.blopImage}
							current={destination.cloudImage}
						/>
					}
				/>
				<GalleryField
					label="Carousel d'imatges"
					name="carouselImages"
					previews={destination.blopCarouselImages}
					onChange={saveCarouselToStatus}
					onRemove={removeCarouselImage}
				/>
				<TextField
					name="slug"
					label="URL de la destinació"
					placeholder="Entra l'slug de la destinació"
					value={destination.slug}
					onChange={handleChange}
				/>
				<CheckboxField
					name="isFeatured"
					label="Destinació destacada?"
					checked={destination.isFeatured}
					onChange={handleCheck}
				/>
				<CheckboxField
					name="isSponsored"
					label="Destinació patrocinada?"
					checked={destination.isSponsored}
					onChange={handleCheck}
				/>
				<TextField
					name="sponsorURL"
					label="URL del patrocinador"
					placeholder="Entra la URL del patrocinador"
					value={destination.sponsorURL}
					onChange={handleChange}
				/>
				<ImageUploadField
					label="Logo del patrocinador"
					name="sponsorLogo"
					onChange={saveSingleFile("sponsorLogo")}
					hasImage={Boolean(
						destination.sponsorLogo || destination.cloudSponsorLogo,
					)}
					preview={
						<ImagePreview
							blob={destination.blopSponsorLogo}
							current={destination.cloudSponsorLogo}
						/>
					}
				/>
				<TextField
					name="sponsorClaim"
					label="Claim del patrocinador"
					placeholder="Entra el claim del patrocinador"
					value={destination.sponsorClaim}
					onChange={handleChange}
				/>
			</form>

			<RichTextField
				label="Review de la destinació"
				hint="reviewText"
				editor={editorReviewText}
			/>
			<RichTextField
				label="El que ens ha agradat més de la destinació"
				hint="mostLikedText"
				editor={editorMostLikedText}
			/>
			<RichTextField
				label="Punts d'interès de la destinació"
				hint="pointsOfInterestText"
				editor={editorPointsOfInterestText}
			/>
			<RichTextField
				label="Què s'ha de fer sí o sí"
				hint="mustSeeText"
				editor={editorMustSeeText}
			/>
			<RichTextField
				label="Text SEO header de la destinació"
				hint="seoTextHeader"
				editor={editorHeader}
			/>
			<RichTextField
				label="Text SEO de la destinació"
				hint="seoText"
				editor={editorSeoText}
			/>
		</AdminModal>
	);
};

export default DestinationModal;
