import { useEffect, useRef, useState } from "react";
import Router from "next/router";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import ContentService from "../../services/contentService";
import EditorNavbar from "../editor/EditorNavbar";
import AdBannerShortcodeHelper from "../editor/AdBannerShortcodeHelper";
import ImageUploadField from "../admin/ImageUploadField";
import { CheckboxField, ImagePreview, TextField } from "../admin/FormFields";
import ContentFormLayout from "./ContentFormLayout";
import SeoFieldset from "./SeoFieldset";
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

const TABS = [
	{ key: "main", label: "Contingut principal" },
	{ key: "seo", label: "SEO" },
];

const ListForm = ({ mode = "create", initialData = null }) => {
	const isEdit = mode === "edit";
	const service = new ContentService();

	const [activeTab, setActiveTab] = useState("main");
	const [isSaving, setIsSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const hasLoadedState = useRef(false);
	const hasLoadedContent = useRef(false);

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

	const editor = useEditor({
		extensions: [
			StarterKit,
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
	}, [initialData, editor]);

	const handleChange = (e) =>
		setFormData((previous) => ({
			...previous,
			[e.target.name]: e.target.value,
		}));

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isSaving) return;

		setIsSaving(true);
		setErrorMessage("");

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

			const description = editor ? editor.getHTML() : "";

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

			Router.push("/2i8ZXlkM4cFKUPBrm3-admin-panel");
		} catch (error) {
			console.error(error);
			setErrorMessage(
				"No s'ha pogut desar la llista. Torna-ho a provar.",
			);
			setIsSaving(false);
		}
	};

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
						<TextField
							name="title"
							label="Títol"
							placeholder="Títol de la llista"
							value={formData.title}
							onChange={handleChange}
						/>
						<TextField
							name="subtitle"
							label="Subtítol"
							placeholder="Subtítol de la llista"
							value={formData.subtitle}
							onChange={handleChange}
						/>
						<CheckboxField
							name="isFeatured"
							label="Llista destacada?"
							checked={formData.isFeatured}
							onChange={handleCheck}
						/>
						<ImageUploadField
							label="Imatge de portada (1729x973px)"
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

					<div className="mb-4 p-4 bg-gray-50 rounded-lg border">
						<h4 className="text-sm font-medium text-gray-900 mb-2">
							Dreceres disponibles:
						</h4>
						<div className="flex flex-wrap gap-2">
							<AdBannerShortcodeHelper
								onInsertShortcode={(shortcode) =>
									editor?.commands.insertContent(shortcode)
								}
							/>
							<span className="text-sm text-gray-600 flex items-center">
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
				</div>
			) : (
				<SeoFieldset values={formData} onChange={handleChange} />
			)}
		</ContentFormLayout>
	);
};

export default ListForm;
