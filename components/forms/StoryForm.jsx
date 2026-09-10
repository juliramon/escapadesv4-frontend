import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Router from "next/router";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import ContentService from "../../services/contentService";
import { uploadCarouselMediaItems } from "../../utils/helpers";
import EditorNavbar from "../editor/EditorNavbar";
import GalleryBlock from "../editor/GalleryBlock";
import AdBannerShortcodeHelper from "../editor/AdBannerShortcodeHelper";
import ImageUploadField from "../admin/ImageUploadField";
import GalleryField from "../admin/GalleryField";
import { ImagePreview, TextField } from "../admin/FormFields";
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
 * Formulari d'històries, per crear-ne una de nova o editar-ne una d'existent.
 *
 * Substitueix la duplicació entre `pages/nova-historia.js` i
 * `pages/histories/[slug]/editar.js` (166 línies de diferència sobre 1.374).
 *
 * La galeria es puja amb `uploadCarouselMediaItems`, que conserva les imatges
 * que ja eren al servidor i només puja les noves. Abans, en editar, la pàgina
 * tornava a enviar tota la llista a Cloudinary.
 */

/** Camps que van a l'esborrany local: la resta són fitxers o identificadors. */
const DRAFT_FIELDS = [
	"title",
	"subtitle",
	"slug",
	"metaTitle",
	"metaDescription",
];

const StoryForm = ({ mode = "create", initialData = null }) => {
	const isEdit = mode === "edit";
	const service = useMemo(() => new ContentService(), []);

	const [activeTab, setActiveTab] = useState("main");
	const [isSaving, setIsSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [isReady, setIsReady] = useState(false);
	const hasLoadedState = useRef(false);
	const hasLoadedContent = useRef(false);
	// Mentre no s'hi hagi tocat, el slug segueix el títol.
	const hasTouchedSlug = useRef(isEdit);

	const [formData, setFormData] = useState({
		_id: "",
		type: "story",
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
			UPLOAD_MODELS.stories,
			formData,
		);
	}, [service, formData.slug, formData.title]);

	const editor = useEditor({
		extensions: [
			StarterKit,
			GalleryBlock.configure({ uploadRef }),
			Image,
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
		if (!initialData || hasLoadedState.current) return;
		hasLoadedState.current = true;

		const images = initialData.images || [];
		setFormData((previous) => ({
			...previous,
			_id: initialData._id || "",
			type: initialData.type || "story",
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
	// cos de la història queda buit.
	useEffect(() => {
		if (!initialData || !editor || hasLoadedContent.current) return;
		hasLoadedContent.current = true;
		editor.commands.setContent(initialData.description || "");
		// A partir d'aquí el formulari ja ensenya el que hi ha desat, que és el
		// punt de partida contra el qual es compten els canvis.
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
			? `story:${formData._id}`
			: null
		: "story:new";

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
				UPLOAD_MODELS.stories,
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
				? await service.editStory(
						formData._id,
						formData.slug,
						formData.title,
						formData.subtitle,
						cover,
						images,
						description,
						formData.metaTitle,
						formData.metaDescription,
					)
				: await service.story(
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

			// La portada ja és al servidor: no s'ha de tornar a pujar al
			// desat següent.
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
				"No s'ha pogut desar la història. Torna-ho a provar.",
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
					? "Edita la història - Escapadesenparella.cat"
					: "Publicar una nova història - Escapadesenparella.cat"
			}
			title={isEdit ? "Edita la història" : "Publica una història"}
			description={
				isEdit
					? "Modifica el contingut de la història"
					: "Comparteix una escapada amb la resta de parelles"
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
				isEdit && formData.slug
					? `https://escapadesenparella.cat/histories/${formData.slug}`
					: null
			}
			tabs={tabs}
			activeTab={activeTab}
			onTabChange={setActiveTab}
			sidebar={
				activeTab === "main" ? (
					<>
						<FormSection
							title="Imatge de portada"
							description="Encapçala la història i és la imatge amb què es comparteix a les xarxes. 1729x973px."
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
								`${formData.blopImages.length} imatges pujades amb el mètode antic. Per posar imatges enmig del text, fes servir el bloc de galeria del cos.`
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
						description="El títol i el subtítol són el que es llegeix a la portada, als llistats i als resultats de cerca."
					>
						<form
							className="form"
							onSubmit={(e) => e.preventDefault()}
						>
							<TextField
								name="title"
								label="Títol"
								placeholder="Títol de la història"
								value={formData.title}
								onChange={handleChange}
								required
								maxLength={70}
							/>
							<TextField
								name="subtitle"
								label="Subtítol"
								placeholder="Subtítol de la història"
								value={formData.subtitle}
								onChange={handleChange}
								maxLength={160}
								hint="Sol ser el millor esborrany de la meta descripció."
							/>
						</form>
					</FormSection>

					<FormSection
						title="Cos de la història"
						description={`${seo.counts.words} paraules · ${seo.counts.headings} subtítols · ${seo.counts.links} enllaços`}
					>
						<div className="mb-4 p-4 bg-gray-50 rounded-md border border-primary-50">
							<h4 className="text-sm font-medium text-primary-500 mb-2">
								Dreceres disponibles:
							</h4>
							<div className="flex flex-wrap gap-2">
								<AdBannerShortcodeHelper
									onInsertShortcode={(shortcode) =>
										editor?.commands.insertContent(
											shortcode,
										)
									}
								/>
								<span className="text-sm text-primary-400 flex items-center">
									També pots fer servir{" "}
									<code className="mx-1 px-2 py-1 bg-white rounded text-xs">
										[ad_banner]
									</code>{" "}
									directament al text
								</span>
							</div>
						</div>

						<EditorNavbar editor={editor} />
						<EditorContent
							editor={editor}
							className="form-composer__editor"
						/>
					</FormSection>
				</>
			) : (
				<SeoFieldset
					values={formData}
					onChange={handleChange}
					onFieldChange={setField}
					analysis={seo}
					keyword={seoKeyword}
					onKeywordChange={setSeoKeyword}
					previewPath={`/histories/${formData.slug || ""}`}
				/>
			)}
		</ContentFormLayout>
	);
};

export default StoryForm;
