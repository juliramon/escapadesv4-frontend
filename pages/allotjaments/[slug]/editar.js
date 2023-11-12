import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import FetchingSpinner from "../../../components/global/FetchingSpinner";
import Head from "next/head";
import ContentService from "../../../services/contentService";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UserContext from "../../../contexts/UserContext";
import NavigationBar from "../../../components/global/NavigationBar";
import Autocomplete from "react-google-autocomplete";
import EditorNavbar from "../../../components/editor/EditorNavbar";
import { EditorView } from "prosemirror-view";

EditorView.prototype.updateState = function updateState(state) {
	if (!this.docView) return; // This prevents the matchesNode error on hot reloads
	this.updateStateInner(state, this.state.plugins !== state.plugins);
};

const EditionForm = () => {
	// Validate if user is allowed to access this view
	const { user } = useContext(UserContext);
	const [loadPage, setLoadPage] = useState(false);
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
		place: {},
		formData: {
			emptyForm: true,
			type: "place",
			isVerified: false,
			title: "",
			subtitle: "",
			slug: "slug",
			categories: [],
			seasons: [],
			region: "",
			placeType: "",
			characteristics: [],
			cover: "",
			blopCover: "",
			images: [],
			blopImages: [],
			cloudImages: [],
			coverCloudImage: "",
			cloudImagesUploaded: false,
			coverCloudImageUploaded: false,
			review: "",
			relatedStory: "",
			description: "",
			phone: "",
			website: "",
			place_full_address: "",
			place_locality: "",
			place_province: "",
			place_state: "",
			place_country: "",
			place_lat: "",
			place_lng: "",
			place_rating: 0,
			place_id: "",
			place_opening_hours: "",
			price: "",
			isReadyToSubmit: false,
			metaTitle: "",
			metaDescription: "",
		},
		characteristics: [],
		stories: [],
		isPlaceLoaded: false,
	};

	const [state, setState] = useState(initialState);
	const [queryId, setQueryId] = useState(null);
	const [activeTab, setActiveTab] = useState("main");
	const [description, setDescription] = useState({});

	useEffect(() => {
		if (router && router.route) {
			setQueryId(router.route);
		}
	}, [router]);

	const service = new ContentService();

	const editor = useEditor({
		extensions: [StarterKit],
		content: description,
		onUpdate: (props) => {
			const data = {
				html: props.editor.getHTML(),
				text: props.editor.state.doc.textContent,
			};
			setDescription(data.html);
		},
		autofocus: false,
		parseOptions: {
			preserveWhitespace: true,
		},
	});

	// Fetch data
	useEffect(() => {
		if (router.query.slug !== undefined) {
			const fetchData = async () => {
				const userOrganizations =
					await service.checkOrganizationsOwned();
				let hasOrganizations;
				userOrganizations.number > 0
					? (hasOrganizations = true)
					: (hasOrganizations = false);
				setState({
					...state,
					formData: {
						...state.formData,
						userOrganizations: userOrganizations,
					},
				});
				let placeDetails = await service.getPlaceDetails(
					router.query.slug
				);
				const characteristics = await service.getCharacteristics();
				const stories = await service.getStories();
				if (user && placeDetails && characteristics && stories) {
					setLoadPage(true);
				}
				setState({
					...state,
					place: placeDetails,
					formData: {
						_id: placeDetails._id,
						type: placeDetails.type,
						isVerified: placeDetails.isVerified,
						title: placeDetails.title,
						subtitle: placeDetails.subtitle,
						slug: placeDetails.slug,
						categories: placeDetails.categories,
						characteristics: placeDetails.characteristics
							? placeDetails.characteristics
							: [],
						seasons: placeDetails.seasons,
						region: placeDetails.region,
						placeType: placeDetails.placeType,
						cover: placeDetails.cover,
						blopCover: "",
						images: [],
						blopImages: [],
						cloudImages: [],
						coverCloudImage: "",
						cloudImagesUploaded: false,
						coverCloudImageUploaded: false,
						phone: placeDetails.phone,
						website: placeDetails.website,
						place_full_address: "",
						place_locality: "",
						place_province: "",
						place_state: "",
						place_country: "",
						place_lat: "",
						place_lng: "",
						place_rating: 0,
						place_id: "",
						place_opening_hours: "",
						price: placeDetails.price,
						review: placeDetails.review,
						relatedStory: placeDetails.relarelatedStory,
						metaTitle: placeDetails.metaTitle,
						metaDescription: placeDetails.metaDescription,
					},
					characteristics: characteristics,
					stories: stories.allStories,
					isPlaceLoaded: true,
				});
				setDescription(placeDetails.description);
				if (editor) {
					editor.commands.setContent(placeDetails.description);
				}
			};

			fetchData();
		}
	}, [queryId, router.query.slug]);

	const saveFileToStatus = (e) => {
		const fileToUpload = e.target.files[0];
		if (e.target.name === "cover") {
			setState({
				...state,
				formData: {
					...state.formData,
					blopCover: URL.createObjectURL(fileToUpload),
					cover: fileToUpload,
					updatedCover: true,
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
					updatedImages: true,
				},
			});
		}
	};

	let imagesList, coverImage;

	if (
		state.place.images ||
		state.formData.blopImages ||
		state.formData.images
	) {
		let stateImages;
		state.formData.blopImages.length > 0
			? (stateImages = state.formData.blopImages)
			: (stateImages = state.place.images);
		if (stateImages) {
			imagesList = stateImages.map((el, idx) => (
				<div
					className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow"
					key={idx}
				>
					<img src={el} />
				</div>
			));
		}
	}

	if (state.formData.blopCover || state.formData.cover) {
		coverImage = (
			<div className="m-2 relative w-48 h-auto overflow-hidden rounded-md border-8 border-white shadow">
				<img src={state.formData.blopCover || state.formData.cover} />
			</div>
		);
	}

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

	const checkIfCategoryChecked = (val) => {
		if (state.formData.categories) {
			return state.formData.categories.includes(val) ? true : false;
		}
	};

	const checkIfSeasonChecked = (val) => {
		if (state.formData.seasons) {
			return state.formData.seasons.includes(val) ? true : false;
		}
	};

	const checkIfRegionChecked = (val) => {
		if (state.formData.region) {
			return state.formData.region.includes(val) ? true : false;
		}
	};

	const checkIfTypeChecked = (val) => {
		if (state.formData.placeType) {
			return state.formData.placeType.includes(val) ? true : false;
		}
	};

	const checkIfCharacteristicChecked = (val) => {
		if (state.formData.characteristics) {
			return state.formData.characteristics.includes(val) ? true : false;
		}
	};

	const handleCheckPlaceType = (e) => {
		setState({
			...state,
			formData: { ...state.formData, placeType: e.target.id },
		});
	};

	const handleCheckCharacteristic = (e) => {
		let characteristics = state.formData.characteristics;
		if (e.target.checked === true) {
			characteristics.push(e.target.id);
		} else {
			let index = characteristics.indexOf(e.target.id);

			characteristics.splice(index, 1);
		}
		setState({
			...state,
			formData: { ...state.formData, characteristics: characteristics },
		});
	};

	const handleCheckCategory = (e) => {
		setState({
			...state,
			formData: { ...state.formData, categories: e.target.id },
		});
	};

	const handleCheckSeason = (e) => {
		let seasons = state.formData.seasons;
		if (e.target.checked === true) {
			seasons.push(e.target.id);
		} else {
			let index = seasons.indexOf(e.target.id);

			seasons.splice(index, 1);
		}
		setState({
			...state,
			formData: { ...state.formData, seasons: seasons },
		});
	};

	const handleCheckRegion = (e) => {
		setState({
			...state,
			formData: { ...state.formData, region: e.target.id },
		});
	};

	const handleCheckOrganization = (e) => {
		setState({
			...state,
			formData: { ...state.formData, organization: e.target.id },
		});
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

	const submitPlace = async () => {
		const {
			_id,
			cover,
			images,
			place_full_address,
			place_locality,
			place_province,
			place_state,
			place_country,
			place_lat,
			place_lng,
			place_rating,
			place_id,
			place_opening_hours,
		} = state.place;
		const {
			categories,
			seasons,
			characteristics,
			region,
			placeType,
			isVerified,
			title,
			subtitle,
			coverCloudImage,
			cloudImages,
			price,
			phone,
			website,
			slug,
			review,
			relatedStory,
			metaTitle,
			metaDescription,
		} = state.formData;
		let placeCover, placeImages;
		coverCloudImage !== ""
			? (placeCover = coverCloudImage)
			: (placeCover = cover);
		cloudImages.length > 0
			? (placeImages = cloudImages)
			: (placeImages = images);
		service
			.editPlace(
				_id,
				slug,
				isVerified,
				title,
				subtitle,
				categories,
				seasons,
				characteristics,
				region,
				placeType,
				placeCover,
				placeImages,
				review,
				relatedStory,
				description,
				phone,
				website,
				place_full_address,
				place_locality,
				place_province,
				place_state,
				place_country,
				place_lat,
				place_lng,
				place_rating,
				place_id,
				place_opening_hours,
				price,
				metaTitle,
				metaDescription
			)
			.then(() => router.push("/2i8ZXlkM4cFKUPBrm3-admin-panel"));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (
			state.formData.blopCover !== "" ||
			state.formData.blopImages.length > 0
		) {
			handleFileUpload();
		} else {
			submitPlace();
		}
	};

	useEffect(() => {
		if (
			state.formData.cloudImagesUploaded === true &&
			state.formData.coverCloudImageUploaded === true
		) {
			submitPlace();
		}
	}, [state.formData]);

	useEffect(() => {
		const {
			title,
			subtitle,
			slug,
			categories,
			seasons,
			characteristics,
			region,
			isVerified,
			placeType,
			place_full_address,
			phone,
			website,
			coverImage,
			images,
			price,
			organization,
			metaTitle,
			metaDescription,
		} = state.formData;

		if (
			title &&
			subtitle &&
			slug &&
			categories &&
			seasons &&
			characteristics &&
			region &&
			isVerified &&
			placeType &&
			place_full_address &&
			phone &&
			website &&
			images.length > 0 &&
			coverImage !== "" &&
			description &&
			price &&
			organization &&
			metaTitle &&
			metaDescription
		) {
			setState((state) => ({ ...state, isReadyToSubmit: true }));
		}
	}, [state.formData]);

	useEffect(() => {
		if (router.query.step === "publicacio-fitxa") {
			setState({ ...state, step: "publicacio-fitxa" });
		}
	}, [router]);

	const handleCheck = (e) => {
		if (e.target.name === "isVerified") {
			e.target.checked
				? setState({
						...state,
						formData: { ...state.formData, isVerified: true },
				  })
				: setState({
						...state,
						formData: { ...state.formData, isVerified: false },
				  });
		}
	};

	if (!loadPage) {
		return <FetchingSpinner />;
	}

	return (
		<>
			<Head>
				<title>Edita l'allotjament - Escapadesenparella.cat</title>
			</Head>
			<div id="place">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
					user={user}
					path={queryId}
				/>
				<section className="pb-10">
					<div className="container">
						<div className="pt-7 pb-12">
							<div className="flex items-center justify-between">
								<div className="w-full lg:w-1/2">
									<h1 className="text-3xl">
										Potencia la visibilitat del teu
										allotjament
									</h1>
									<p className="text-base">
										Descriu l'allotjament per arribar a
										parelles d'arreu de Catalunya
									</p>
								</div>
							</div>
							<div className="form-composer__body">
								<div className="flex items-center justify-between overflow-hidden border border-primary-100 mb-4 bg-white shadow rounded-md">
									<button
										className={`flex-1 bg-none px-4 py-4 text-primary-500 !rounded-md-none focus:border-t-4 focus:border-primary-500 text-sm ${
											activeTab === "main"
												? "border-t-4 border-primary-500"
												: ""
										}`}
										onClick={() => setActiveTab("main")}
									>
										Contingut principal
									</button>
									<button
										className={`flex-1 bg-none px-4 py-4 text-primary-500 !rounded-md-none focus:border-t-4 focus:border-primary-500 text-sm ${
											activeTab === "seo"
												? "border-t-4 border-primary-500"
												: ""
										}`}
										onClick={() => setActiveTab("seo")}
									>
										SEO
									</button>
								</div>
								{activeTab === "main" ? (
									<div className="form__wrapper">
										<form
											className="form"
											onSubmit={handleSubmit}
										>
											<div className="form__group">
												<label
													htmlFor="title"
													className="form__label"
												>
													Títol
												</label>
												<input
													type="text"
													name="title"
													placeholder="Títol de l'allotjament"
													className="form__control"
													value={state.formData.title}
													onChange={handleChange}
												/>
											</div>
											<div className="form__group">
												<label
													htmlFor="subtitle"
													className="form__label"
												>
													Subtítol
												</label>
												<input
													type="text"
													name="subtitle"
													placeholder="Subtítol de l'allotjament"
													className="form__control"
													value={
														state.formData.subtitle
													}
													onChange={handleChange}
												/>
											</div>
											<div className="flex flex-wrap items-stretch mt-2">
												<div className="form__group w-3/12">
													<label
														htmlFor="categoria"
														className="form__label"
													>
														Categoria d'escapada
													</label>
													<label
														htmlFor="romantica"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeCategory"
															id="romantica"
															className="mr-2"
															onChange={
																handleCheckCategory
															}
															checked={checkIfCategoryChecked(
																"romantica"
															)}
														/>
														Romàntica
													</label>
													<label
														htmlFor="aventura"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeCategory"
															id="aventura"
															className="mr-2"
															onChange={
																handleCheckCategory
															}
															checked={checkIfCategoryChecked(
																"aventura"
															)}
														/>
														Aventura
													</label>
													<label
														htmlFor="gastronomica"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeCategory"
															id="gastronomica"
															className="mr-2"
															onChange={
																handleCheckCategory
															}
															checked={checkIfCategoryChecked(
																"gastronomica"
															)}
														/>
														Gastronòmica
													</label>
													<label
														htmlFor="cultural"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeCategory"
															id="cultural"
															className="mr-2"
															onChange={
																handleCheckCategory
															}
															checked={checkIfCategoryChecked(
																"cultural"
															)}
														/>
														Cultural
													</label>
													<label
														htmlFor="relax"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeCategory"
															id="relax"
															className="mr-2"
															onChange={
																handleCheckCategory
															}
															checked={checkIfCategoryChecked(
																"relax"
															)}
														/>
														Relax
													</label>
												</div>
												<div className="form__group w-3/12">
													<label
														htmlFor="categoria"
														className="form__label"
													>
														Estacions recomanades
													</label>
													<label
														htmlFor="hivern"
														className="form__label flex items-center"
													>
														<input
															type="checkbox"
															name="hivern"
															id="hivern"
															className="mr-2"
															onChange={
																handleCheckSeason
															}
															checked={checkIfSeasonChecked(
																"hivern"
															)}
														/>
														Hivern
													</label>
													<label
														htmlFor="primavera"
														className="form__label flex items-center"
													>
														<input
															type="checkbox"
															name="primavera"
															id="primavera"
															className="mr-2"
															onChange={
																handleCheckSeason
															}
															checked={checkIfSeasonChecked(
																"primavera"
															)}
														/>
														Primavera
													</label>
													<label
														htmlFor="estiu"
														className="form__label flex items-center"
													>
														<input
															type="checkbox"
															name="estiu"
															id="estiu"
															className="mr-2"
															onChange={
																handleCheckSeason
															}
															checked={checkIfSeasonChecked(
																"estiu"
															)}
														/>
														Estiu
													</label>
													<label
														htmlFor="tardor"
														className="form__label flex items-center"
													>
														<input
															type="checkbox"
															name="tardor"
															id="tardor"
															className="mr-2"
															onChange={
																handleCheckSeason
															}
															checked={checkIfSeasonChecked(
																"tardor"
															)}
														/>
														Tardor
													</label>
												</div>
												<div className="form__group w-3/12">
													<label
														htmlFor="categoria"
														className="form__label"
													>
														Regió de l'allotjament
													</label>
													<label
														htmlFor="barcelona"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeRegion"
															id="barcelona"
															className="mr-2"
															onChange={
																handleCheckRegion
															}
															checked={checkIfRegionChecked(
																"barcelona"
															)}
														/>
														Barcelona
													</label>
													<label
														htmlFor="tarragona"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeRegion"
															id="tarragona"
															className="mr-2"
															onChange={
																handleCheckRegion
															}
															checked={checkIfRegionChecked(
																"tarragona"
															)}
														/>
														Tarragona
													</label>
													<label
														htmlFor="girona"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeRegion"
															id="girona"
															className="mr-2"
															onChange={
																handleCheckRegion
															}
															checked={checkIfRegionChecked(
																"girona"
															)}
														/>
														Girona
													</label>
													<label
														htmlFor="lleida"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeRegion"
															id="lleida"
															className="mr-2"
															onChange={
																handleCheckRegion
															}
															checked={checkIfRegionChecked(
																"lleida"
															)}
														/>
														Lleida
													</label>
													<label
														htmlFor="costabrava"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeRegion"
															id="costaBrava"
															className="mr-2"
															onChange={
																handleCheckRegion
															}
															checked={checkIfRegionChecked(
																"costabrava"
															)}
														/>
														Costa Brava
													</label>
													<label
														htmlFor="costaDaurada"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeRegion"
															id="costaDaurada"
															className="mr-2"
															onChange={
																handleCheckRegion
															}
															checked={checkIfRegionChecked(
																"costaDaurada"
															)}
														/>
														Costa Daurada
													</label>
													<label
														htmlFor="pirineus"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeRegion"
															id="pirineus"
															className="mr-2"
															onChange={
																handleCheckRegion
															}
															checked={checkIfRegionChecked(
																"pirineus"
															)}
														/>
														Pirineus
													</label>
												</div>
												<div className="form__group w-3/12">
													<label
														htmlFor="categoria"
														className="form__label"
													>
														Tipologia d'allotjament
													</label>
													<label
														htmlFor="hotel"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeType"
															id="hotel"
															className="mr-2"
															onChange={
																handleCheckPlaceType
															}
															checked={checkIfTypeChecked(
																"hotel"
															)}
														/>
														Hotel
													</label>
													<label
														htmlFor="apartament"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeType"
															id="apartament"
															className="mr-2"
															onChange={
																handleCheckPlaceType
															}
															checked={checkIfTypeChecked(
																"apartament"
															)}
														/>
														Apartament
													</label>
													<label
														htmlFor="refugi"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeType"
															id="refugi"
															className="mr-2"
															onChange={
																handleCheckPlaceType
															}
															checked={checkIfTypeChecked(
																"refugi"
															)}
														/>
														Refugi
													</label>
													<label
														htmlFor="casaarbre"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeType"
															id="casaarbre"
															className="mr-2"
															onChange={
																handleCheckPlaceType
															}
															checked={checkIfTypeChecked(
																"casaarbre"
															)}
														/>
														Casa-arbre
													</label>
													<label
														htmlFor="casarural"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeType"
															id="casarural"
															className="mr-2"
															onChange={
																handleCheckPlaceType
															}
															checked={checkIfTypeChecked(
																"casarural"
															)}
														/>
														Casa rural
													</label>
													<label
														htmlFor="carabana"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeType"
															id="carabana"
															className="mr-2"
															onChange={
																handleCheckPlaceType
															}
															checked={checkIfTypeChecked(
																"carabana"
															)}
														/>
														Carabana
													</label>
													<label
														htmlFor="camping"
														className="form__label flex items-center"
													>
														<input
															type="radio"
															name="placeType"
															id="camping"
															className="mr-2"
															onChange={
																handleCheckPlaceType
															}
															checked={checkIfTypeChecked(
																"camping"
															)}
														/>
														Càmping
													</label>
												</div>
												<div className="form__group w-full">
													<label
														htmlFor="caracteristica"
														className="form__label"
													>
														Característiques de
														l'allotjament
													</label>
													<ul className="list-none flex flex-wrap items-start m-0 p-0">
														{state.characteristics
															? state.characteristics.map(
																	(el) => (
																		<li
																			key={
																				el.id
																			}
																			className="pr-5 pb-5 w-1/2 md:w-1/3 lg:w-1/5"
																		>
																			<label
																				htmlFor={
																					el.name
																				}
																				className="form__label flex items-center"
																			>
																				<input
																					type="checkbox"
																					name={
																						el.name
																					}
																					id={
																						el.name
																					}
																					className="mr-2"
																					onChange={
																						handleCheckCharacteristic
																					}
																					checked={checkIfCharacteristicChecked(
																						el.name
																					)}
																				/>
																				<span
																					dangerouslySetInnerHTML={{
																						__html: el.icon,
																					}}
																					className="w-8 h-8 mr-1.5"
																				></span>

																				{
																					el.name
																				}
																			</label>
																		</li>
																	)
															  )
															: null}
													</ul>
												</div>
											</div>
											<div className="form__group">
												<label
													htmlFor="loaction"
													className="form__label"
												>
													Localització
												</label>
												<Autocomplete
													className="form__control"
													apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`}
													style={{ width: "100%" }}
													onPlaceSelected={(
														place
													) => {
														let place_full_address,
															place_locality,
															place_province,
															place_state,
															place_country,
															place_lat,
															place_lng,
															place_rating,
															place_id,
															place_opening_hours;

														place_full_address =
															place.formatted_address;
														place.address_components.forEach(
															(el) => {
																if (
																	el
																		.types[0] ===
																	"locality"
																) {
																	place_locality =
																		el.long_name;
																}
																if (
																	el
																		.types[0] ===
																	"administrative_area_level_2"
																) {
																	place_province =
																		el.long_name;
																}
																if (
																	el
																		.types[0] ===
																	"administrative_area_level_1"
																) {
																	place_state =
																		el.long_name;
																}
																if (
																	el
																		.types[0] ===
																	"country"
																) {
																	place_country =
																		el.long_name;
																}
															}
														);

														if (
															place.geometry
																.viewport
														) {
															place_lat =
																Object.values(
																	place
																		.geometry
																		.viewport
																)[0].hi;
															place_lng =
																Object.values(
																	place
																		.geometry
																		.viewport
																)[1].hi;
														}

														place_rating =
															place.rating;
														place_id =
															place.place_id;

														if (
															place.opening_hours
														) {
															place_opening_hours =
																place
																	.opening_hours
																	.weekday_text;
														}

														setState({
															...state,
															formData: {
																...state.formData,
																place_full_address:
																	place_full_address,
																place_locality:
																	place_locality,
																place_province:
																	place_province,
																place_state:
																	place_state,
																place_country:
																	place_country,
																place_lat:
																	place_lat,
																place_lng:
																	place_lng,
																place_rating:
																	place_rating,
																place_id:
																	place_id,
																place_opening_hours:
																	place_opening_hours,
															},
														});
													}}
													types={["establishment"]}
													placeholder={
														"Escriu la direcció de l'allotjament"
													}
													fields={[
														"rating",
														"place_id",
														"opening_hours",
														"address_components",
														"formatted_address",
														"geometry",
													]}
												/>
											</div>
											<div className="flex flex-wrap items-center">
												<div className="form__group w-3/12">
													<label
														htmlFor="phone"
														className="form__label"
													>
														Número de telèfon
													</label>
													<input
														type="tel"
														name="phone"
														placeholder="Número de telèfon de l'allotjament"
														className="form__control"
														value={
															state.formData.phone
														}
														onChange={handleChange}
													/>
												</div>

												<div className="form__group w-3/12">
													<label
														htmlFor="website"
														className="form__label"
													>
														Pàgina web de reserva o
														contacte
													</label>
													<input
														type="url"
														name="website"
														placeholder="Pàgina web de reserva o contacte"
														className="form__control"
														value={
															state.formData
																.website
														}
														onChange={handleChange}
													/>
												</div>

												<div className="form__group w-3/12">
													<label
														htmlFor="price"
														className="form__label"
													>
														Preu per nit (€)
													</label>
													<input
														type="number"
														name="price"
														placeholder="Preu per nit de l'allotjament"
														className="form__control"
														value={
															state.formData.price
														}
														onChange={handleChange}
													/>
												</div>
											</div>
											<div className="cover">
												<span className="form__label">
													Imatge de portada
												</span>
												<div className="flex items-center flex-col max-w-full mb-4">
													<div className="bg-white border border-primary-100 rounded-tl-md rounded-tr-md w-full">
														<div className="bg-white border-none h-auto p-4 justify-start">
															<label className="form__label m-0 bg-white rounded-md shadow py-3 px-5 inline-flex items-center cursor-pointer">
																<input
																	type="file"
																	className="hidden"
																	name="cover"
																	onChange={
																		saveFileToStatus
																	}
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
																{state.place
																	.cover
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
											<div className="images">
												<span className="form__label">
													Imatges d'aquest allotjament
												</span>
												<div className="flex items-center flex-col max-w-full mb-4">
													<div className="bg-white border border-primary-100 rounded-tl-md rounded-tr-md w-full">
														<div className="bg-white border-none h-auto p-4 justify-start">
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
																Seleccionar
																imatges
																<input
																	type="file"
																	className="hidden"
																	onChange={
																		saveFileToStatus
																	}
																/>
															</label>
														</div>
													</div>
													<div className="w-full border border-primary-100 rounded-br-md rounded-bl-md -mt-px p-4 flex">
														<div className="-m-2.5 flex flex-wrap items-center">
															{imagesList}
														</div>
													</div>
												</div>
											</div>
											<div className="flex flex-wrap items-stretch mt-2">
												<div className="form__group w-1/2">
													<label className="form__label">
														Escapada verificada?
													</label>
													<div className="flex items-center">
														<label
															htmlFor="isVerified"
															className="form__label flex items-center"
														>
															<input
																type="checkbox"
																name="isVerified"
																id="isVerified"
																className="mr-2"
																onClick={
																	handleCheck
																}
																checked={
																	state
																		.formData
																		.isVerified
																}
															/>
															Verificada
														</label>
													</div>
												</div>
												{state.formData.isVerified ? (
													<>
														<div className="form__group w-full">
															<label
																htmlFor="review"
																className="form__label"
															>
																Review de
																l'escapada
															</label>
															<div className="flex items-center">
																<textarea
																	id="review"
																	name="review"
																	placeholder="Review de l'allotjament"
																	className="form__control"
																	value={
																		state
																			.formData
																			.review
																	}
																	onChange={
																		handleChange
																	}
																/>
															</div>
														</div>
														<div className="form__group w-full">
															<label
																htmlFor="review"
																className="form__label"
															>
																Selecciona la
																"Història"
																relacionada
															</label>
															<div className="flex items-center">
																<select
																	id="relatedStory"
																	name="relatedStory"
																	className="form__control"
																	onChange={
																		handleChange
																	}
																>
																	<option
																		value=""
																		default
																		hidden
																	>
																		Selecciona
																		una
																		història
																	</option>
																	{state.stories &&
																	state
																		.stories
																		.length >
																		0
																		? state.stories.map(
																				(
																					el
																				) => {
																					return (
																						<option
																							value={
																								el._id
																							}
																							key={
																								el._id
																							}
																							selected={
																								el._id ===
																								state
																									.place
																									?.relatedStory
																									?._id
																									? "true"
																									: null
																							}
																						>
																							{
																								el.title
																							}
																						</option>
																					);
																				}
																		  )
																		: null}
																</select>
															</div>
														</div>
													</>
												) : null}
											</div>
										</form>
										<div className="form__group mt-2">
											<label
												htmlFor="description"
												className="form__label"
											>
												Descripció
											</label>
											<EditorNavbar editor={editor} />
											<EditorContent
												editor={editor}
												className="form-composer__editor"
											/>
										</div>
									</div>
								) : (
									<div className="form__wrapper">
										<form
											className="form"
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
													placeholder="Meta títol"
													className="form__control"
													value={
														state.formData.metaTitle
													}
													onChange={handleChange}
												/>
												<span className="form__text_info">
													Cada publicació hauria de
													tenir un meta títol únic,
													idealment de menys de 60
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
													placeholder="Meta descripció"
													className="form__control"
													value={
														state.formData
															.metaDescription
													}
													onChange={handleChange}
												/>
												<span className="form__text_info">
													Cada publicació hauria de
													tenir una meta descripció
													única, idealment de menys de
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
													placeholder="Slug de l'allotjament"
													className="form__control"
													value={state.formData.slug}
													onChange={handleChange}
												/>
											</div>
										</form>
									</div>
								)}
							</div>
						</div>
					</div>
				</section>

				<div className="w-full fixed bottom-0 inset-x-0 bg-white border-t border-primary-50 py-2.5 z-50">
					<div className="container flex items-center justify-end">
						<button
							className="button button__primary button__lg"
							type="submit"
							onClick={handleSubmit}
						>
							Guardar canvis
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default EditionForm;
