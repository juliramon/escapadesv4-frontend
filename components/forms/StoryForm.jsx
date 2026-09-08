import { useEffect, useRef, useState } from "react";
import Router from "next/router";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import ContentService from "../../services/contentService";
import { uploadCarouselMediaItems } from "../../utils/helpers";
import EditorNavbar from "../editor/EditorNavbar";
import AdBannerShortcodeHelper from "../editor/AdBannerShortcodeHelper";
import ImageUploadField from "../admin/ImageUploadField";
import GalleryField from "../admin/GalleryField";
import { ImagePreview, TextField } from "../admin/FormFields";
import ContentFormLayout from "./ContentFormLayout";
import SeoFieldset from "./SeoFieldset";
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

const TABS = [
	{ key: "main", label: "Contingut principal" },
	{ key: "seo", label: "SEO" },
];

const StoryForm = ({ mode = "create", initialData = null }) => {
	const isEdit = mode === "edit";
	const service = new ContentService();

	const [activeTab, setActiveTab] = useState("main");
	const [isSaving, setIsSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const hasLoadedState = useRef(false);
	const hasLoadedContent = useRef(false);

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

			const description = editor ? editor.getHTML() : "";

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

			Router.push("/2i8ZXlkM4cFKUPBrm3-admin-panel");
		} catch (error) {
			console.error(error);
			setErrorMessage(
				"No s'ha pogut desar la història. Torna-ho a provar.",
			);
			setIsSaving(false);
		}
	};

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
							placeholder="Títol de la història"
							value={formData.title}
							onChange={handleChange}
						/>
						<TextField
							name="subtitle"
							label="Subtítol"
							placeholder="Subtítol de la història"
							value={formData.subtitle}
							onChange={handleChange}
						/>
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
							label="Imatges de la història"
							previews={formData.blopImages}
							onChange={saveGalleryToStatus}
							onRemove={removeGalleryImage}
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

export default StoryForm;
