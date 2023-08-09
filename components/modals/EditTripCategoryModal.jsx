import { useState, useEffect } from "react";
import ContentService from "../../services/contentService";
import EditorNavbar from "../editor/EditorNavbar";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const EditTripCategoryModal = ({
	visibility,
	hideModal,
	id,
	title,
	subtitle,
	image,
	seoTextHeader,
	seoText,
	slug,
	isSponsored,
	isFeatured,
	sponsorURL,
	sponsorLogo,
	sponsorClaim,
	fetchData,
}) => {
	const service = new ContentService();
	const initialState = {
		id: id,
		title: title,
		subtitle: subtitle,
		image: image,
		blopImage: "",
		cloudImage: "",
		cloudImageUploaded: false,
		seoTextHeader: seoTextHeader,
		seoText: seoText,
		slug: slug,
		isSponsored: isSponsored,
		isFeatured: isFeatured,
		sponsorURL: sponsorURL,
		sponsorLogo: sponsorLogo,
		blopSponsorLogo: "",
		cloudSponsorLogo: "",
		cloudSponsorLogoUploaded: false,
		sponsorClaim: sponsorClaim,
		updatedImage: false,
		updatedIllustration: false,
		updatedSponsorLogo: false,
		isSubmitable: false,
	};

	const [tripCategory, setTripCategory] = useState(initialState);
	const [editorDataHeader, setEditorDataHeader] = useState(seoTextHeader);
	const [editorData, setEditorData] = useState(seoText);

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

	const handleChange = (e) =>
		setTripCategory({ ...tripCategory, [e.target.name]: e.target.value });

	const handleCheck = (e) => {
		if (e.target.checked === true) {
			setTripCategory({ ...tripCategory, isSponsored: true });
		} else {
			setTripCategory({ ...tripCategory, isSponsored: false });
		}

		if (e.target.name === "isFeatured") {
			e.target.checked
				? setTripCategory({ ...tripCategory, isFeatured: true })
				: setTripCategory({ ...tripCategory, isFeatured: false });
		}
	};

	const saveFileToStatus = (e) => {
		const fileToUpload = e.target.files[0];

		if (e.target.name === "image") {
			setTripCategory({
				...tripCategory,
				blopImage: URL.createObjectURL(fileToUpload),
				image: fileToUpload,
				updatedImage: true,
			});
		}
		if (e.target.name === "sponsorLogo") {
			setTripCategory({
				...tripCategory,
				blopSponsorLogo: URL.createObjectURL(fileToUpload),
				sponsorLogo: fileToUpload,
				updatedSponsorLogo: true,
			});
		}
	};

	let imageUploaded, sponsorLogoUploaded;

	const handleFileUpload = async (e) => {
		if (tripCategory.updatedImage) {
			const image = tripCategory.image;
			const uploadData = new FormData();
			uploadData.append("imageUrl", image);
			imageUploaded = await service.uploadFile(uploadData);
		}
		if (tripCategory.updatedSponsorLogo) {
			const sponsorLogo = tripCategory.sponsorLogo;
			const uploadData = new FormData();
			uploadData.append("imageUrl", sponsorLogo);
			sponsorLogoUploaded = await service.uploadFile(uploadData);
		}

		setTripCategory({
			...tripCategory,
			cloudImage: imageUploaded != undefined ? imageUploaded.path : "",
			cloudImageUploaded: imageUploaded != undefined ? true : false,
			cloudSponsorLogo:
				sponsorLogoUploaded != undefined
					? sponsorLogoUploaded.path
					: "",
			cloudSponsorLogoUploaded:
				sponsorLogoUploaded != undefined ? true : false,
			isSubmitable: true,
		});
	};

	const submitTripCategory = async () => {
		const {
			id,
			title,
			subtitle,
			image,
			cloudImage,
			slug,
			isSponsored,
			isFeatured,
			sponsorURL,
			sponsorLogo,
			cloudSponsorLogo,
			sponsorClaim,
		} = tripCategory;
		let categoryImage, categorySponsorLogo;
		cloudImage !== ""
			? (categoryImage = cloudImage)
			: (categoryImage = image);
		cloudSponsorLogo !== ""
			? (categorySponsorLogo = cloudSponsorLogo)
			: (categorySponsorLogo = sponsorLogo);
		service
			.editTripCategoryDetails(
				id,
				slug,
				title,
				subtitle,
				categoryImage,
				editorDataHeader,
				editorData,
				isSponsored,
				isFeatured,
				sponsorURL,
				categorySponsorLogo,
				sponsorClaim
			)
			.then(() => {
				hideModal();
				fetchData();
			})
			.catch((err) => console.error(err));
	};

	useEffect(() => {
		if (tripCategory.isSubmitable) {
			submitTripCategory();
		}
	}, [tripCategory]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (
			tripCategory.updatedIllustration ||
			tripCategory.updatedImage ||
			tripCategory.updatedSponsorLogo
		) {
			handleFileUpload();
		} else {
			submitTripCategory();
		}
	};

	let imagePreview, sponsorLogoPreview;

	if (tripCategory.blopImage) {
		imagePreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={tripCategory.blopImage} />
			</div>
		);
	} else {
		imagePreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={tripCategory.image} />
			</div>
		);
	}

	if (tripCategory.blopSponsorLogo) {
		sponsorLogoPreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={tripCategory.blopSponsorLogo} />
			</div>
		);
	} else {
		sponsorLogoPreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={tripCategory.sponsorLogo} />
			</div>
		);
	}

	let isChecked;
	if (tripCategory.isSponsored === true) {
		isChecked = "checked";
	}

	return (
		<div className={`modal ${visibility == true ? "active" : ""}`}>
			<div className="modal__wrapper">
				<div className="modal__header">
					<span>Edita la categoria de viatge</span>
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
				<div className="modal__body">
					<form className="form">
						<div className="form__group ">
							<label htmlFor="title" className="form__label">
								Títol de la categoria
							</label>
							<input
								type="text"
								name="title"
								placeholder="Entra el títol de la categoria"
								className="form__control"
								value={tripCategory.title}
								onChange={handleChange}
							/>
						</div>
						<div className="form__group">
							<label htmlFor="subtitle" className="form__label">
								Subtítol de la categoria
							</label>
							<input
								type="text"
								name="subtitle"
								placeholder="Entra el subtítol de la categoria"
								className="form__control"
								value={tripCategory.subtitle}
								onChange={handleChange}
							/>
						</div>
						<div className="form__group">
							<label htmlFor="textSeo" className="form__label">
								Text SEO header de la categoria
							</label>
							<EditorNavbar editor={editorHeader} />
							<EditorContent
								editor={editorHeader}
								className="form-composer__editor"
							/>
						</div>
						<div className="form__group">
							<span className="form__label">
								Imatge de la catagoria
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
											{tripCategory.image
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
							<label htmlFor="textSeo" className="form__label">
								Text SEO de la categoria
							</label>
							<EditorNavbar editor={editor} />
							<EditorContent
								editor={editor}
								className="form-composer__editor"
							/>
						</div>
						<div className="form__group">
							<label htmlFor="slug" className="form__label">
								URL de la categoria
							</label>
							<input
								type="text"
								name="slug"
								placeholder="Entra l'slug de la categoria"
								className="form__control"
								value={tripCategory.slug}
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
									checked={isFeatured}
									onChange={handleCheck}
								/>
								Categoria destacada?
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
									checked={isChecked}
									onChange={handleCheck}
								/>
								Categoria patrocinada?
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
								value={tripCategory.sponsorURL}
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
											{tripCategory.sponsorLogo
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
								value={tripCategory.sponsorClaim}
								onChange={handleChange}
							/>
						</div>
					</form>
				</div>
				<div className="modal__footer">
					<button
						className="button button__primary button__med"
						onClick={handleSubmit}
					>
						Editar categoria
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditTripCategoryModal;
