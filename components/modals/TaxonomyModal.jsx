import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import slugify from "slugify";
import ContentService from "../../services/contentService";
import { readValidationError } from "../../utils/apiErrors";
import EditorNavbar from "../editor/EditorNavbar";
import AdminModal from "../admin/AdminModal";
import ImageUploadField from "../admin/ImageUploadField";
import {
	CheckboxField,
	ImagePreview,
	TextAreaField,
	TextField,
} from "../admin/FormFields";

/**
 * Modal de taxonomia: serveix per a categories i per a característiques.
 *
 * Substitueix quatre fitxers —`CreateCategoryModal`, `EditCategoryModal`,
 * `CreateCharacteristicModal` i `EditCharacteristicModal`— que sumaven 2.840
 * línies del mateix formulari. Els dos models tenen exactament els mateixos
 * camps, i els serveis, la mateixa signatura.
 *
 * De passada s'arreglen quatre coses que hi havia:
 *  - Els modals de crear només enviaven el formulari si havies pujat una
 *    imatge o un logo de patrocinador: sense fitxer, el botó no feia res i no
 *    deia per què.
 *  - Els modals d'editar no tenien el camp del nom en singular, així que no es
 *    podia canviar.
 *  - Passaven `Image` a TipTap sense importar-lo i agafaven el `window.Image`
 *    del navegador, de manera que l'extensió d'imatges no s'activava.
 *  - L'API respon els errors de validació amb estat HTTP 200, així que el
 *    formulari es tancava com si hagués desat. Ara es mostra l'error.
 */

