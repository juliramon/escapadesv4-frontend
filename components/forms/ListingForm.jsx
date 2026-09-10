import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Router from "next/router";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import ContentService from "../../services/contentService";
import { uploadCarouselMediaItems } from "../../utils/helpers";
import { createUploader, uploadSingleFile } from "../../utils/uploads";
import EditorNavbar from "../editor/EditorNavbar";
import ImageUploadField from "../admin/ImageUploadField";
import GalleryField from "../admin/GalleryField";
import {
	CheckboxField,
	ImagePreview,
	SelectField,
	TextAreaField,
	TextField,
} from "../admin/FormFields";
import ContentFormLayout, { ADMIN_PANEL_PATH } from "./ContentFormLayout";
import FormSection from "./FormSection";
import SeoFieldset from "./SeoFieldset";
import { SeoScoreBadge } from "./SeoScore";
import ChoiceGroup from "./ChoiceGroup";
import PlaceAutocompleteField from "./PlaceAutocompleteField";
import { LISTING_VARIANTS } from "./listingFormConfig";
import useAutosaveDraft from "../../hooks/useAutosaveDraft";
import useEditorRevision from "../../hooks/useEditorRevision";
import useSeoKeyword from "../../hooks/useSeoKeyword";
import { analyzeSeo, buildSlug } from "../../utils/seo";
import { listingPath } from "../../utils/listingRoutes";
import { readValidationError } from "../../utils/apiErrors";

/**
 * Formulari de fitxes: experiències i allotjaments, per crear-ne una de nova o
 * editar-ne una d'existent.
 *
 * Substitueix quatre pàgines de 1.544, 1.623, 1.767 i 1.787 línies que eren el
 * mateix formulari amb els camps de localització canviats de prefix.
 *
 * Errors que arrossegaven i que aquí queden resolts:
 *  - En editar, el desat llegia l'adreça, les coordenades i l'horari de la
 *    còpia original de la fitxa i no del formulari: canviar la localització amb
 *    el cercador de Google no es desava mai.
 *  - En editar no es carregava `relatedStory`: el desplegable d'història
 *    relacionada sortia sempre buit encara que la fitxa en tingués una.
 *  - `handleCheckSeason` afegia i treia estacions mutant l'array de l'estat.
 *  - La pujada d'imatges en editar eren tres branques amb `forEach` i comptadors
 *    que es trepitjaven entre elles; ara és una sola espera que, a més, no
 *    torna a pujar les imatges que ja eren al servidor.
 *  - La pàgina de crear allotjaments no arribava a saber mai si l'API havia
 *    rebutjat la fitxa.
 *  - Es demanaven les organitzacions de l'usuari a cada càrrega per construir
 *    una llista que no es pintava enlloc.
 */

const editorExtensions = (placeholder) => [
	StarterKit,
	Image.configure({ inline: false, HTMLAttributes: { class: "img-frame" } }),
	Placeholder.configure({ placeholder }),
	Link.configure({
		openOnClick: false,
		autolink: false,
		defaultProtocol: "https",
	}),
];

/**
 * Els camps de relació arriben poblats en editar i com a referència en crear.
 * La referència és l'identificador a `destinations` i `relatedStory`, i el nom
 * a `characteristics`, que és com les desa el model.
 */
const idOf = (value) => {
	if (!value) return "";
	if (typeof value === "string") return value;
	return value._id || "";
};

const idsOf = (values) =>
	(Array.isArray(values) ? values : []).map(idOf).filter(Boolean);

/**
 * `categories` i `placeType` són de selecció única, però el model els desa com
 * a llista perquè Mongoose hi converteix el text que s'hi envia.
 */
const singleCategoryOf = (value) => {
	if (Array.isArray(value)) return idOf(value[0]);
	return idOf(value);
};

