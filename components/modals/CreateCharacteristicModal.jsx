import { useEffect, useState } from "react";
import ContentService from "../../services/contentService";
import EditorNavbar from "../editor/EditorNavbar";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import slugify from "slugify";

const CreateCharacteristicModal = ({ visibility, hideModal, fetchData }) => {
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

	const [characteristic, setCharacteristic] = useState(initialState);

	const { seoTextHeader, seoText } = characteristic;

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
		setCharacteristic({
			...characteristic,
			[e.target.name]: e.target.value,
		});
	};

	const handleCheck = (e) => {
		if (e.target.name === "isPlace") {
			if (e.target.checked === true) {
				setCharacteristic({ ...characteristic, isPlace: true });
			} else {
				setCharacteristic({ ...characteristic, isPlace: false });
			}
		} else {
			if (e.target.checked === true) {
				setCharacteristic({ ...characteristic, isSponsored: true });
			} else {
				setCharacteristic({ ...characteristic, isSponsored: false });
			}
		}

		if (e.target.name === "isFeatured") {
			e.target.checked
				? setCharacteristic({ ...characteristic, isFeatured: true })
				: setCharacteristic({ ...characteristic, isFeatured: false });
		}
	};

	const saveFileToStatus = (e) => {
		const fileToUpload = e.target.files[0];
		if (e.target.name === "illustration") {
			setCharacteristic({
				...characteristic,
				blopIllustration: URL.createObjectURL(fileToUpload),
				illustration: fileToUpload,
				updatedIllustration: true,
			});
		}
		if (e.target.name === "image") {
			setCharacteristic({
				...characteristic,
				blopImage: URL.createObjectURL(fileToUpload),
				image: fileToUpload,
				updatedImage: true,
			});
		}
		if (e.target.name === "sponsorLogo") {
			setCharacteristic({
				...characteristic,
				blopSponsorLogo: URL.createObjectURL(fileToUpload),
				sponsorLogo: fileToUpload,
				updatedSponsorLogo: true,
			});
		}
	};

	let imageUploaded, sponsorLogoUploaded, illustrationUploaded;

	// const handleFileUpload = async (e) => {
	// 	if (characteristic.updatedImage) {
	// 		const image = characteristic.image;
	// 		const uploadData = new FormData();
	// 		uploadData.append("imageUrl", image);
	// 		imageUploaded = await service.uploadFile(uploadData);
	// 	}
	// 	if (characteristic.updatedSponsorLogo) {
	// 		const sponsorLogo = characteristic.sponsorLogo;
	// 		const uploadData = new FormData();
	// 		uploadData.append("imageUrl", sponsorLogo);
	// 		sponsorLogoUploaded = await service.uploadFile(uploadData);
	// 	}
	// 	if (characteristic.updatedIllustration) {
	// 		const illustration = characteristic.illustration;
	// 		const uploadData = new FormData();
	// 		uploadData.append("imageUrl", illustration);
	// 		illustrationUploaded = await service.uploadFile(uploadData);
	// 	}

	// 	setCharacteristic({
	// 		...characteristic,
	// 		cloudImage: imageUploaded != undefined ? imageUploaded.path : "",
	// 		cloudImageUploaded: imageUploaded != undefined ? true : false,
	// 		cloudSponsorLogo:
	// 			sponsorLogoUploaded != undefined
	// 				? sponsorLogoUploaded.path
	// 				: "",
	// 		cloudSponsorLogoUploaded:
	// 			sponsorLogoUploaded != undefined ? true : false,
	// 		cloudIllustration:
	// 			illustrationUploaded != undefined
	// 				? illustrationUploaded.path
	// 				: "",
	// 		cloudIllustrationUploaded:
	// 			illustrationUploaded != undefined ? true : false,
	// 		isSubmitable: true,
	// 	});
	// };

	const submitCharacteristic = async () => {
		const slug = await slugify(characteristic.title, {
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
		} = characteristic;
		service
			.createCharacteristic(
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
		submitCharacteristic();
	};

	// useEffect(() => {
	// 	if (
	// 		characteristic.cloudImageUploaded === true ||
	// 		characteristic.cloudSponsorLogoUploaded === true ||
	// 		(characteristic.cloudImageUploaded === true &&
	// 			characteristic.cloudSponsorLogoUploaded === true)
	// 	) {
	// 		submitCharacteristic();
	// 	}
	// }, [characteristic]);

	useEffect(() => {
		if (!characteristic.isSponsored) {
			if (
				characteristic.sponsorURL !== "" ||
				characteristic.sponsorLogo !== "" ||
				characteristic.blopSponsorLogo !== "" ||
				characteristic.sponsorClaim !== ""
			) {
				setCharacteristic({
					...characteristic,
					sponsorURL: "",
					sponsorLogo: "",
					blopSponsorLogo: "",
					sponsorClaim: "",
				});
			}
		}
	});

	let illustrationPreview, imagePreview, sponsorLogoPreview;
	if (characteristic.blopIllustration) {
		illustrationPreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={characteristic.blopIllustration} />
			</div>
		);
	} else {
		illustrationPreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={characteristic.illustration} />
			</div>
		);
	}

	if (characteristic.blopImage) {
		imagePreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={characteristic.blopImage} />
			</div>
		);
	} else {
		imagePreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={characteristic.image} />
			</div>
		);
	}

	if (characteristic.blopSponsorLogo) {
		sponsorLogoPreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={characteristic.blopSponsorLogo} />
			</div>
		);
	} else {
		sponsorLogoPreview = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={characteristic.sponsorLogo} />
			</div>
		);
	}

	let isChecked;
	if (characteristic.isSponsored === true) {
		isChecked = "checked";
	}

	return (
		<div className={`modal ${visibility == true ? "active" : ""}`}>
			<div className="modal__wrapper">
				<div className="modal__header">
					<span>Crea una nova característica</span>
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
								Nom en singular de la característica
							</label>
							<input
								type="text"
								name="name"
								placeholder="Entra el nom en singular de la característica"
								className="form__control"
								value={characteristic.name}
								onChange={handleChange}
							/>
						</div>
						{/* <div className="form__group ">
							<label htmlFor="pluralName" className="form__label">
								Nom en plural de la característica
							</label>
							<input
								type="text"
								name="pluralName"
								placeholder="Entra el nom en plural de la característica"
								className="form__control"
								value={characteristic.pluralName}
								onChange={handleChange}
							/>
						</div> */}
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
									checked={characteristic.isPlace}
								/>
								És característica d'allotjament?
							</label>
						</div>
						{/* <div className="form__group ">
							<label htmlFor="title" className="form__label">
								Títol de la característica
							</label>
							<input
								type="text"
								name="title"
								placeholder="Entra el títol de la característica"
								className="form__control"
								value={characteristic.title}
								onChange={handleChange}
							/>
						</div> */}
						{/* <div className="form__group">
							<label htmlFor="subtitle" className="form__label">
								Subtítol de la característica
							</label>
							<input
								type="text"
								name="subtitle"
								placeholder="Entra el subtítol de la característica"
								className="form__control"
								value={characteristic.subtitle}
								onChange={handleChange}
							/>
						</div>
						<div className="form__group">
							<label htmlFor="textSeo" className="form__label">
								Text SEO header de la característica
							</label>
							<EditorNavbar editor={editorHeader} />
							<EditorContent
								editor={editorHeader}
								className="form-composer__editor"
							/>
						</div> */}
						{/* <div className="form__group">
							<span className="form__label">
								Il·lustració de la característica
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
											{characteristic.illustration
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
								Imatge de la característica
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
											{characteristic.image
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
								Image caption de la característica
							</label>
							<input
								type="text"
								name="imageCaption"
								placeholder="Entra la image caption de la característica"
								className="form__control"
								value={characteristic.imageCaption}
								onChange={handleChange}
							/>
						</div> */}
						<div className="form__group">
							<label htmlFor="title" className="form__label">
								Icona de la característica
							</label>
							<textarea
								rows="3"
								cols="3"
								placeholder="Entra text svg de l'icona de la característica"
								className="form__control"
								name="icon"
								onChange={handleChange}
								value={characteristic.icon}
							></textarea>
						</div>
						{/* <div className="form__group">
							<label htmlFor="textSeo" className="form__label">
								Text SEO de la característica
							</label>
							<EditorNavbar editor={editor} />
							<EditorContent
								editor={editor}
								className="form-composer__editor"
							/>
						</div> */}
						{/* <div className="form__group">
							<label htmlFor="slug" className="form__label">
								URL de la característica
							</label>
							<input
								type="text"
								name="slug"
								placeholder="Entra l'slug de la característica"
								className="form__control"
								value={characteristic.slug}
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
									checked={characteristic.isFeatured}
									onChange={handleCheck}
								/>
								Característica destacada?
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
								característica patrocinada?
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
								value={characteristic.sponsorURL}
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
											{characteristic.sponsorLogo
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
								value={characteristic.sponsorClaim}
								onChange={handleChange}
							/>
						</div> */}
					</form>
				</div>
				<div className="modal__footer">
					<button
						className="button button__primary button__med"
						onClick={handleSubmit}
					>
						Editar característica
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateCharacteristicModal;
