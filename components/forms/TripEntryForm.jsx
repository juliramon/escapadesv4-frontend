import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Router from "next/router";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import ContentService from "../../services/contentService";
import { uploadCarouselMediaItems } from "../../utils/helpers";
import EditorNavbar from "../editor/EditorNavbar";
import GalleryBlock from "../editor/GalleryBlock";
import ImageUploadField from "../admin/ImageUploadField";
import GalleryField from "../admin/GalleryField";
import { ImagePreview, SelectField, TextField } from "../admin/FormFields";
import ContentFormLayout, { ADMIN_PANEL_PATH } from "./ContentFormLayout";
import FormSection from "./FormSection";
import SeoFieldset from "./SeoFieldset";
import { SeoScoreBadge } from "./SeoScore";
import useAutosaveDraft from "../../hooks/useAutosaveDraft";
import useEditorRevision from "../../hooks/useEditorRevision";
import useSeoKeyword from "../../hooks/useSeoKeyword";
import { analyzeSeo, buildSlug } from "../../utils/seo";
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

/** Camps que van a l'esborrany local: la resta són fitxers o identificadors. */
const DRAFT_FIELDS = [
	"title",
	"subtitle",
	"slug",
	"metaTitle",
	"metaDescription",
	"trip",
];

/** La categoria arriba poblada en editar i com a id en crear. */
const tripId = (trip) => (trip && trip._id ? trip._id : trip || "");

