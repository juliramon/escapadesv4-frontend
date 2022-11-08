import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import NavigationBar from "../components/global/NavigationBar";
import UserContext from "../contexts/UserContext";
import ContentService from "../services/contentService";
import dynamic from "next/dynamic";

// Quill configuration
const QuillNoSSRWrapper = dynamic(import("react-quill"), {
	ssr: false,
	loading: () => <p>Loading ...</p>,
});

const modules = {
	toolbar: [
		[{ header: "1" }, { header: "2" }],
		["bold", "italic", "underline", "strike", "blockquote"],
		[{ list: "ordered" }, { list: "bullet" }],
		["link"],
	],
	clipboard: {
		matchVisual: false,
	},
};

const formats = [
	"header",
	"bold",
	"italic",
	"underline",
	"strike",
	"blockquote",
	"list",
	"bullet",
	"link",
];
// End Quill configuration

const StoryForm = () => {
	// Validate if user is allowed to access this view
	const { user } = useContext(UserContext);
	const [loadPage, setLoadPage] = useState(false);
	useEffect(() => {
		if (user) {
			setLoadPage(true);
		}
	}, []);
	// End validation

	const router = useRouter();

	useEffect(() => {
		if (!user || user === "null" || user === undefined) {
			router.push("/login");
		} else {
			if (user) {
				if (user.accountCompleted === false) {
					router.push("/signup/complete-account");
				}
				if (user.hasConfirmedEmail === false) {
					router.push("/signup/confirmacio-correu");
				}
			}
		}
		if (
			router.pathname.includes("editar") ||
			router.pathname.includes("nova-activitat") ||
			router.pathname.includes("nou-allotjament") ||
			router.pathname.includes("nova-historia") ||
			router.pathname.includes("nova-llista")
		) {
			document.querySelector("body").classList.add("bg-primary-100");
		} else {
			document.querySelector("body").classList.remove("bg-primary-100");
		}
	}, [user]);

	const initialState = {
		formData: {
			emptyForm: true,
			type: "story",
			title: "",
			subtitle: "",
			slug: "",
			cover: "",
			blopCover: "",
			images: [],
			blopImages: [],
			cloudImages: [],
			coverCloudImage: "",
			isReadyToSubmit: false,
			cloudImagesUploaded: false,
			coverCloudImageUploaded: false,
			metaTitle: "",
			metaDescription: "",
		},
	};

	const [state, setState] = useState(initialState);
	const [queryId, setQueryId] = useState(null);
	const [activeTab, setActiveTab] = useState("main");

	useEffect(() => {
		if (router && router.route) {
			setQueryId(router.route);
		}
	}, [router]);

	const service = new ContentService();

	const saveFileToStatus = (e) => {
		const fileToUpload = e.target.files[0];
		if (e.target.name === "cover") {
			setState({
				...state,
				formData: {
					...state.formData,
					blopCover: URL.createObjectURL(fileToUpload),
					cover: fileToUpload,
				},
			});
		} else {
			setState({
				...state,
				formData: {
					...state.formData,
					blopImages: [
						...state.formData.blopImages,
						URL.createObjectURL(fileToUpload),
					],
					images: [...state.formData.images, fileToUpload],
				},
			});
		}
	};

	const handleChange = (e) => {
		setState({
			...state,
			formData: {
				...state.formData,
				[e.target.name]: e.target.value,
				emptyForm: false,
			},
		});
	};

	const imagesList = state.formData.blopImages.map((el, idx) => (
		<div
			className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow"
			key={idx}
		>
			<img src={el} />
		</div>
	));

	let coverImage;
	if (state.formData.blopCover) {
		coverImage = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={state.formData.blopCover} />
			</div>
		);
	}

	const [description, setDescription] = useState("");

	const submitStory = async () => {
		const {
			type,
			title,
			subtitle,
			slug,
			coverCloudImage,
			cloudImages,
			metaTitle,
			metaDescription,
		} = state.formData;
		service
			.story(
				type,
				slug,
				title,
				subtitle,
				coverCloudImage,
				cloudImages,
				description,
				metaTitle,
				metaDescription
			)
			.then(() => router.push("/2i8ZXlkM4cFKUPBrm3-admin-panel"))
			.catch((err) => console.error(err));
	};

	const handleFileUpload = async (e) => {
		const imagesList = state.formData.images;
		const cover = state.formData.cover;
		let uploadedImages = [];
		const uploadData = new FormData();
		uploadData.append("imageUrl", cover);
		const uploadedCover = await service.uploadFile(uploadData);
		imagesList.forEach((el) => {
			const uploadData = new FormData();
			uploadData.append("imageUrl", el);
			service.uploadFile(uploadData).then((res) => {
				uploadedImages.push(res.path);
				if (uploadedImages.length === state.formData.images.length) {
					setState({
						...state,
						formData: {
							...state.formData,
							cloudImages: uploadedImages,
							coverCloudImage: uploadedCover.path,
							cloudImagesUploaded: true,
							coverCloudImageUploaded: true,
						},
					});
				}
			});
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		handleFileUpload();
	};

	useEffect(() => {
		if (
			state.formData.cloudImagesUploaded === true &&
			state.formData.coverCloudImageUploaded === true &&
			state.formData.coverCloudImage.length > 0
		) {
			submitStory();
		}
	}, [state.formData]);

	useEffect(() => {
		const { title, subtitle, images, description, metaTitle, metaDescription } =
			state.formData;

		if (
			title &&
			subtitle &&
			coverImage &&
			images &&
			description &&
			metaTitle &&
			metaDescription
		) {
			setState((state) => ({ ...state, isReadyToSubmit: true }));
		}
	}, [state.formData, description]);

	return (
		<>
			<Head>
				<title>Comparteix una nova història - Escapadesenparella.cat</title>
			</Head>
			<div id="storyForm">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
					user={user}
					path={queryId}
				/>
				<Container className="mw-1600">
					<Row>
						<Col lg={12}>
							<div className="form-composer">
								<div className="form-composer__header">
									<div className="form-composer__header-left">
										<h1>Comparteix una història</h1>
										<p className="sub-h1">
											Escriu una nova història per inspirar a altres parelles.
										</p>
									</div>
									<div className="form-composer__header-right">
										<Button type="submit" variant="none" onClick={handleSubmit}>
											Publicar
										</Button>
									</div>
								</div>
								<div className="form-composer__body">
									<div className="form-composer__tab-bar">
										<button
											className={
												activeTab === "main"
													? "form-composer__tab active"
													: "form-composer__tab"
											}
											onClick={() => setActiveTab("main")}
										>
											Contingut principal
										</button>
										<button
											className={
												activeTab === "seo"
													? "form-composer__tab active"
													: "form-composer__tab"
											}
											onClick={() => setActiveTab("seo")}
										>
											SEO
										</button>
									</div>
									{activeTab === "main" ? (
										<div className="form-composer__post-content">
											<Form>
												<Form.Group>
													<Form.Label>Títol</Form.Label>
													<Form.Control
														type="text"
														name="title"
														placeholder="Títol de la història"
														onChange={handleChange}
														value={state.formData.title}
													/>
												</Form.Group>
												<Form.Group>
													<Form.Label>Subtítol</Form.Label>
													<Form.Control
														type="text"
														name="subtitle"
														placeholder="Subtítol de la història"
														onChange={handleChange}
														value={state.formData.subtitle}
													/>
												</Form.Group>
												<div className="cover">
													<span>Imatge de portada</span>
													<div className="images-wrapper">
														<div className="top-bar">
															<Form.Group>
																<div className="image-drop-zone">
																	<Form.Label>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="icon icon-tabler icon-tabler-camera-plus"
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
																			<line x1="15" y1="6" x2="21" y2="6" />
																			<line x1="18" y1="3" x2="18" y2="9" />
																		</svg>
																		Afegir imatge
																		<Form.Control
																			type="file"
																			name="cover"
																			onChange={saveFileToStatus}
																			max="1"
																		/>
																	</Form.Label>
																</div>
															</Form.Group>
														</div>
														<div className="images-list-wrapper">
															<div className="image-wrapper">{coverImage}</div>
														</div>
													</div>
												</div>
												<div className="images">
													<span>Imatges d'aquesta història</span>
													<div className="images-wrapper">
														<div className="top-bar">
															<Form.Group>
																<div className="image-drop-zone">
																	<Form.Label>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="icon icon-tabler icon-tabler-camera-plus"
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
																			<line x1="15" y1="6" x2="21" y2="6" />
																			<line x1="18" y1="3" x2="18" y2="9" />
																		</svg>
																		Afegir imatge
																		<Form.Control
																			type="file"
																			onChange={saveFileToStatus}
																		/>
																	</Form.Label>
																</div>
															</Form.Group>
														</div>
														<div className="images-list-wrapper">
															<div className="image-wrapper">{imagesList}</div>
														</div>
													</div>
												</div>
												<Form.Group>
													<Form.Label>Descripció</Form.Label>
													<QuillNoSSRWrapper
														className="form-control"
														modules={modules}
														formats={formats}
														theme="bubble"
														placeholder={
															"Comença a descriure la teva historia..."
														}
														value={description}
														onChange={setDescription}
													/>
												</Form.Group>
											</Form>
										</div>
									) : (
										<div className="form-composer__seo">
											<Form onSubmit={handleSubmit}>
												<Form.Group>
													<Form.Label>
														Meta títol{" "}
														<span className="form-composer__label-description">
															Cada publicació hauria de tenir un meta títol
															únic, idealment de menys de 60 caràcters de
															llargada
														</span>
													</Form.Label>
													<Form.Control
														type="text"
														name="metaTitle"
														placeholder="Meta títol"
														defaultValue={state.formData.metaTitle}
														onChange={handleChange}
													/>
												</Form.Group>
												<Form.Group>
													<Form.Label>
														Meta descripció{" "}
														<span className="form-composer__label-description">
															Cada publicació hauria de tenir una meta
															descripció única, idealment de menys de 160
															caràcters de llargada
														</span>
													</Form.Label>
													<Form.Control
														type="text"
														name="metaDescription"
														placeholder="Meta descripció"
														defaultValue={state.formData.metaDescription}
														onChange={handleChange}
													/>
												</Form.Group>
												<Form.Group>
													<Form.Label>Slug</Form.Label>
													<Form.Control
														type="text"
														name="slug"
														placeholder="Slug de la història"
														onChange={handleChange}
														value={state.formData.slug}
													/>
												</Form.Group>
											</Form>
										</div>
									)}
								</div>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		</>
	);
};

export default StoryForm;
