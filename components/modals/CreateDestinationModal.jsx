import { useEffect, useState } from "react";
import ContentService from "../../services/contentService";
import {
	removeImage,
	destinationUploadFolderKey,
	uploadCarouselMediaItems,
} from "../../utils/helpers";
import EditorNavbar from "../editor/EditorNavbar";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

const CreateDestinationModal = ({ visibility, hideModal, fetchData }) => {
	const service = new ContentService();

	const formatSaveError = (err) => {
		const data = err?.response?.data;
		if (typeof data === "string") return data;
		if (data?.message != null) return String(data.message);
		if (err?.message) return err.message;
		return "S'ha produït un error. Torna-ho a provar.";
	};

	const initialState = {
		slug: "",
		title: "",
		longTitle: "",
		subtitle: "",
		image: "",
		blopImage: "",
		cloudImage: "",
		cloudImageUploaded: false,
		updatedImage: false,
		updatedCarouselImages: false,
		updatedSponsorLogo: false,
		isSubmitable: false,
		reviewText: "",
		carouselImages: [],
		blopCarouselImages: [],
		cloudCarouselImages: [],
		cloudCarouselImagesUploaded: false,
		mapLocation: "",
		mostLikedText: "",
		pointsOfInterestText: "",
		mustSeeText: "",
		seoTextHeader: "",
		seoText: "",
		isSponsored: false,
		isFeatured: false,
		sponsorURL: "",
		sponsorLogo: "",
		blopSponsorLogo: "",
		cloudSponsorLogo: "",
		cloudSponsorLogoUploaded: false,
		sponsorClaim: "",
	};

	const [destination, setDestination] = useState(initialState);
	const [submitError, setSubmitError] = useState(null);
	const [isSaving, setIsSaving] = useState(false);

	const {
		reviewText,
		mostLikedText,
		pointsOfInterestText,
		mustSeeText,
		seoTextHeader,
		seoText,
	} = destination;

	const [editorDataReviewText, setEditorDataReviewText] =
		useState(reviewText);
	const [editorDataMostLikedText, setEditorDataMostLikedText] =
		useState(mostLikedText);
	const [editorDataPointsOfInterestText, setEditorDataPointsOfInterestText] =
		useState(pointsOfInterestText);
	const [editorDataMustSeeText, setEditorDataMustSeeText] =
		useState(mustSeeText);
	const [editorDataHeader, setEditorDataHeader] = useState(seoTextHeader);
	const [editorData, setEditorData] = useState(seoText);

	const editorReviewText = useEditor({
		extensions: [StarterKit, Image],
		content: reviewText !== "" ? reviewText : "",
		onUpdate: (props) => {
			const data = {
				html: props.editor.getHTML(),
				text: props.editor.state.doc.textContent,
			};
			setEditorDataReviewText(data.html);
		},
		autofocus: false,
		parseOptions: {
			preserveWhitespace: true,
		},
	});

	const editorMostLikedText = useEditor({
		extensions: [StarterKit, Image],
		content: mostLikedText !== "" ? mostLikedText : "",
		onUpdate: (props) => {
			const data = {
				html: props.editor.getHTML(),
				text: props.editor.state.doc.textContent,
			};
			setEditorDataMostLikedText(data.html);
		},
		autofocus: false,
		parseOptions: {
			preserveWhitespace: true,
		},
	});

	const editorPointsOfInterestText = useEditor({
		extensions: [StarterKit, Image],
		content: pointsOfInterestText !== "" ? pointsOfInterestText : "",
		onUpdate: (props) => {
			const data = {
				html: props.editor.getHTML(),
				text: props.editor.state.doc.textContent,
			};
			setEditorDataPointsOfInterestText(data.html);
		},
		autofocus: false,
		parseOptions: {
			preserveWhitespace: true,
		},
	});

	const editorMustSeeText = useEditor({
		extensions: [StarterKit, Image],
		content: mustSeeText !== "" ? mustSeeText : "",
		onUpdate: (props) => {
			const data = {
				html: props.editor.getHTML(),
				text: props.editor.state.doc.textContent,
			};
			setEditorDataMustSeeText(data.html);
		},
		autofocus: false,
		parseOptions: {
			preserveWhitespace: true,
		},
	});

	const editorHeader = useEditor({
		extensions: [StarterKit, Image],
		content: seoTextHeader !== "" ? seoTextHeader : "",
		onUpdate: (props) => {
			const data = {
				html: props.editor.getHTML(),
				text: props.editor.state.doc.textContent,
			};
			setEditorDataHeader(data.html);
		},
		autofocus: false,
		parseOptions: {
			preserveWhitespace: true,
		},
	});

	const editor = useEditor({
		extensions: [StarterKit, Image],
		content: seoText !== "" ? seoText : "",
		onUpdate: (props) => {
			const data = {
				html: props.editor.getHTML(),
				text: props.editor.state.doc.textContent,
			};
			setEditorData(data.html);
		},
		autofocus: false,
		parseOptions: {
			preserveWhitespace: true,
		},
	});

	const handleChange = (e) => {
		setDestination({ ...destination, [e.target.name]: e.target.value });
	};

	const handleCheck = (e) => {
		const { name, checked } = e.target;
		setDestination((prev) => {
			if (name === "isFeatured") {
				return { ...prev, isFeatured: checked };
			}
			if (name === "isSponsored") {
				return { ...prev, isSponsored: checked };
			}
			return prev;
		});
	};

	const saveFileToStatus = (e) => {
		if (e.target.name === "image") {
			const fileToUpload = e.target.files[0];
			setDestination({
				...destination,
				blopImage: URL.createObjectURL(fileToUpload),
				image: fileToUpload,
				updatedImage: true,
			});
		}
		if (e.target.name === "sponsorLogo") {
			const fileToUpload = e.target.files[0];
			setDestination({
				...destination,
				blopSponsorLogo: URL.createObjectURL(fileToUpload),
				sponsorLogo: fileToUpload,
				updatedSponsorLogo: true,
			});
		}
		if (e.target.name === "carouselImages") {
			const choosenFiles = Array.prototype.slice.call(e.target.files);
			const filesToUpload = [];

			choosenFiles.forEach((file) => filesToUpload.push(file));

			const blopCarouselImages = filesToUpload.map((file) =>
				URL.createObjectURL(file)
			);
			const carouselImages = filesToUpload.map((image) => image);
			setDestination({
				...destination,
				blopCarouselImages: [
					...destination.blopCarouselImages,
					...blopCarouselImages,
				],
				carouselImages: [
					...destination.carouselImages,
					...carouselImages,
				],
				updatedCarouselImages: true,
			});
		}
	};

	const imagesList = destination.blopCarouselImages.map((el, idx) => (
		<div
			className="relative overflow-hidden rounded-md border-8 border-white shadow mb-5"
			key={idx}
		>
			<button
				type="button"
				onClick={() => {
					const objImages = removeImage(
						idx,
						destination.blopCarouselImages,
						destination.carouselImages
					);
					setDestination({
						...destination,
						carouselImages: objImages.arrImages,
						blopCarouselImages: objImages.arrBlopImages,
						updatedCarouselImages: true,
					});
				}}
				className="w-7 h-7 bg-black bg-opacity-70 text-white hover:bg-opacity-100 transition-all duration-300 ease-in-out absolute top-2 right-2 rounded-full flex items-center justify-center"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="icon icon-tabler icon-tabler-trash"
					width={16}
					height={16}
					viewBox="0 0 24 24"
					strokeWidth="2"
					stroke="currentColor"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M4 7l16 0"></path>
					<path d="M10 11l0 6"></path>
					<path d="M14 11l0 6"></path>
					<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
					<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
				</svg>
			</button>
			<img src={el} />
		</div>
	));

	const handleFileUpload = async () => {
		setSubmitError(null);
		let imageUploaded;
		let sponsorLogoUploaded;

		try {
			const uploadFolder = destinationUploadFolderKey(
				destination.slug,
				destination.title
			);
			let nextCloudCarousel = null;

			if (destination.updatedImage) {
				const uploadData = new FormData();
				uploadData.append("imageUrl", destination.image);
				imageUploaded = await service.uploadFile(uploadData, uploadFolder);
			}
			if (destination.updatedSponsorLogo) {
				const uploadData = new FormData();
				uploadData.append("imageUrl", destination.sponsorLogo);
				sponsorLogoUploaded = await service.uploadFile(
					uploadData,
					uploadFolder
				);
			}
			if (destination.updatedCarouselImages) {
				nextCloudCarousel = await uploadCarouselMediaItems(
					destination.carouselImages,
					(fd) => service.uploadFile(fd, uploadFolder)
				);
			}

			setDestination((prev) => ({
				...prev,
				cloudImage: imageUploaded != undefined ? imageUploaded.path : "",
				cloudImageUploaded: imageUploaded != undefined ? true : false,
				cloudSponsorLogo:
					sponsorLogoUploaded != undefined
						? sponsorLogoUploaded.path
						: "",
				cloudSponsorLogoUploaded:
					sponsorLogoUploaded != undefined ? true : false,
				cloudCarouselImages: nextCloudCarousel,
				isSubmitable: true,
			}));
		} catch (err) {
			console.error(err);
			setSubmitError(formatSaveError(err));
			setIsSaving(false);
		}
	};

	const submitDestination = async () => {
		const {
			slug,
			title,
			longTitle,
			subtitle,
			cloudImage = "",
			cloudCarouselImages,
			mapLocation,
			isSponsored,
			isFeatured,
			sponsorURL,
			cloudSponsorLogo = "",
			sponsorClaim,
		} = destination;
		const carouselPayload = cloudCarouselImages ?? [];

		try {
			setSubmitError(null);
			await service.createDestination(
				slug,
				title,
				longTitle,
				subtitle,
				cloudImage,
				editorDataReviewText,
				carouselPayload,
				mapLocation,
				editorDataMostLikedText,
				editorDataPointsOfInterestText,
				editorDataMustSeeText,
				editorDataHeader,
				editorData,
				isSponsored,
				isFeatured,
				sponsorURL,
				cloudSponsorLogo,
				sponsorClaim
			);
			setDestination((prev) => ({ ...prev, isSubmitable: false }));
			hideModal();
			fetchData();
		} catch (err) {
			console.error(err);
			setSubmitError(formatSaveError(err));
			setDestination((prev) => ({ ...prev, isSubmitable: false }));
		} finally {
			setIsSaving(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isSaving) return;
		const needsUpload =
			destination.updatedImage ||
			destination.updatedCarouselImages ||
			destination.updatedSponsorLogo;
		setSubmitError(null);
		setIsSaving(true);
		if (needsUpload) {
			handleFileUpload();
		} else {
			submitDestination();
		}
	};

	useEffect(() => {
		if (destination.isSubmitable) {
			submitDestination();
		}
	}, [destination]);

	useEffect(() => {
		if (!destination.isSponsored) {
			if (
				destination.sponsorURL !== "" ||
				destination.sponsorLogo !== "" ||
				destination.blopSponsorLogo !== "" ||
				destination.sponsorClaim !== ""
			) {
				setDestination({
					...destination,
					sponsorURL: "",
					sponsorLogo: "",
					blopSponsorLogo: "",
					sponsorClaim: "",
				});
			}
		}
	});

	let imagePreview, sponsorLogoPreview;

	if (destination.blopImage) {
		imagePreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={destination.blopImage} />
			</div>
		);
	}

	if (destination.blopSponsorLogo) {
		sponsorLogoPreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={destination.blopSponsorLogo} />
			</div>
		);
	}

	return (
		<div className={`modal ${visibility == true ? "active" : ""}`}>
			<div className="modal__wrapper">
				<div className="modal__header">
					<span>Crea una nova destinació</span>
					<button
						onClick={() => hideModal()}
						className="modal__close"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="icon icon-tabler icon-tabler-x"
							width={24}
							height={24}
							viewBox="0 0 24 24"
							strokeWidth="2"
							stroke="currentColor"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path
								stroke="none"
								d="M0 0h24v24H0z"
								fill="none"
							></path>
							<line x1={18} y1={6} x2={6} y2={18}></line>
							<line x1={6} y1={6} x2={18} y2={18}></line>
						</svg>
					</button>
				</div>
				{submitError ? (
					<div
						className="mx-6 mt-3 px-4 py-3 rounded-lg bg-red-50 text-red-800 text-sm border border-red-100"
						role="alert"
					>
						{submitError}
					</div>
				) : null}
				<div className="modal__body">
					<form className="form">
						<div className="form__group ">
							<label htmlFor="title" className="form__label">
								Títol de la destinació
							</label>
							<input
								type="text"
								name="title"
								placeholder="Entra el títol de la destinació"
								className="form__control"
								value={destination.title}
								onChange={handleChange}
							/>
						</div>
						<div className="form__group">
							<label htmlFor="longTitle" className="form__label">
								Títol llarg de la destinació
							</label>
							<input
								type="text"
								name="longTitle"
								placeholder="Entra el títol llarg de la destinació"
								className="form__control"
								value={destination.longTitle}
								onChange={handleChange}
							/>
						</div>
						<div className="form__group">
							<label htmlFor="subtitle" className="form__label">
								Subtítol de la destinació
							</label>
							<input
								type="text"
								name="subtitle"
								placeholder="Entra el subtítol de la destinació"
								className="form__control"
								value={destination.subtitle}
								onChange={handleChange}
							/>
						</div>
						<div className="form__group">
							<label
								htmlFor="mapLocation"
								className="form__label"
							>
								Localització de la destinació (iframe)
							</label>
							<textarea
								name="mapLocation"
								id="mapLocation"
								rows="6"
								className="form__control"
								placeholder="Entra l'iframe de la localitzacio de la destinació"
								onChange={handleChange}
							>
								{destination.mapLocation}
							</textarea>
						</div>

						<div className="form__group">
							<span className="form__label">
								Imatge de la destinació
							</span>
							<div className="flex items-center flex-col max-w-full mb-4">
								<div className="bg-white border border-primary-100 rounded-tl-md rounded-tr-md w-full">
									<div className="bg-white border-none h-auto p-4 justify-start">
										<label className="form__label m-0 bg-white rounded-md shadow py-3 px-5 inline-flex items-center cursor-pointer">
											<input
												type="file"
												className="hidden"
												name="image"
												onChange={saveFileToStatus}
											/>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="mr-2"
												width="22"
												height="22"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="#0d1f44"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path
													stroke="none"
													d="M0 0h24v24H0z"
													fill="none"
												/>
												<circle cx="12" cy="13" r="3" />
												<path d="M5 7h2a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h2m9 7v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
												<line
													x1="15"
													y1="6"
													x2="21"
													y2="6"
												/>
												<line
													x1="18"
													y1="3"
													x2="18"
													y2="9"
												/>
											</svg>
											{destination.image
												? "Canviar imatge"
												: "Seleccionar imatge"}
										</label>
									</div>
								</div>
								<div className="w-full border border-primary-100 rounded-br-md rounded-bl-md -mt-px p-4 flex">
									<div className="-m-2.5 flex flex-wrap items-center">
										{imagePreview}
									</div>
								</div>
							</div>
						</div>
						<div className="form__group">
							<span className="form__label">
								Carousel d'imatges
							</span>
							<div className="flex items-center flex-col max-w-full">
								<div className="bg-white border border-primary-100 rounded-tl-md rounded-tr-md w-full overflow-hidden">
									<div className="bg-white border-none h-auto p-3 justify-start">
										<label className="form__label m-0 bg-white rounded-md shadow py-3 px-5 inline-flex items-center cursor-pointer">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="mr-2"
												width="22"
												height="22"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="#0d1f44"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path
													stroke="none"
													d="M0 0h24v24H0z"
													fill="none"
												/>
												<circle cx="12" cy="13" r="3" />
												<path d="M5 7h2a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h2m9 7v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
												<line
													x1="15"
													y1="6"
													x2="21"
													y2="6"
												/>
												<line
													x1="18"
													y1="3"
													x2="18"
													y2="9"
												/>
											</svg>
											Afegir imatge
											<input
												type="file"
												className="hidden"
												multiple="multiple"
												name="carouselImages"
												onChange={saveFileToStatus}
												required
											/>
										</label>
									</div>
								</div>
								<div className="w-full border border-primary-100 rounded-br-md rounded-bl-md -mt-px p-4 flex">
									<div className="columns-3 gap-5">
										{imagesList}
									</div>
								</div>
							</div>
						</div>
						<div className="form__group">
							<label htmlFor="slug" className="form__label">
								URL de la destinació
							</label>
							<input
								type="text"
								name="slug"
								placeholder="Entra l'slug de la destinació"
								className="form__control"
								value={destination.slug}
								onChange={handleChange}
							/>
						</div>
						<div className="form__group">
							<label
								htmlFor="isFeatured"
								className="form__label flex items-center"
							>
								<input
									type="checkbox"
									name="isFeatured"
									id="isFeatured"
									className="mr-2"
									checked={destination.isFeatured}
									onChange={handleCheck}
								/>
								Destinació destacada?
							</label>
						</div>
						<div className="form__group">
							<label
								htmlFor="isSponsored"
								className="form__label flex items-center"
							>
								<input
									type="checkbox"
									name="isSponsored"
									id="isSponsored"
									className="mr-2"
									checked={Boolean(destination.isSponsored)}
									onChange={handleCheck}
								/>
								Destinació patrocinada?
							</label>
						</div>
						<div className="form__group">
							<label htmlFor="sponsorURL" className="form__label">
								URL del patrocinador
							</label>
							<input
								type="text"
								name="sponsorURL"
								placeholder="Entra la URL del patrocinador"
								className="form__control"
								value={destination.sponsorURL}
								onChange={handleChange}
							/>
						</div>
						<div className="image">
							<span className="form__label">
								Logo del patrocinador
							</span>
							<div className="flex items-center flex-col max-w-full mb-4">
								<div className="bg-white border border-primary-100 rounded-tl-md rounded-tr-md w-full">
									<div className="bg-white border-none h-auto p-4 justify-start">
										<label className="form__label m-0 bg-white rounded-md shadow py-3 px-5 inline-flex items-center cursor-pointer">
											<input
												type="file"
												className="hidden"
												name="sponsorLogo"
												onChange={saveFileToStatus}
											/>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="mr-2"
												width="22"
												height="22"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="#0d1f44"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path
													stroke="none"
													d="M0 0h24v24H0z"
													fill="none"
												/>
												<circle cx="12" cy="13" r="3" />
												<path d="M5 7h2a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h2m9 7v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
												<line
													x1="15"
													y1="6"
													x2="21"
													y2="6"
												/>
												<line
													x1="18"
													y1="3"
													x2="18"
													y2="9"
												/>
											</svg>
											{destination.sponsorLogo
												? "Canviar imatge"
												: "Seleccionar imatge"}
										</label>
									</div>
								</div>
								<div className="w-full border border-primary-100 rounded-br-md rounded-bl-md -mt-px p-4 flex">
									<div className="-m-2.5 flex flex-wrap items-center">
										{sponsorLogoPreview}
									</div>
								</div>
							</div>
						</div>
						<div className="form__group">
							<label
								htmlFor="sponsorClaim"
								className="form__label"
							>
								Claim del patrocinador
							</label>
							<input
								type="text"
								name="sponsorClaim"
								placeholder="Entra el claim del patrocinador"
								className="form__control"
								value={destination.sponsorClaim}
								onChange={handleChange}
							/>
						</div>
					</form>
					<div className="form__group">
						<label htmlFor="textSeo" className="form__label">
							reviewText - Review del viatge
						</label>
						<EditorNavbar editor={editorReviewText} />
						<EditorContent
							editor={editorReviewText}
							className="form-composer__editor"
						/>
					</div>
					<div className="form__group">
						<label htmlFor="textSeo" className="form__label">
							mostLikedText - El que ens ha agradat més
						</label>
						<EditorNavbar editor={editorMostLikedText} />
						<EditorContent
							editor={editorMostLikedText}
							className="form-composer__editor"
						/>
					</div>
					<div className="form__group">
						<label htmlFor="textSeo" className="form__label">
							pointsOfInterestText - Punts d'interès
						</label>
						<EditorNavbar editor={editorPointsOfInterestText} />
						<EditorContent
							editor={editorPointsOfInterestText}
							className="form-composer__editor"
						/>
					</div>
					<div className="form__group">
						<label htmlFor="textSeo" className="form__label">
							mustSeeText - Què s'ha de fer sí o sí
						</label>
						<EditorNavbar editor={editorMustSeeText} />
						<EditorContent
							editor={editorMustSeeText}
							className="form-composer__editor"
						/>
					</div>
					<div className="form__group">
						<label htmlFor="textSeo" className="form__label">
							Text SEO header de la destinació
						</label>
						<EditorNavbar editor={editorHeader} />
						<EditorContent
							editor={editorHeader}
							className="form-composer__editor"
						/>
					</div>
					<div className="form__group">
						<label htmlFor="textSeo" className="form__label">
							Text SEO de la destinació
						</label>
						<EditorNavbar editor={editor} />
						<EditorContent
							editor={editor}
							className="form-composer__editor"
						/>
					</div>
				</div>
				<div className="modal__footer">
					<button
						type="button"
						className="button button__primary button__med"
						onClick={handleSubmit}
						disabled={isSaving}
					>
						{isSaving ? "Enviant…" : "Crear"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateDestinationModal;