const ENTITIES = {
	category: {
		newLabel: "Crea una nova categoria",
		editLabel: "Edita la categoria",
		createButton: "Crear categoria",
		editButton: "Editar categoria",
		singularLabel: "Nom en singular de la categoria",
		pluralLabel: "Nom en plural de la categoria",
		isPlaceLabel: "\u00c9s categoria d'allotjament?",
		titleLabel: "T\u00edtol de la categoria",
		subtitleLabel: "Subt\u00edtol de la categoria",
		seoHeaderLabel: "Text SEO header de la categoria",
		illustrationLabel: "Il\u00b7lustraci\u00f3 de la categoria",
		imageLabel: "Imatge de la categoria",
		captionLabel: "Peu de la imatge de la categoria",
		iconLabel: "Icona de la categoria",
		seoLabel: "Text SEO de la categoria",
		slugLabel: "URL de la categoria",
		featuredLabel: "Categoria destacada?",
		sponsoredLabel: "Categoria patrocinada?",
		create: "createCategory",
		update: "editCategory",
	},
	characteristic: {
		newLabel: "Crea una nova característica",
		editLabel: "Edita la característica",
		createButton: "Crear característica",
		editButton: "Editar característica",
		singularLabel: "Nom en singular de la característica",
		pluralLabel: "Nom en plural de la característica",
		isPlaceLabel: "\u00c9s característica d'allotjament?",
		titleLabel: "T\u00edtol de la característica",
		subtitleLabel: "Subt\u00edtol de la característica",
		seoHeaderLabel: "Text SEO header de la característica",
		illustrationLabel: "Il\u00b7lustraci\u00f3 de la característica",
		imageLabel: "Imatge de la característica",
		captionLabel: "Peu de la imatge de la característica",
		iconLabel: "Icona de la característica",
		seoLabel: "Text SEO de la característica",
		slugLabel: "URL de la característica",
		featuredLabel: "Característica destacada?",
		sponsoredLabel: "Característica patrocinada?",
		create: "createCharacteristic",
		update: "editCharacteristic",
	},
};
const TaxonomyModal = ({
	entity = "category",
	mode = "create",
	visibility,
	hideModal,
	fetchData,
	id,
	name,
	pluralName,
	isPlace,
	title,
	subtitle,
	illustration,
	image,
	imageCaption,
	icon,
	seoTextHeader,
	seoText,
	slug,
	isFeatured,
	isSponsored,
	sponsorURL,
	sponsorLogo,
	sponsorClaim,
}) => {
	const config = ENTITIES[entity] || ENTITIES.category;
	const isEdit = mode === "edit";
	const service = new ContentService();

	const [category, setCategory] = useState({
		id: id || "",
		name: name || "",
		pluralName: pluralName || "",
		isPlace: isPlace || false,
		title: title || "",
		subtitle: subtitle || "",
		illustration: illustration || "",
		blopIllustration: "",
		cloudIllustration: "",
		image: image || "",
		blopImage: "",
		cloudImage: "",
		imageCaption: imageCaption || "",
		icon: icon || "",
		slug: slug || "",
		isFeatured: isFeatured || false,
		isSponsored: isSponsored || false,
		sponsorURL: sponsorURL || "",
		sponsorLogo: sponsorLogo || "",
		blopSponsorLogo: "",
		cloudSponsorLogo: "",
		updatedIllustration: false,
		updatedImage: false,
		updatedSponsorLogo: false,
		isSubmitable: false,
	});

	const [editorDataHeader, setEditorDataHeader] = useState(
		seoTextHeader || ""
	);
	const [editorData, setEditorData] = useState(seoText || "");

	// Evita que un canvi d'estat posterior torni a disparar l'enviament: amb
	// `isSubmitable` a true, qualsevol `setCategory` reobria la petició.
	const hasSubmitted = useRef(false);
	const [errorMessage, setErrorMessage] = useState("");

	const editorHeader = useEditor({
		extensions: [StarterKit, Image],
		content: seoTextHeader || "",
		onUpdate: (props) => setEditorDataHeader(props.editor.getHTML()),
		autofocus: false,
		parseOptions: { preserveWhitespace: true },
	});

	const editor = useEditor({
		extensions: [StarterKit, Image],
		content: seoText || "",
		onUpdate: (props) => setEditorData(props.editor.getHTML()),
		autofocus: false,
		parseOptions: { preserveWhitespace: true },
	});

	const handleChange = (e) =>
		setCategory((previous) => ({
			...previous,
			[e.target.name]: e.target.value,
		}));

	const handleCheck = (e) => {
		const { name: field, checked } = e.target;
		setCategory((previous) => ({
			...previous,
			[field]: checked,
			// En desmarcar el patrocini es netegen les dades del patrocinador.
			// Abans ho feia un `useEffect` sense llista de dependències, que
			// s'avaluava a cada render.
			...(field === "isSponsored" && !checked
				? {
						sponsorURL: "",
						sponsorLogo: "",
						blopSponsorLogo: "",
						sponsorClaim: "",
				  }
				: {}),
		}));
	};

	const saveFileToStatus = (e) => {
		const fileToUpload = e.target.files[0];
		if (!fileToUpload) return;
		const field = e.target.name;
		const blobField = `blop${field.charAt(0).toUpperCase()}${field.slice(
			1
		)}`;
		const updatedField = `updated${field.charAt(0).toUpperCase()}${field.slice(
			1
		)}`;
		setCategory((previous) => ({
			...previous,
			[blobField]: URL.createObjectURL(fileToUpload),
			[field]: fileToUpload,
			[updatedField]: true,
		}));
	};

	const uploadIfNeeded = async (file, shouldUpload) => {
		if (!shouldUpload) return "";
		const uploadData = new FormData();
		uploadData.append("imageUrl", file);
		const uploaded = await service.uploadFile(uploadData);
		return uploaded != undefined ? uploaded.path : "";
	};

	const handleFileUpload = async () => {
		const [cloudImage, cloudSponsorLogo, cloudIllustration] =
			await Promise.all([
				uploadIfNeeded(category.image, category.updatedImage),
				uploadIfNeeded(
					category.sponsorLogo,
					category.updatedSponsorLogo
				),
				uploadIfNeeded(
					category.illustration,
					category.updatedIllustration
				),
			]);

		setCategory((previous) => ({
			...previous,
			cloudImage,
			cloudSponsorLogo,
			cloudIllustration,
			isSubmitable: true,
		}));
	};

	const submitCategory = async () => {
		if (hasSubmitted.current) return;
		hasSubmitted.current = true;

		const {
			cloudIllustration,
			cloudImage,
			cloudSponsorLogo,
			imageCaption: caption,
			icon: iconValue,
			sponsorURL: sponsor,
			sponsorClaim: claim,
		} = category;

		// En edició es conserva la imatge desada si no se n'ha pujat cap de
		// nova; en creació el valor només pot venir de la pujada.
		const resolvedIllustration =
			cloudIllustration !== ""
				? cloudIllustration
				: isEdit
				? category.illustration
				: "";
		const resolvedImage =
			cloudImage !== "" ? cloudImage : isEdit ? category.image : "";
		const resolvedSponsorLogo =
			cloudSponsorLogo !== ""
				? cloudSponsorLogo
				: isEdit
				? category.sponsorLogo
				: "";

		const request = isEdit
			? service[config.update](
					category.id,
					category.slug,
					category.name,
					category.pluralName,
					category.isPlace,
					category.title,
					category.subtitle,
					resolvedIllustration,
					resolvedImage,
					caption,
					iconValue,
					editorDataHeader,
					editorData,
					category.isSponsored,
					category.isFeatured,
					sponsor,
					resolvedSponsorLogo,
					claim
			  )
			: service[config.create](
					category.isFeatured,
					category.isSponsored,
					category.slug ||
						slugify(category.title, {
							remove: /[*+~.,()'"!:@]/g,
							lower: true,
						}),
					category.name,
					category.pluralName,
					category.isPlace,
					category.title,
					category.subtitle,
					resolvedIllustration,
					resolvedImage,
					caption,
					iconValue,
					editorDataHeader,
					editorData,
					sponsor,
					resolvedSponsorLogo,
					claim
			  );

		try {
			const response = await request;
			// L'API respon els errors de validació amb estat 200 i el cos de
			// l'error de Mongoose, així que el codi HTTP no serveix per saber
			// si ha anat bé: cal mirar el contingut.
			const failure = readValidationError(response);
			if (failure) {
				setErrorMessage(failure);
				hasSubmitted.current = false;
				setCategory((previous) => ({
					...previous,
					isSubmitable: false,
				}));
				return;
			}
			hideModal();
			fetchData();
		} catch (error) {
			console.error(error);
			setErrorMessage(
				"No s'ha pogut desar la categoria. Torna-ho a provar."
			);
			hasSubmitted.current = false;
			setCategory((previous) => ({ ...previous, isSubmitable: false }));
		}
	};

	useEffect(() => {
		if (category.isSubmitable) submitCategory();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [category.isSubmitable]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (
			category.updatedIllustration ||
			category.updatedImage ||
			category.updatedSponsorLogo
		) {
			handleFileUpload();
		} else {
			submitCategory();
		}
	};

	return (
		<AdminModal
			visibility={visibility}
			hideModal={hideModal}
			title={isEdit ? config.editLabel : config.newLabel}
			footer={
				<div className="flex flex-wrap items-center gap-x-4 gap-y-2 w-full">
					<button
						type="button"
						className="button button__primary button__med"
						onClick={handleSubmit}
					>
						{isEdit ? config.editButton : config.createButton}
					</button>
					{errorMessage ? (
						<span className="text-15 text-red-600">
							{errorMessage}
						</span>
					) : null}
				</div>
			}
		>
			<form className="form">
				<TextField
					name="name"
					label={config.singularLabel}
					placeholder="Entra el nom en singular de la categoria"
					value={category.name}
					onChange={handleChange}
				/>
				<TextField
					name="pluralName"
					label={config.pluralLabel}
					placeholder="Entra el nom en plural de la categoria"
					value={category.pluralName}
					onChange={handleChange}
				/>
				<CheckboxField
					name="isPlace"
					label={config.isPlaceLabel}
					checked={category.isPlace}
					onChange={handleCheck}
				/>
				<TextField
					name="title"
					label={config.titleLabel}
					placeholder="Entra el títol de la categoria"
					value={category.title}
					onChange={handleChange}
				/>
				<TextField
					name="subtitle"
					label={config.subtitleLabel}
					placeholder="Entra el subtítol de la categoria"
					value={category.subtitle}
					onChange={handleChange}
				/>

				<div className="form__group">
					<span className="form__label">
						{config.seoHeaderLabel}
					</span>
					<EditorNavbar editor={editorHeader} />
					<EditorContent
						editor={editorHeader}
						className="form-composer__editor"
					/>
				</div>

				<ImageUploadField
					label={config.illustrationLabel}
					name="illustration"
					onChange={saveFileToStatus}
					hasImage={Boolean(category.illustration)}
					preview={
						<ImagePreview
							blob={category.blopIllustration}
							current={illustration}
						/>
					}
				/>
				<ImageUploadField
					label={config.imageLabel}
					name="image"
					onChange={saveFileToStatus}
					hasImage={Boolean(category.image)}
					preview={
						<ImagePreview
							blob={category.blopImage}
							current={image}
						/>
					}
				/>

				<TextField
					name="imageCaption"
					label={config.captionLabel}
					placeholder="Entra la image caption de la categoria"
					value={category.imageCaption}
					onChange={handleChange}
				/>
				<TextAreaField
					name="icon"
					label={config.iconLabel}
					placeholder="Entra text svg de l'icona de la categoria"
					value={category.icon}
					onChange={handleChange}
				/>

				<div className="form__group">
					<span className="form__label">
						{config.seoLabel}
					</span>
					<EditorNavbar editor={editor} />
					<EditorContent
						editor={editor}
						className="form-composer__editor"
					/>
				</div>

				<TextField
					name="slug"
					label={config.slugLabel}
					placeholder="Entra l'slug de la categoria"
					value={category.slug}
					onChange={handleChange}
				/>
				<CheckboxField
					name="isFeatured"
					label={config.featuredLabel}
					checked={category.isFeatured}
					onChange={handleCheck}
				/>
				<CheckboxField
					name="isSponsored"
					label={config.sponsoredLabel}
					checked={category.isSponsored}
					onChange={handleCheck}
				/>

				<>
						<TextField
							name="sponsorURL"
							label="URL del patrocinador"
							placeholder="Entra la URL del patrocinador"
							value={category.sponsorURL}
							onChange={handleChange}
						/>
						<ImageUploadField
							label="Logo del patrocinador"
							name="sponsorLogo"
							onChange={saveFileToStatus}
							hasImage={Boolean(category.sponsorLogo)}
							preview={
								<ImagePreview
									blob={category.blopSponsorLogo}
									current={sponsorLogo}
								/>
							}
						/>
						<TextField
							name="sponsorClaim"
							label="Claim del patrocinador"
							placeholder="Entra el claim del patrocinador"
							value={category.sponsorClaim}
							onChange={handleChange}
						/>
				</>
			</form>
		</AdminModal>
	);
};

export default TaxonomyModal;
