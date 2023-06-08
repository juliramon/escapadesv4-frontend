import { useEffect, useState } from "react";
import ContentService from "../../services/contentService";
import EditorNavbar from "../../components/editor/EditorNavbar";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import slugify from "slugify";

const CreateCategoryModal = ({ visibility, hideModal, fetchData }) => {
	const service = new ContentService();

	const initialState = {
		name: "",
		pluralName: "",
		isPlace: false,
		title: "",
		subtitle: "",
		illustration: "",
		blopIllustration: "",
		cloudIllustration: "",
		cloudIllustrationUploaded: false,
		image: "",
		blopImage: "",
		cloudImage: "",
		cloudImageUploaded: false,
		imageCaption: "",
		icon: "",
		seoTextHeader: "",
		seoText: "",
		isFeatured: false,
		isSponsored: false,
		sponsorURL: "",
		sponsorLogo: "",
		blopSponsorLogo: "",
		cloudSponsorLogo: "",
		cloudSponsorLogoUploaded: false,
		sponsorClaim: "",
	};

	const [category, setCategory] = useState(initialState);

	const { seoTextHeader, seoText } = category;

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

	const handleChange = (e) => {
		setCategory({ ...category, [e.target.name]: e.target.value });
	};

	const handleCheck = (e) => {
		if (e.target.name === "isPlace") {
			if (e.target.checked === true) {
				setCategory({ ...category, isPlace: true });
			} else {
				setCategory({ ...category, isPlace: false });
			}
		} else {
			if (e.target.checked === true) {
				setCategory({ ...category, isSponsored: true });
			} else {
				setCategory({ ...category, isSponsored: false });
			}
		}

		if (e.target.name === "isFeatured") {
			e.target.checked
				? setCategory({ ...category, isFeatured: true })
				: setCategory({ ...category, isFeatured: false });
		}
	};

	const saveFileToStatus = (e) => {
		const fileToUpload = e.target.files[0];
		if (e.target.name === "illustration") {
			setCategory({
				...category,
				blopIllustration: URL.createObjectURL(fileToUpload),
				illustration: fileToUpload,
				updatedIllustration: true,
			});
		}
		if (e.target.name === "image") {
			setCategory({
				...category,
				blopImage: URL.createObjectURL(fileToUpload),
				image: fileToUpload,
				updatedImage: true,
			});
		}
		if (e.target.name === "sponsorLogo") {
			setCategory({
				...category,
				blopSponsorLogo: URL.createObjectURL(fileToUpload),
				sponsorLogo: fileToUpload,
				updatedSponsorLogo: true,
			});
		}
	};

	let imageUploaded, sponsorLogoUploaded, illustrationUploaded;

	const handleFileUpload = async (e) => {
		if (category.updatedImage) {
			const image = category.image;
			const uploadData = new FormData();
			uploadData.append("imageUrl", image);
			imageUploaded = await service.uploadFile(uploadData);
		}
		if (category.updatedSponsorLogo) {
			const sponsorLogo = category.sponsorLogo;
			const uploadData = new FormData();
			uploadData.append("imageUrl", sponsorLogo);
			sponsorLogoUploaded = await service.uploadFile(uploadData);
		}
		if (category.updatedIllustration) {
			const illustration = category.illustration;
			const uploadData = new FormData();
			uploadData.append("imageUrl", illustration);
			illustrationUploaded = await service.uploadFile(uploadData);
		}

		setCategory({
			...category,
			cloudImage: imageUploaded != undefined ? imageUploaded.path : "",
			cloudImageUploaded: imageUploaded != undefined ? true : false,
			cloudSponsorLogo:
				sponsorLogoUploaded != undefined
					? sponsorLogoUploaded.path
					: "",
			cloudSponsorLogoUploaded:
				sponsorLogoUploaded != undefined ? true : false,
			cloudIllustration:
				illustrationUploaded != undefined
					? illustrationUploaded.path
					: "",
			cloudIllustrationUploaded:
				illustrationUploaded != undefined ? true : false,
			isSubmitable: true,
		});
	};

	const submitCategory = async () => {
		const slug = await slugify(category.title, {
			remove: /[*+~.,()'"!:@]/g,
			lower: true,
		});
		const {
			isFeatured,
			isSponsored,
			name,
			pluralName,
			isPlace,
			title,
			subtitle,
			cloudIllustration,
			cloudImage,
			imageCaption,
			icon,
			sponsorURL,
			cloudSponsorLogo,
			sponsorClaim,
		} = category;
		service
			.createCategory(
				isFeatured,
				isSponsored,
				slug,
				name,
				pluralName,
				isPlace,
				title,
				subtitle,
				cloudIllustration,
				cloudImage,
				imageCaption,
				icon,
				editorDataHeader,
				editorData,
				sponsorURL,
				cloudSponsorLogo,
				sponsorClaim
			)
			.then(() => {
				hideModal();
				fetchData();
			})
			.catch((err) => console.error(err));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		handleFileUpload();
	};

	useEffect(() => {
		if (
			category.cloudImageUploaded === true ||
			category.cloudSponsorLogoUploaded === true ||
			(category.cloudImageUploaded === true &&
				category.cloudSponsorLogoUploaded === true)
		) {
			submitCategory();
		}
	}, [category]);

	useEffect(() => {
		if (!category.isSponsored) {
			if (
				category.sponsorURL !== "" ||
				category.sponsorLogo !== "" ||
				category.blopSponsorLogo !== "" ||
				category.sponsorClaim !== ""
			) {
				setCategory({
					...category,
					sponsorURL: "",
					sponsorLogo: "",
					blopSponsorLogo: "",
					sponsorClaim: "",
				});
			}
		}
	});

	let illustrationPreview, imagePreview, sponsorLogoPreview;
	if (category.blopIllustration) {
		illustrationPreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={category.blopIllustration} />
			</div>
		);
	} else {
		illustrationPreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={category.illustration} />
			</div>
		);
	}

	if (category.blopImage) {
		imagePreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={category.blopImage} />
			</div>
		);
	} else {
		imagePreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={category.image} />
			</div>
		);
	}

	if (category.blopSponsorLogo) {
		sponsorLogoPreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={category.blopSponsorLogo} />
			</div>
		);
	} else {
		sponsorLogoPreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={category.sponsorLogo} />
			</div>
		);
	}

	let isChecked;
	if (category.isSponsored === true) {
		isChecked = "checked";
	}

	return (
		<div className={`modal ${visibility == true ? "active" : ""}`}>
			<div className="modal__wrapper">
				<div className="modal__header">
					<span>Crea una nova categoria</span>
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
							<label htmlFor="name" className="form__label">
								Nom en singular de la categoria
							</label>
							<input
								type="text"
								name="name"
								placeholder="Entra el nom en singular de la categoria"
								className="form__control"
								value={category.name}
								onChange={handleChange}
							/>
						</div>
						<div className="form__group ">
							<label htmlFor="pluralName" className="form__label">
								Nom en plural de la categoria
							</label>
							<input
								type="text"
								name="pluralName"
								placeholder="Entra el nom en plural de la categoria"
								className="form__control"
								value={category.pluralName}
								onChange={handleChange}
							/>
						</div>
						<div className="form__group">
							<label
								htmlFor="isPlace"
								className="form__label flex items-center"
							>
								<input
									type="checkbox"
									name="isPlace"
									id="isPlace"
									className="mr-2"
									onChange={handleCheck}
									checked={category.isPlace}
								/>
								És categoria d'allotjament?
							</label>
						</div>
						<div className="form__group ">
							<label htmlFor="title" className="form__label">
								Títol de la categoria
							</label>
							<input
								type="text"
								name="title"
								placeholder="Entra el títol de la categoria"
								className="form__control"
								value={category.title}
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
								value={category.subtitle}
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
								Il·lustració de la categoria
							</span>
							<div className="flex items-center flex-col max-w-full mb-4">
								<div className="bg-white border border-primary-100 rounded-tl-md rounded-tr-md w-full">
									<div className="bg-white border-none h-auto p-4 justify-start">
										<label className="form__label m-0 bg-white rounded-md shadow py-3 px-5 inline-flex items-center cursor-pointer">
											<input
												type="file"
												className="hidden"
												name="illustration"
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
											{category.illustration
												? "Canviar imatge"
												: "Seleccionar imatge"}
										</label>
									</div>
								</div>
								<div className="w-full border border-primary-100 rounded-br-md rounded-bl-md -mt-px p-4 flex">
									<div className="-m-2.5 flex flex-wrap items-center">
										{illustrationPreview}
									</div>
								</div>
							</div>
						</div>
						<div className="form__group">
							<span className="form__label">
								Imatge de la categoria
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
											{category.image
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
							<label htmlFor="subtitle" className="form__label">
								Image caption de la categoria
							</label>
							<input
								type="text"
								name="imageCaption"
								placeholder="Entra la image caption de la categoria"
								className="form__control"
								value={category.imageCaption}
								onChange={handleChange}
							/>
						</div>
						<div className="form__group">
							<label htmlFor="title" className="form__label">
								Icona de la categoria
							</label>
							<textarea
								rows="3"
								cols="3"
								placeholder="Entra text svg de l'icona de la categoria"
								className="form__control"
								name="icon"
								onChange={handleChange}
								value={category.icon}
							></textarea>
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
								value={category.slug}
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
									checked={category.isFeatured}
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
								value={category.sponsorURL}
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
											{category.sponsorLogo
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
								value={category.sponsorClaim}
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

export default CreateCategoryModal;
