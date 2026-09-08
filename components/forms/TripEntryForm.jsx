import { useEffect, useRef, useState } from "react";
import Router from "next/router";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import ContentService from "../../services/contentService";
import { uploadCarouselMediaItems } from "../../utils/helpers";
import EditorNavbar from "../editor/EditorNavbar";
import ImageUploadField from "../admin/ImageUploadField";
import GalleryField from "../admin/GalleryField";
import { ImagePreview, SelectField, TextField } from "../admin/FormFields";
import ContentFormLayout from "./ContentFormLayout";
import SeoFieldset from "./SeoFieldset";
import { readValidationError } from "../../utils/apiErrors";
import {
	UPLOAD_MODELS,
	createUploader,
	uploadSingleFile,
} from "../../utils/uploads";

/**
 * Formulari d'entrades de viatge, per crear-ne una de nova o editar-ne una
 * d'existent.
 *
 * Substitueix la duplicació entre `pages/nou-viatge.js` i
 * `pages/viatges/[categoria]/[slug]/editar.jsx` (1.404 línies en total).
 *
 * Errors que hi havia i que aquí queden resolts:
 *  - La pàgina de crear tenia un `useEffect` que llegia una variable `trip`
 *    inexistent: qualsevol canvi al formulari llançava un ReferenceError i
 *    deixava la pàgina inservible.
 *  - Totes dues desaven amb un ball de tres estats i un `useEffect` que
 *    vigilava `formData` per disparar l'enviament; si la pujada d'imatges
 *    fallava no passava res i el botó semblava mort. Ara el desat és una sola
 *    funció asíncrona amb missatge d'error.
 *  - L'editor reenviava tota la galeria a Cloudinary encara que no s'hagués
 *    tocat cap imatge.
 *  - La pàgina d'editar deia "Edita la història" al títol i als marcadors de
 *    posició, i marcava la categoria amb `selected` a l'`option` (React vol
 *    `value` al `select`).
 */

const TABS = [
	{ key: "main", label: "Contingut principal" },
	{ key: "imatges", label: "Imatges" },
	{ key: "seo", label: "SEO" },
];

/** La categoria arriba poblada en editar i com a id en crear. */
const tripId = (trip) => (trip && trip._id ? trip._id : trip || "");