const TripEntryForm = ({ mode = "create", initialData = null }) => {
	const isEdit = mode === "edit";
	const service = useMemo(() => new ContentService(), []);

	const [activeTab, setActiveTab] = useState("main");
	const [isSaving, setIsSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [isReady, setIsReady] = useState(false);
	const [tripCategories, setTripCategories] = useState([]);
	const hasLoadedState = useRef(false);
	const hasLoadedContent = useRef(false);
	const hasTouchedSlug = useRef(isEdit);

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

	// El bloc de galeria puja les imatges en el moment de triar-les. La
	// funció de pujada depèn del slug, que canvia mentre s'escriu, i va per
	// referència perquè l'editor no s'hagi de refer a cada lletra.
	const uploadRef = useRef(null);
	useEffect(() => {
		uploadRef.current = createUploader(
			service,
			UPLOAD_MODELS.tripEntries,
			formData,
		);
	}, [service, formData.slug, formData.title]);

	const editor = useEditor({
		extensions: [
			StarterKit,
			GalleryBlock.configure({ uploadRef }),
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

	const editorRevision = useEditorRevision([editor]);
	const description = useMemo(
		() => (editor ? editor.getHTML() : ""),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[editor, editorRevision],
	);

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
	}, [service]);

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
		setIsReady(true);
	}, [initialData, editor]);

	// L'estat de partida no es pot prendre fins que TipTap existeix: al primer
	// render encara no hi ha editor i el cos es llegiria com a buit, o sigui
	// que el formulari naixeria amb un canvi pendent que ningú ha fet.
	useEffect(() => {
		if (isEdit || !editor) return;
		setIsReady(true);
	}, [isEdit, editor]);

	const draftKey = isEdit
		? formData._id
			? `trip-entry:${formData._id}`
			: null
		: "trip-entry:new";

	const snapshot = useMemo(
		() => ({
			fields: DRAFT_FIELDS.reduce((acc, field) => {
				acc[field] = formData[field];
				return acc;
			}, {}),
			description,
		}),
		[formData, description],
	);

	const autosave = useAutosaveDraft({
		key: draftKey,
		snapshot,
		enabled: isReady,
	});

	const [seoKeyword, setSeoKeyword] = useSeoKeyword(draftKey);

	const setField = useCallback((name, value) => {
		if (name === "slug") hasTouchedSlug.current = true;
		setFormData((previous) => ({ ...previous, [name]: value }));
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "slug") hasTouchedSlug.current = true;
		setFormData((previous) => ({
			...previous,
			[name]: value,
			...(name === "title" && !hasTouchedSlug.current
				? { slug: buildSlug(value) }
				: {}),
		}));
	};

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

	const restoreDraft = () => {
		const data = autosave.restoreDraft();
		if (!data) return;
		if (data.fields) {
			hasTouchedSlug.current = true;
			setFormData((previous) => ({ ...previous, ...data.fields }));
		}
		if (editor && typeof data.description === "string") {
			editor.commands.setContent(data.description);
		}
	};

	const save = async ({ redirect = true } = {}) => {
		if (isSaving) return;

		setIsSaving(true);
		setErrorMessage("");
		setSuccessMessage("");

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

			autosave.markSaved();

			setFormData((previous) => ({
				...previous,
				cover: "",
				blopCover: "",
				coverCloudImage: cover,
				updatedCover: false,
				images,
				blopImages: images,
			}));

			if (redirect) {
				Router.push(ADMIN_PANEL_PATH);
				return;
			}

			setIsSaving(false);
			setSuccessMessage("Canvis desats.");
		} catch (error) {
			console.error(error);
			setErrorMessage(
				"No s'ha pogut desar l'entrada de viatge. Torna-ho a provar.",
			);
			setIsSaving(false);
		}
	};

	useEffect(() => {
		if (!successMessage) return undefined;
		const timer = setTimeout(() => setSuccessMessage(""), 4000);
		return () => clearTimeout(timer);
	}, [successMessage]);

	const seo = useMemo(
		() =>
			analyzeSeo({
				title: formData.title,
				subtitle: formData.subtitle,
				metaTitle: formData.metaTitle,
				metaDescription: formData.metaDescription,
				slug: formData.slug,
				html: description,
				hasCover: Boolean(formData.cover || formData.coverCloudImage),
				keyword: seoKeyword,
			}),
		[formData, description, seoKeyword],
	);

	const categorySlug = useMemo(() => {
		const category = tripCategories.find(
			(item) => item._id === formData.trip,
		);
		return category ? category.slug : "";
	}, [tripCategories, formData.trip]);

	const publicPath = `/viatges/${categorySlug || "viatge"}/${formData.slug || ""}`;

	const tabs = [
		{ key: "main", label: "Contingut principal" },
		{
			key: "seo",
			label: "SEO",
			badge: <SeoScoreBadge score={seo.score} level={seo.level} />,
		},
	];

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
			submitLabel={isEdit ? "Desar i sortir" : "Publicar"}
			onSubmit={() => save({ redirect: true })}
			onSaveAndStay={isEdit ? () => save({ redirect: false }) : null}
			isSaving={isSaving}
			errorMessage={errorMessage}
			successMessage={successMessage}
			isDirty={autosave.isDirty}
			dirtyRef={autosave.dirtyRef}
			autosave={{ status: autosave.status, savedAt: autosave.savedAt }}
			draftNotice={
				autosave.storedDraft
					? {
							savedAt: autosave.storedDraft.savedAt,
							onRestore: restoreDraft,
							onDiscard: autosave.discardDraft,
						}
					: null
			}
			previewUrl={
				isEdit && formData.slug && categorySlug
					? `https://escapadesenparella.cat${publicPath}`
					: null
			}
			tabs={tabs}
			activeTab={activeTab}
			onTabChange={setActiveTab}
			sidebar={
				activeTab === "main" ? (
					<>
						<FormSection title="Viatge">
							<form
								className="form"
								onSubmit={(e) => e.preventDefault()}
							>
								<SelectField
									name="trip"
									label="Categoria de viatge"
									value={formData.trip}
									onChange={handleChange}
									placeholder="Selecciona un viatge"
									required
									options={tripCategories.map((category) => ({
										value: category._id,
										label: category.title,
									}))}
									hint={
										tripCategories.length
											? "L'entrada surt dins de la pàgina del viatge que triïs."
											: "Encara no hi ha viatges creats al panell."
									}
								/>
							</form>
						</FormSection>

						<FormSection
							title="Imatge de portada"
							description="Encapçala l'entrada i és la imatge amb què es comparteix. 1729x973px."
						>
							<form
								className="form"
								onSubmit={(e) => e.preventDefault()}
							>
								<ImageUploadField
									label=""
									name="cover"
									onChange={saveCoverToStatus}
									hasImage={Boolean(
										formData.cover ||
											formData.coverCloudImage,
									)}
									preview={
										<ImagePreview
											blob={formData.blopCover}
											current={formData.coverCloudImage}
										/>
									}
								/>
							</form>
						</FormSection>

						{formData.blopImages.length > 0 ? (
						<FormSection
							title="Imatges adjuntes"
							description={
								`${formData.blopImages.length} imatges pujades amb el mètode antic (post_images). Per posar imatges enmig del text, fes servir el bloc de galeria del cos.`
							}
						>
							<form
								className="form"
								onSubmit={(e) => e.preventDefault()}
							>
								<GalleryField
									label=""
									previews={formData.blopImages}
									onChange={saveGalleryToStatus}
									onRemove={removeGalleryImage}
								/>
							</form>
						</FormSection>
						) : null}
					</>
				) : null
			}
		>
			{activeTab === "main" ? (
				<>
					<FormSection
						title="Encapçalament"
						description="El títol i el subtítol són el que es llegeix als llistats i als resultats de cerca."
					>
						<form
							className="form"
							onSubmit={(e) => e.preventDefault()}
						>
							<TextField
								name="title"
								label="Títol"
								placeholder="Títol de l'entrada de viatge"
								value={formData.title}
								onChange={handleChange}
								required
								maxLength={70}
							/>
							<TextField
								name="subtitle"
								label="Subtítol"
								placeholder="Introducció curta a l'entrada de viatge"
								value={formData.subtitle}
								onChange={handleChange}
								maxLength={160}
								hint="Sol ser el millor esborrany de la meta descripció."
							/>
						</form>
					</FormSection>

					<FormSection
						title="Cos de l'entrada"
						description={`${seo.counts.words} paraules · ${seo.counts.headings} subtítols · ${seo.counts.links} enllaços`}
					>
						{formData.images.length > 0 ? (
							<p className="text-primary-400 text-sm mb-2">
								Hi ha{" "}
								<strong>
									{formData.images.length} imatges
								</strong>{" "}
								a la pestanya d&apos;imatges. Fes servir la
								drecera <strong>post_images(n, m + 1)</strong>{" "}
								per inserir-les al text.
							</p>
						) : null}

						<EditorNavbar editor={editor} />
						<EditorContent
							editor={editor}
							className="form-composer__editor"
						/>
					</FormSection>
				</>
			) : null}

			{activeTab === "seo" ? (
				<SeoFieldset
					values={formData}
					onChange={handleChange}
					onFieldChange={setField}
					analysis={seo}
					keyword={seoKeyword}
					onKeywordChange={setSeoKeyword}
					previewPath={publicPath}
				/>
			) : null}
		</ContentFormLayout>
	);
};

export default TripEntryForm;
