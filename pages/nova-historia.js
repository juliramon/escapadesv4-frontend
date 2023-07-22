import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import NavigationBar from "../components/global/NavigationBar";
import UserContext from "../contexts/UserContext";
import ContentService from "../services/contentService";
import { useEditor, EditorContent } from "@tiptap/react";
import EditorNavbar from "../components/editor/EditorNavbar";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { handleFilesUpload, removeImage } from "../utils/helpers";

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
	const [editorData, setEditorData] = useState({});
	const [queryId, setQueryId] = useState(null);
	const [activeTab, setActiveTab] = useState("main");

	useEffect(() => {
		if (router && router.route) {
			setQueryId(router.route);
		}
	}, [router]);

	const editor = useEditor({
		extensions: [
			StarterKit,
			Image.configure({
				inline: false,
				HTMLAttributes: {
					class: "img-frame",
				},
			}),
			Placeholder.configure({
				placeholder: "Comença a escriure la teva història...",
			}),
		],
		content: "",
		onUpdate: (props) => {
			const data = {
				html: props.editor.getHTML(),
				text: props.editor.state.doc.textContent,
			};
			setEditorData(data);
		},
		autofocus: false,
		parseOptions: {
			preserveWhitespace: true,
		},
	});

	const service = new ContentService();

	const saveFileToStatus = (e) => {
		if (e.target.name === "cover") {
			const fileToUpload = e.target.files[0];
			setState({
				...state,
				formData: {
					...state.formData,
					blopCover: URL.createObjectURL(fileToUpload),
					cover: fileToUpload,
				},
			});
		} else {
			const choosenFiles = Array.prototype.slice.call(e.target.files);
			const filesToUpload = [];

			choosenFiles.forEach((file) => filesToUpload.push(file));

			const blopImages = filesToUpload.map((file) =>
				URL.createObjectURL(file)
			);
			const images = filesToUpload.map((image) => image);
			setState({
				...state,
				formData: {
					...state.formData,
					blopImages: [...state.formData.blopImages, ...blopImages],
					images: [...state.formData.images, ...images],
				},
			});
		}
	};

	const handleChange = (e) => {
		if (e.target.nodeName == "TEXTAREA") {
			e.target.style.height = "0px";
			const scrollHeight = e.target.scrollHeight;
			e.target.style.height = scrollHeight + "px";
		}
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
			className="relative overflow-hidden rounded-md border-8 border-white shadow mb-5"
			key={idx}
		>
			<button
				type="button"
				onClick={() => {
					const objImages = removeImage(
						idx,
						state.formData.blopImages,
						state.formData.images
					);
					setState({
						...state,
						formData: {
							...state.formData,
							images: objImages.arrImages,
							blopImages: objImages.arrBlopImages,
						},
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

	let coverImage;
	if (state.formData.blopCover) {
		coverImage = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={state.formData.blopCover} />
			</div>
		);
	}

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
				editorData.html,
				metaTitle,
				metaDescription
			)
			.then(() => router.push("/2i8ZXlkM4cFKUPBrm3-admin-panel"))
			.catch((err) => console.error(err));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const { uploadedCover, uploadedImages } = await handleFilesUpload(
			state.formData.cover,
			state.formData.images
		);

		if (uploadedCover && uploadedImages) {
			setState({
				...state,
				formData: {
					...state.formData,
					cloudImages: uploadedImages,
					coverCloudImage: uploadedCover,
					cloudImagesUploaded: true,
					coverCloudImageUploaded: true,
				},
			});
		}
	};

	useEffect(() => {
		if (
			state.formData.coverCloudImageUploaded === true &&
			state.formData.coverCloudImage.length > 0
		) {
			submitStory();
		}
	}, [state.formData]);

	useEffect(() => {
		const { title, subtitle, metaTitle, metaDescription } = state.formData;

		if (
			title &&
			subtitle &&
			coverImage &&
			editorData &&
			metaTitle &&
			metaDescription
		) {
			setState((state) => ({ ...state, isReadyToSubmit: true }));
		}
	}, [state.formData, editorData]);

	return (
		<>
			<Head>
				<title>
					Publicar una nova història - Escapadesenparella.cat
				</title>
			</Head>
			<div id="storyForm" className="bg-white h-screen">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
					user={user}
					path={queryId}
				/>

				<section className="form__container">
					<div className="flex items-center justify-between px-4 border-y border-primary-100 sticky top-0 z-50 bg-white">
						<div className="w-1/4 py-2.5">
							<h1 className="text-lg my-0">
								Publicar una nova història
							</h1>
						</div>
						<div className="flex flex-wrap items-center justify-center flex-1 px-12 py-2.5">
							<button
								className={`rounded-full px-6 py-2.5 border border-primary-500 text-xs mr-2 ${
									activeTab === "main"
										? "bg-primary-500 text-white"
										: ""
								}`}
								onClick={() => setActiveTab("main")}
							>
								Contingut principal
							</button>
							<button
								className={`rounded-full px-6 py-2.5 border border-primary-500 text-xs ${
									activeTab === "imatges"
										? "bg-primary-500 text-white"
										: ""
								}`}
								onClick={() => setActiveTab("imatges")}
							>
								Imatges
							</button>
						</div>
						<div className="w-full lg:w-1/4 flex justify-end py-2.5 ">
							<button
								className="button button__primary button__med"
								type="submit"
								onClick={handleSubmit}
							>
								Publicar
							</button>
						</div>
					</div>
					<div className="form-composer__body flex flex-wrap items-stretch h-full">
						<div className="flex-1">
							{activeTab === "main" ? (
								<div className="py-16 max-w-prose mx-auto">
									<form className="form">
										<div className="form__group">
											<textarea
												name="title"
												id="title"
												placeholder="Escriu un títol per a la teva història"
												className="border-none bg-white text-5xl text-primary-900 placeholder-primary-900 outline-none resize-none min-h-[auto overflow-hidden leading-tight"
												value={state.formData.title}
												rows={2}
												onChange={handleChange}
												required
											></textarea>
										</div>
										<div className="form__group">
											<textarea
												name="subtitle"
												id="subtitle"
												placeholder="Escriu una introducció curta a la història"
												className="border-none bg-white text-2xl text-primary-900 placeholder-primary-900 outline-none resize-none"
												rows={1}
												value={state.formData.subtitle}
												onChange={handleChange}
												required
											></textarea>
										</div>
									</form>
									<div className="mt-8">
										{state.formData.images.length > 0 ? (
											<div className="text-primary-300 flex items-center mb-1.5 text-sm">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="mr-1"
													width={16}
													height={16}
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
													<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
													<path d="M12 8l.01 0"></path>
													<path d="M11 12l1 0l0 4l1 0"></path>
												</svg>
												<span>
													Hi ha{" "}
													<strong>
														{
															state.formData
																.images.length
														}{" "}
														imatges
													</strong>{" "}
													disponibles. Utilitza el
													shortcut{" "}
													<strong>
														post_images(n, m + 1)
													</strong>{" "}
													per inserir-les a la
													publicació.
												</span>
											</div>
										) : null}
										<EditorNavbar editor={editor} />
										<EditorContent
											editor={editor}
											className="form-composer__editor"
										/>
									</div>
								</div>
							) : (
								<div className="py-10 max-w-prose mx-auto">
									<div className="form__group">
										<span className="form__label">
											Imatges de la publicació
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
															<circle
																cx="12"
																cy="13"
																r="3"
															/>
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
															onChange={
																saveFileToStatus
															}
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
								</div>
							)}
						</div>
						<aside className="w-2/12 border-l border-primary-100">
							<form
								className="px-4 py-6 sticky top-0"
								onSubmit={handleSubmit}
							>
								<div className="form__group">
									<label
										htmlFor="metaTitle"
										className="form__label"
									>
										Meta títol{" "}
									</label>
									<input
										type="text"
										name="metaTitle"
										id="metaTitle"
										placeholder="Meta títol"
										className="form__control"
										value={state.formData.metaTitle}
										onChange={handleChange}
										required
									/>
									<span className="form__text_info">
										Cada publicació hauria de tenir un meta
										títol únic, idealment de menys de 60
										caràcters de llargada
									</span>
								</div>

								<div className="form__group">
									<label
										htmlFor="metaDescription"
										className="form__label"
									>
										Meta descripció{" "}
									</label>
									<input
										type="text"
										name="metaDescription"
										id="metaDescription"
										placeholder="Meta descripció"
										className="form__control"
										value={state.formData.metaDescription}
										onChange={handleChange}
										required
									/>
									<span className="form__text_info">
										Cada publicació hauria de tenir una meta
										descripció única, idealment de menys de
										160 caràcters de llargada
									</span>
								</div>

								<div className="form__group">
									<label
										htmlFor="slug"
										className="form__label"
									>
										Slug{" "}
									</label>
									<input
										type="text"
										name="slug"
										id="slug"
										placeholder="Slug de la història"
										className="form__control"
										value={state.formData.slug}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="form__group">
									<span className="form__label">
										Imatge de portada
									</span>
									<div className="flex items-center flex-col max-w-full">
										<div className="bg-white border border-primary-100 rounded-tl-md rounded-tr-md w-full overflow-hidden">
											<div className="bg-white border-none h-auto p-3 justify-start">
												<label className="form__label m-0 bg-white rounded-md shadow py-3 px-5 inline-flex items-center cursor-pointer">
													<input
														type="file"
														className="hidden"
														name="cover"
														id="cover"
														onChange={
															saveFileToStatus
														}
														required
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
														<circle
															cx="12"
															cy="13"
															r="3"
														/>
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
													{state.formData.cover
														? "Canviar imatge"
														: "Seleccionar imatge"}
												</label>
											</div>
										</div>
										<div className="w-full border border-primary-100 rounded-br-md rounded-bl-md -mt-px p-4 flex">
											<div className="-m-2.5 flex flex-wrap items-center">
												{coverImage}
											</div>
										</div>
									</div>
								</div>
							</form>
						</aside>
					</div>
				</section>
			</div>
		</>
	);
};

export default StoryForm;