const ListingForm = ({ variant, mode = "create", initialData = null }) => {
	const config = LISTING_VARIANTS[variant];
	const isEdit = mode === "edit";
	const service = useMemo(() => new ContentService(), []);

	const [activeTab, setActiveTab] = useState("main");
	const [isSaving, setIsSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [isReady, setIsReady] = useState(false);
	const [destinations, setDestinations] = useState([]);
	const [characteristics, setCharacteristics] = useState([]);
	const [stories, setStories] = useState([]);
	const hasLoadedState = useRef(false);
	const hasLoadedContent = useRef(false);
	// Mentre no s'hi hagi tocat, el slug segueix el títol.
	const hasTouchedSlug = useRef(isEdit);

	const [formData, setFormData] = useState({
		_id: "",
		type: config.type,
		isVerified: false,
		title: "",
		subtitle: "",
		slug: "",
		categories: "",
		seasons: [],
		destinations: [],
		placeType: "",
		characteristics: [],
		cover: "",
		blopCover: "",
		coverCloudImage: "",
		updatedCover: false,
		images: [],
		blopImages: [],
		phone: "",
		website: "",
		duration: "",
		price: "",
		discountCode: "",
		discountInfo: "",
		review: "",
		relatedStory: "",
		organization: "",
		metaTitle: "",
		metaDescription: "",
		[config.location.full_address]: "",
		[config.location.locality]: "",
		[config.location.province]: "",
		[config.location.state]: "",
		[config.location.country]: "",
		[config.location.lat]: "",
		[config.location.lng]: "",
		[config.location.rating]: 0,
		[config.location.place_id]: "",
		[config.location.opening_hours]: "",
	});

	const editor = useEditor({
		extensions: editorExtensions(config.copy.descriptionPlaceholder),
		content: "",
		autofocus: false,
		parseOptions: { preserveWhitespace: true },
	});

	const reasonsEditor = useEditor({
		extensions: editorExtensions(config.copy.reasonsPlaceholder),
		content: "",
		autofocus: false,
		parseOptions: { preserveWhitespace: true },
	});

	const editorRevision = useEditorRevision([editor, reasonsEditor]);
	const descriptionHtml = useMemo(
		() => (editor ? editor.getHTML() : ""),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[editor, editorRevision],
	);
	const reasonsHtml = useMemo(
		() => (reasonsEditor ? reasonsEditor.getHTML() : ""),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[reasonsEditor, editorRevision],
	);

	useEffect(() => {
		const fetchOptions = async () => {
			const safe = async (promise, fallback) => {
				try {
					return await promise;
				} catch (error) {
					console.error(error);
					return fallback;
				}
			};

			const [destinationList, storyList, characteristicList] =
				await Promise.all([
					safe(service.getDestinations(), []),
					safe(service.getStories(), { allStories: [] }),
					config.hasCharacteristics
						? safe(service.getCharacteristics(), [])
						: Promise.resolve([]),
				]);

			setDestinations(
				Array.isArray(destinationList) ? destinationList : [],
			);
			setStories(storyList?.allStories || []);
			setCharacteristics(
				Array.isArray(characteristicList) ? characteristicList : [],
			);
		};
		fetchOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [config.hasCharacteristics]);

	useEffect(() => {
		if (!initialData || hasLoadedState.current) return;
		hasLoadedState.current = true;

		const images = initialData.images || [];
		setFormData((previous) => ({
			...previous,
			...Object.keys(config.location).reduce((acc, key) => {
				const field = config.location[key];
				acc[field] = initialData[field] ?? previous[field];
				return acc;
			}, {}),
			_id: initialData._id || "",
			type: initialData.type || config.type,
			isVerified: Boolean(initialData.isVerified),
			title: initialData.title || "",
			subtitle: initialData.subtitle || "",
			slug: initialData.slug || "",
			categories: singleCategoryOf(initialData.categories),
			seasons: idsOf(initialData.seasons),
			destinations: idsOf(initialData.destinations),
			placeType: singleCategoryOf(initialData.placeType),
			characteristics: idsOf(initialData.characteristics),
			coverCloudImage: initialData.cover || "",
			images,
			blopImages: images,
			phone: initialData.phone || "",
			website: initialData.website || "",
			duration: initialData.duration || "",
			price: initialData.price || "",
			discountCode: initialData.discountCode || "",
			discountInfo: initialData.discountInfo || "",
			review: initialData.review || "",
			relatedStory: idOf(initialData.relatedStory),
			organization: idOf(initialData.organization),
			metaTitle: initialData.metaTitle || "",
			metaDescription: initialData.metaDescription || "",
		}));
	}, [initialData, config]);

	// TipTap no està llest al primer render: si es carrega abans d'hora, la
	// descripció i les raons queden buides.
	useEffect(() => {
		if (!initialData || !editor || !reasonsEditor) return;
		if (hasLoadedContent.current) return;
		hasLoadedContent.current = true;
		editor.commands.setContent(initialData.description || "");
		reasonsEditor.commands.setContent(initialData.reasons || "");
		// A partir d'aquí el formulari ja ensenya el que hi ha desat, que és el
		// punt de partida contra el qual es compten els canvis.
		setIsReady(true);
	}, [initialData, editor, reasonsEditor]);

	// L'estat de partida no es pot prendre fins que TipTap existeix: al primer
	// render encara no hi ha editor i el cos es llegiria com a buit, o sigui
	// que el formulari naixeria amb un canvi pendent que ningú ha fet.
	useEffect(() => {
		if (isEdit || !(editor && reasonsEditor)) return;
		setIsReady(true);
	}, [isEdit, editor, reasonsEditor]);

	const draftKey = isEdit
		? formData._id
			? `${config.type}:${formData._id}`
			: null
		: `${config.type}:new`;

	const snapshot = useMemo(() => {
		// Els fitxers pendents de pujar i les rutes de Cloudinary no van a
		// l'esborrany: ni es poden serialitzar ni tindrien sentit demà.
		const {
			cover,
			blopCover,
			coverCloudImage,
			updatedCover,
			images,
			blopImages,
			_id,
			type,
			...fields
		} = formData;
		return { fields, description: descriptionHtml, reasons: reasonsHtml };
	}, [formData, descriptionHtml, reasonsHtml]);

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
		if (reasonsEditor && typeof data.reasons === "string") {
			reasonsEditor.commands.setContent(data.reasons);
		}
	};

	const handleCheck = (e) => setField(e.target.name, e.target.checked);

	const handlePlaceSelected = (place) =>
		setFormData((previous) => ({
			...previous,
			[config.location.full_address]: place.full_address,
			[config.location.locality]: place.locality,
			[config.location.province]: place.province,
			[config.location.state]: place.state,
			[config.location.country]: place.country,
			[config.location.lat]: place.lat,
			[config.location.lng]: place.lng,
			[config.location.rating]: place.rating,
			[config.location.place_id]: place.place_id,
			[config.location.opening_hours]: place.opening_hours,
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

	const buildPayload = (cover, images) => {
		const location = Object.values(config.location).reduce((acc, field) => {
			acc[field] = formData[field];
			return acc;
		}, {});

		return {
			...location,
			type: formData.type,
			isVerified: formData.isVerified,
			slug: formData.slug,
			title: formData.title,
			subtitle: formData.subtitle,
			categories: formData.categories,
			seasons: formData.seasons,
			destinations: formData.destinations,
			cover,
			images,
			description: descriptionHtml,
			reasons: reasonsHtml,
			phone: formData.phone,
			website: formData.website,
			price: formData.price,
			discountCode: formData.discountCode,
			discountInfo: formData.discountInfo,
			review: formData.review,
			relatedStory: formData.relatedStory || undefined,
			organization_id: formData.organization || undefined,
			metaTitle: formData.metaTitle,
			metaDescription: formData.metaDescription,
			...(config.hasDuration ? { duration: formData.duration } : {}),
			...(config.hasPlaceType ? { placeType: formData.placeType } : {}),
			...(config.hasCharacteristics
				? { characteristics: formData.characteristics }
				: {}),
		};
	};

	const save = async ({ redirect = true } = {}) => {
		if (isSaving) return;

		setIsSaving(true);
		setErrorMessage("");
		setSuccessMessage("");

		try {
			const upload = createUploader(
				service,
				config.uploadModel,
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

			const payload = buildPayload(cover, images);
			const response = isEdit
				? await service[config.updateMethod](formData._id, payload)
				: await service[config.createMethod](payload);

			const failure = readValidationError(response);
			if (failure) {
				setErrorMessage(failure);
				setIsSaving(false);
				return;
			}

			autosave.markSaved();

			// Les imatges ja són al servidor: no s'han de tornar a pujar al
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
			setErrorMessage(config.copy.saveError);
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
				html: `${descriptionHtml}${reasonsHtml}`,
				hasCover: Boolean(formData.cover || formData.coverCloudImage),
				keyword: seoKeyword,
			}),
		[formData, descriptionHtml, reasonsHtml, seoKeyword],
	);

	const publicPath = listingPath({
		slug: formData.slug,
		type: config.type,
		categories: formData.categories ? [formData.categories] : [],
	});

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
					? config.copy.documentTitleEdit
					: config.copy.documentTitleCreate
			}
			title={isEdit ? config.copy.titleEdit : config.copy.titleCreate}
			description={
				isEdit
					? config.copy.descriptionEdit
					: config.copy.descriptionCreate
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
					? `https://escapadesenparella.cat${publicPath}`
					: null
			}
			tabs={tabs}
			activeTab={activeTab}
			onTabChange={setActiveTab}
			sidebar={
				activeTab === "main" ? (
					<>
						<FormSection
							title="Classificació"
							description="Marca on surt la fitxa dins del web: la categoria decideix la URL pública."
						>
							<form
								className="form"
								onSubmit={(e) => e.preventDefault()}
							>
								<ChoiceGroup
									name="categories"
									label="Categoria d'escapada"
									options={config.categories}
									value={formData.categories}
									onChange={(value) =>
										setField("categories", value)
									}
								/>
								<ChoiceGroup
									name="seasons"
									label="Estacions recomanades"
									options={config.seasons}
									value={formData.seasons}
									onChange={(value) => setField("seasons", value)}
									multiple
								/>
								<ChoiceGroup
									name="destinations"
									label="Destinació on es troba"
									options={destinations.map((destination) => ({
										value: destination._id,
										label: destination.title,
									}))}
									value={formData.destinations}
									onChange={(value) =>
										setField("destinations", value)
									}
									multiple
									emptyMessage="Encara no hi ha destinacions creades."
								/>

								{config.hasPlaceType ? (
									<ChoiceGroup
										name="placeType"
										label="Tipus d'allotjament"
										options={config.placeTypes}
										value={formData.placeType}
										onChange={(value) =>
											setField("placeType", value)
										}
									/>
								) : null}

								{config.hasCharacteristics ? (
									<ChoiceGroup
										name="characteristics"
										label="Característiques de l'allotjament"
										options={characteristics.map(
											(characteristic) => ({
												// El model desa el nom, no l'identificador.
												value: characteristic.name,
												label: characteristic.name,
												icon: characteristic.icon,
											}),
										)}
										value={formData.characteristics}
										onChange={(value) =>
											setField("characteristics", value)
										}
										multiple
										emptyMessage="Encara no hi ha característiques creades."
									/>
								) : null}
							</form>
						</FormSection>

						<FormSection
							title="Verificació"
							description="Les fitxes verificades porten la ressenya i l'enllaç a la història de la visita."
						>
							<form
								className="form"
								onSubmit={(e) => e.preventDefault()}
							>
								<CheckboxField
									name="isVerified"
									label={config.copy.verifiedLabel}
									checked={formData.isVerified}
									onChange={handleCheck}
									hint="Marca-ho només si hi heu estat."
								/>

								{formData.isVerified ? (
									<>
										<TextAreaField
											name="review"
											label={config.copy.reviewLabel}
											placeholder={config.copy.reviewLabel}
											value={formData.review}
											onChange={handleChange}
										/>
										<SelectField
											name="relatedStory"
											label='Selecciona la "Història" relacionada'
											placeholder="Selecciona una història"
											value={formData.relatedStory}
											onChange={handleChange}
											options={stories.map((story) => ({
												value: story._id,
												label: story.title,
											}))}
										/>
									</>
								) : null}
							</form>
						</FormSection>

						<FormSection
							title="Imatge de portada"
							description="Encapçala la fitxa i és la imatge amb què es comparteix. 1729x973px."
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

						<FormSection
							title="Imatges adjuntes"
							description={
								formData.blopImages.length
									? `${formData.blopImages.length} imatges al carrusel de la fitxa.`
									: "Encara no hi ha cap imatge al carrusel."
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
					</>
				) : null
			}
		>
			{activeTab === "main" ? (
				<>
					<FormSection
						title="Encapçalament"
						description="El títol i el subtítol són el que es llegeix als llistats, al mapa i als resultats de cerca."
					>
						<form
							className="form"
							onSubmit={(e) => e.preventDefault()}
						>
							<TextField
								name="title"
								label="Títol"
								placeholder={config.copy.titlePlaceholder}
								value={formData.title}
								onChange={handleChange}
								required
								maxLength={70}
							/>
							<TextField
								name="subtitle"
								label="Subtítol"
								placeholder={config.copy.subtitlePlaceholder}
								value={formData.subtitle}
								onChange={handleChange}
								maxLength={160}
								hint="Sol ser el millor esborrany de la meta descripció."
							/>
						</form>
					</FormSection>

					<FormSection
						title="Localització i dades pràctiques"
						description="La localització alimenta el mapa i la fitxa; la resta són les dades que es veuen a la targeta de reserva."
					>
						<form
							className="form"
							onSubmit={(e) => e.preventDefault()}
						>
							<PlaceAutocompleteField
								label="Localització"
								placeholder={config.copy.addressPlaceholder}
								defaultValue={
									formData[config.location.full_address]
								}
								onSelect={handlePlaceSelected}
							/>
							{formData[config.location.full_address] ? (
								<p className="form__text_info -mt-3 mb-4">
									Localització desada:{" "}
									<strong>
										{formData[config.location.full_address]}
									</strong>
								</p>
							) : null}

							<div className="flex flex-wrap -mx-2">
								<div className="w-full md:w-1/2 px-2">
									<TextField
										name="phone"
										label="Telèfon"
										placeholder="Telèfon de contacte"
										value={formData.phone}
										onChange={handleChange}
									/>
								</div>
								<div className="w-full md:w-1/2 px-2">
									<TextField
										name="website"
										label="Pàgina web"
										placeholder="Enllaç a la pàgina web"
										value={formData.website}
										onChange={handleChange}
									/>
								</div>
								<div className="w-full md:w-1/2 px-2">
									<TextField
										name="price"
										label="Preu"
										placeholder="Preu"
										value={formData.price}
										onChange={handleChange}
									/>
								</div>
								{config.hasDuration ? (
									<div className="w-full md:w-1/2 px-2">
										<TextField
											name="duration"
											label="Durada"
											placeholder="Durada de l'activitat"
											value={formData.duration}
											onChange={handleChange}
										/>
									</div>
								) : null}
								<div className="w-full md:w-1/2 px-2">
									<TextField
										name="discountCode"
										label="Codi de descompte"
										placeholder="Codi de descompte"
										value={formData.discountCode}
										onChange={handleChange}
									/>
								</div>
								<div className="w-full md:w-1/2 px-2">
									<TextField
										name="discountInfo"
										label="Informació del descompte"
										placeholder="Informació del descompte"
										value={formData.discountInfo}
										onChange={handleChange}
									/>
								</div>
							</div>
						</form>
					</FormSection>

					<FormSection
						title={config.copy.descriptionLabel}
						description={`${seo.counts.words} paraules en total · ${seo.counts.headings} subtítols · ${seo.counts.links} enllaços`}
					>
						<EditorNavbar editor={editor} />
						<EditorContent
							editor={editor}
							className="form-composer__editor"
						/>
					</FormSection>

					<FormSection title={config.copy.reasonsLabel}>
						<EditorNavbar editor={reasonsEditor} />
						<EditorContent
							editor={reasonsEditor}
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

export default ListingForm;