const TripEntryForm = ({ mode = "create", initialData = null }) => {
	const isEdit = mode === "edit";
	const service = new ContentService();

	const [activeTab, setActiveTab] = useState("main");
	const [isSaving, setIsSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [tripCategories, setTripCategories] = useState([]);
	const hasLoadedState = useRef(false);
	const hasLoadedContent = useRef(false);

	const [formData, setFormData] = useState({
		_id: "",
		type: "tripEntry",
		trip: "",
		title: "",
		subtitle: "",
		slug: "",
		cover: "",
		blopCover: "",
		coverCloudImage: "",
		updatedCover: false,
		images: [],
		blopImages: [],
		metaTitle: "",
		metaDescription: "",
	});

	const editor = useEditor({
		extensions: [
			StarterKit,
			Image.configure({
				inline: false,
				HTMLAttributes: { class: "img-frame" },
			}),
			Placeholder.configure({
				placeholder: "Comença a escriure el viatge...",
			}),
			Link.configure({
				openOnClick: false,
				autolink: false,
				defaultProtocol: "https",
			}),
		],
		content: "",
		autofocus: false,
		parseOptions: { preserveWhitespace: true },
	});

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const categories = await service.getTripCategories();
				setTripCategories(categories || []);
			} catch (error) {
				console.error(error);
			}
		};
		fetchCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!initialData || hasLoadedState.current) return;
		hasLoadedState.current = true;

		const images = initialData.images || [];
		setFormData((previous) => ({
			...previous,
			_id: initialData._id || "",
			type: initialData.type || "tripEntry",
			trip: tripId(initialData.trip),
			title: initialData.title || "",
			subtitle: initialData.subtitle || "",
			slug: initialData.slug || "",
			coverCloudImage: initialData.cover || "",
			images,
			blopImages: images,
			metaTitle: initialData.metaTitle || "",
			metaDescription: initialData.metaDescription || "",
		}));
	}, [initialData]);

	// TipTap no està llest al primer render: si es carrega abans d'hora, el
	// cos de l'entrada queda buit.
	useEffect(() => {
		if (!initialData || !editor || hasLoadedContent.current) return;
		hasLoadedContent.current = true;
		editor.commands.setContent(initialData.description || "");
	}, [initialData, editor]);

	const handleChange = (e) =>
		setFormData((previous) => ({
			...previous,
			[e.target.name]: e.target.value,
		}));

	const saveCoverToStatus = (e) => {
		const fileToUpload = e.target.files[0];
		if (!fileToUpload) return;
		setFormData((previous) => ({
			...previous,
			blopCover: URL.createObjectURL(fileToUpload),
			cover: fileToUpload,
			updatedCover: true,
		}));
	};

	const saveGalleryToStatus = (e) => {
		const files = Array.prototype.slice.call(e.target.files);
		if (!files.length) return;
		setFormData((previous) => ({
			...previous,
			images: [...previous.images, ...files],
			blopImages: [
				...previous.blopImages,
				...files.map((file) => URL.createObjectURL(file)),
			],
		}));
	};

	const removeGalleryImage = (index) =>
		setFormData((previous) => ({
			...previous,
			images: previous.images.filter((_, idx) => idx !== index),
			blopImages: previous.blopImages.filter((_, idx) => idx !== index),
		}));

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSaving) return;

		setIsSaving(true);
		setErrorMessage("");

		try {
			const upload = createUploader(
				service,
				UPLOAD_MODELS.tripEntries,
				formData,
			);

			const cover = formData.updatedCover
				? await uploadSingleFile(
						upload,
						formData.cover,
						formData.coverCloudImage,
					)
				: formData.coverCloudImage;

			const images = await uploadCarouselMediaItems(
				formData.images,
				upload,
			);

			const description = editor ? editor.getHTML() : "";

			const response = isEdit
				? await service.editTripEntryDetails(
						formData._id,
						formData.slug,
						formData.title,
						formData.subtitle,
						cover,
						images,
						description,
						formData.metaTitle,
						formData.metaDescription,
						formData.trip,
					)
				: await service.tripEntry(
						formData.trip,
						formData.type,
						formData.slug,
						formData.title,
						formData.subtitle,
						cover,
						images,
						description,
						formData.metaTitle,
						formData.metaDescription,
					);

			const failure = readValidationError(response);
			if (failure) {
				setErrorMessage(failure);
				setIsSaving(false);
				return;
			}

			Router.push("/2i8ZXlkM4cFKUPBrm3-admin-panel");
		} catch (error) {
			console.error(error);
			setErrorMessage(
				"No s'ha pogut desar l'entrada de viatge. Torna-ho a provar.",
			);
			setIsSaving(false);
		}
	};

	return (
		<ContentFormLayout
			documentTitle={
				isEdit
					? "Edita l'entrada de viatge - Escapadesenparella.cat"
					: "Publicar una nova entrada de viatge - Escapadesenparella.cat"
			}
			title={
				isEdit
					? "Edita l'entrada de viatge"
					: "Publica una entrada de viatge"
			}
			description={
				isEdit
					? "Modifica el contingut de l'entrada de viatge"
					: "Explica una etapa del vostre viatge"
			}
			submitLabel={isEdit ? "Desar canvis" : "Publicar"}
			onSubmit={handleSubmit}
			isSaving={isSaving}
			errorMessage={errorMessage}
			tabs={TABS}
			activeTab={activeTab}
			onTabChange={setActiveTab}
		>
			{activeTab === "main" ? (
				<div className="form__wrapper">
					<form className="form" onSubmit={(e) => e.preventDefault()}>
						<SelectField
							name="trip"
							label="Categoria de viatge"
							value={formData.trip}
							onChange={handleChange}
							placeholder="Selecciona un viatge"
							options={tripCategories.map((category) => ({
								value: category._id,
								label: category.title,
							}))}
						/>
						<TextField
							name="title"
							label="Títol"
							placeholder="Títol de l'entrada de viatge"
							value={formData.title}
							onChange={handleChange}
						/>
						<TextField
							name="subtitle"
							label="Subtítol"
							placeholder="Introducció curta a l'entrada de viatge"
							value={formData.subtitle}
							onChange={handleChange}
						/>
					</form>

					{formData.images.length > 0 ? (
						<p className="text-primary-300 text-sm mb-2">
							Hi ha{" "}
							<strong>{formData.images.length} imatges</strong>{" "}
							disponibles. Fes servir el shortcut{" "}
							<strong>post_images(n, m + 1)</strong> per
							inserir-les a la publicació.
						</p>
					) : null}

					<EditorNavbar editor={editor} />
					<EditorContent
						editor={editor}
						className="form-composer__editor"
					/>
				</div>
			) : null}

			{activeTab === "imatges" ? (
				<div className="form__wrapper">
					<form className="form" onSubmit={(e) => e.preventDefault()}>
						<ImageUploadField
							label="Imatge de portada (1729x973px)"
							name="cover"
							onChange={saveCoverToStatus}
							hasImage={Boolean(
								formData.cover || formData.coverCloudImage,
							)}
							preview={
								<ImagePreview
									blob={formData.blopCover}
									current={formData.coverCloudImage}
								/>
							}
						/>
						<GalleryField
							label="Imatges de la publicació"
							previews={formData.blopImages}
							onChange={saveGalleryToStatus}
							onRemove={removeGalleryImage}
						/>
					</form>
				</div>
			) : null}

			{activeTab === "seo" ? (
				<SeoFieldset values={formData} onChange={handleChange} />
			) : null}
		</ContentFormLayout>
	);
};

export default TripEntryForm;
