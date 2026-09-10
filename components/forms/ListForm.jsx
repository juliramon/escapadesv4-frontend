import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Router from "next/router";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import ContentService from "../../services/contentService";
import EditorNavbar from "../editor/EditorNavbar";
import GalleryBlock from "../editor/GalleryBlock";
import AdBannerShortcodeHelper from "../editor/AdBannerShortcodeHelper";
import ImageUploadField from "../admin/ImageUploadField";
import { CheckboxField, ImagePreview, TextField } from "../admin/FormFields";
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
 * Formulari de llistes, per crear-ne una de nova o editar-ne una d'existent.
 *
 * Substitueix la lògica duplicada entre `pages/nova-llista.js` i
 * `pages/llistes/[slug]/editar.js`, que eren el mateix formulari amb 184
 * línies de diferència.
 *
 * Diferències que hi havia entre les dues i que aquí queden resoltes:
 *  - La pàgina de crear no tenia el camp "llista destacada", que sí que
 *    existeix al model i a la d'editar.
 *  - La d'editar tenia la redirecció final comentada, de manera que en desar
 *    no passava res visible i semblava que no s'hagués desat.
 *  - Cap de les dues avisava si el desat fallava.
 */

/** Camps que van a l'esborrany local: la resta són fitxers o identificadors. */
const DRAFT_FIELDS = [
	"title",
	"subtitle",
	"slug",
	"metaTitle",
	"metaDescription",
	"isFeatured",
];

const ListForm = ({ mode = "create", initialData = null }) => {
	const isEdit = mode === "edit";
	const service = useMemo(() => new ContentService(), []);

	const [activeTab, setActiveTab] = useState("main");
	const [isSaving, setIsSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [isReady, setIsReady] = useState(false);
	const hasLoadedState = useRef(false);
	const hasLoadedContent = useRef(false);
	const hasTouchedSlug = useRef(isEdit);

	const [formData, setFormData] = useState({
		_id: "",
		type: "list",
		title: "",
		subtitle: "",
		isFeatured: false,
		cover: "",
		blopCover: "",
		coverCloudImage: "",
		updatedCover: false,
		metaTitle: "",
		metaDescription: "",
		slug: "",
	});

	// El bloc de galeria puja les imatges en el moment de triar-les. La
	// funció de pujada depèn del slug, que canvia mentre s'escriu, i va per
	// referència perquè l'editor no s'hagi de refer a cada lletra.
	const uploadRef = useRef(null);
	useEffect(() => {
		uploadRef.current = createUploader(
			service,
			UPLOAD_MODELS.lists,
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

	// En editar, les dades arriben després del primer render.
	useEffect(() => {
		if (!initialData || hasLoadedState.current) return;
		hasLoadedState.current = true;

		setFormData((previous) => ({
			...previous,
			_id: initialData._id || "",
			type: initialData.type || "list",
			title: initialData.title || "",
			subtitle: initialData.subtitle || "",
			isFeatured: initialData.isFeatured || false,
			coverCloudImage: initialData.cover || "",
			metaTitle: initialData.metaTitle || "",
			metaDescription: initialData.metaDescription || "",
			slug: initialData.slug || "",
		}));
	}, [initialData]);

	// El contingut va a part: TipTap no està llest al primer render i, si
	// s'intenta carregar abans d'hora, el cos de la publicació queda buit.
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
			? `list:${formData._id}`
			: null
		: "list:new";

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

	const handleCheck = (e) =>
		setFormData((previous) => ({
			...previous,
			[e.target.name]: e.target.checked,
		}));

	const saveFileToStatus = (e) => {
		const fileToUpload = e.target.files[0];
		if (!fileToUpload) return;
		setFormData((previous) => ({
			...previous,
			blopCover: URL.createObjectURL(fileToUpload),
			cover: fileToUpload,
			updatedCover: true,
		}));
	};

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
			// Només es puja la portada si se n'ha triat una de nova; abans
			// s'enviava sempre i, en editar sense canviar-la, es perdia.
			const upload = createUploader(
				service,
				UPLOAD_MODELS.lists,
				formData,
			);
			const cover = formData.updatedCover
				? await uploadSingleFile(
						upload,
						formData.cover,
						formData.coverCloudImage,
					)
				: formData.coverCloudImage;

			const response = isEdit
				? await service.editList(
						formData._id,
						formData.type,
						formData.title,
						formData.subtitle,
						formData.isFeatured,
						cover,
						formData.metaTitle,
						formData.metaDescription,
						formData.slug,
						description,
					)
				: await service.list(
						formData.type,
						formData.title,
						formData.subtitle,
						cover,
						formData.metaTitle,
						formData.metaDescription,
						formData.slug,
						description,
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
			}));

			if (redirect) {
				Router.push(ADMIN_PANEL_PATH);
				return;
			}

			setIsSaving(false);
			setSuccessMessage("Canvis desats.");
		} catch (error) {
			console.error(error);
			setErrorMessage("No s'ha pogut desar la llista. Torna-ho a provar.");
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
					? "Edita la llista - Escapadesenparella.cat"
					: "Crea una nova llista - Escapadesenparella.cat"
			}
			title={isEdit ? "Edita la llista" : "Crea una llista"}
			description={
				isEdit
					? "Modifica el contingut de la llista"
					: "Crea una nova llista per inspirar a altres parelles"
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
					? `https://escapadesenparella.cat/llistes/${formData.slug}`
					: null
			}
			tabs={tabs}
			activeTab={activeTab}
			onTabChange={setActiveTab}
			sidebar={
				activeTab === "main" ? (
					<FormSection
						title="Imatge de portada"
						description="És la imatge amb què la llista es veu als llistats i a les xarxes. 1729x973px."
					>
						<form
							className="form"
							onSubmit={(e) => e.preventDefault()}
						>
							<ImageUploadField
								label=""
								name="cover"
								onChange={saveFileToStatus}
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
						</form>
					</FormSection>
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
								placeholder="Títol de la llista"
								value={formData.title}
								onChange={handleChange}
								required
								maxLength={70}
							/>
							<TextField
								name="subtitle"
								label="Subtítol"
								placeholder="Subtítol de la llista"
								value={formData.subtitle}
								onChange={handleChange}
								maxLength={160}
								hint="Sol ser el millor esborrany de la meta descripció."
							/>
							<CheckboxField
								name="isFeatured"
								label="Llista destacada"
								checked={formData.isFeatured}
								onChange={handleCheck}
								hint="Les llistes destacades surten a la portada."
							/>
						</form>
					</FormSection>

					<FormSection
						title="Cos de la llista"
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
					previewPath={`/llistes/${formData.slug || ""}`}
				/>
			)}
		</ContentFormLayout>
	);
};

export default ListForm;
