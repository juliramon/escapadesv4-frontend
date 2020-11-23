import {useState, useEffect, useContext} from "react";
import NavigationBar from "../../../components/global/NavigationBar";
import {Container, Row, Col, Form, Button} from "react-bootstrap";
import ContentService from "../../../services/contentService";
import Router, {useRouter} from "next/router";
import Autocomplete from "react-google-autocomplete";
import UserContext from "../../../contexts/UserContext";
import Head from "next/head";

const ActivityEditionForm = () => {
	const {user} = useContext(UserContext);
	const router = useRouter();

	useEffect(() => {
		if (!user) {
			router.push("/login");
		}
	}, [user]);

	if (!user) {
		return (
			<Head>
				<title>Carregant...</title>
			</Head>
		);
	}

	const initialState = {
		activity: {},
		isActivityLoaded: false,
	};
	const [state, setState] = useState(initialState);

	const [queryId, setQueryId] = useState(null);
	useEffect(() => {
		if (router && router.query) {
			setQueryId(router.query.id);
		}
	}, [router]);

	const service = new ContentService();

	useEffect(() => {
		const fetchData = async () => {
			let activityDetails = await service.activityDetails(queryId);
			setState({...state, activity: activityDetails, isActivityLoaded: true});
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryId]);

	let isRomantic,
		isAdventure,
		isGastronomic,
		isCultural,
		isRelax,
		isWinter,
		isSpring,
		isSummer,
		isAutumn,
		isBarcelona,
		isTarragona,
		isGirona,
		isLleida,
		isCostaBrava,
		isCostaDaurada,
		isPirineus;

	if (state.activity.categories) {
		state.activity.categories.includes("romantic")
			? (isRomantic = true)
			: (isRomantic = false);
		state.activity.categories.includes("adventure")
			? (isAdventure = true)
			: (isAdventure = false);
		state.activity.categories.includes("gastronomic")
			? (isGastronomic = true)
			: (isGastronomic = false);
		state.activity.categories.includes("cultural")
			? (isCultural = true)
			: (isCultural = false);
		state.activity.categories.includes("relax")
			? (isRelax = true)
			: (isRelax = false);
	}
	if (state.activity.seasons) {
		state.activity.seasons.includes("winter")
			? (isWinter = true)
			: (isWinter = false);
		state.activity.seasons.includes("spring")
			? (isSpring = true)
			: (isSpring = false);
		state.activity.seasons.includes("summer")
			? (isSummer = true)
			: (isSummer = false);
		state.activity.seasons.includes("autumn")
			? (isAutumn = true)
			: (isAutumn = false);
	}
	if (state.activity.region) {
		state.activity.region.includes("barcelona")
			? (isBarcelona = true)
			: (isBarcelona = false);
		state.activity.region.includes("tarragona")
			? (isTarragona = true)
			: (isTarragona = false);
		state.activity.region.includes("girona")
			? (isGirona = true)
			: (isGirona = false);
		state.activity.region.includes("lleida")
			? (isLleida = true)
			: (isLleida = false);
		state.activity.region.includes("costaBrava")
			? (isCostaBrava = true)
			: (isCostaBrava = false);
		state.activity.region.includes("costaDaurada")
			? (isCostaDaurada = true)
			: (isCostaDaurada = false);
		state.activity.region.includes("pirineus")
			? (isPirineus = true)
			: (isPirineus = false);
	}

	const {
		title,
		subtitle,
		activity_full_address,
		phone,
		website,
		price,
		duration,
		description,
	} = state.activity;

	const handleFileUpload = (e) => {
		const fileToUpload = e.target.files[0];
		const uploadData = new FormData();
		uploadData.append("imageUrl", fileToUpload);
		service.uploadFile(uploadData).then((res) => {
			setState({
				...state,
				activity: {
					...state.activity,
					images: [...state.activity.images, res.path],
				},
			});
		});
	};

	const handleCheckCategory = (e) => {
		let categories = state.activity.categories;
		if (e.target.checked === true) {
			categories.push(e.target.id);
		} else {
			let index = categories.indexOf(e.target.id);
			categories.splice(index, 1);
		}
		setState({
			...state,
			activity: {...state.activity, categories: categories},
		});
	};

	const handleCheckSeason = (e) => {
		let seasons = state.activity.seasons;
		if (e.target.checked === true) {
			seasons.push(e.target.id);
		} else {
			let index = seasons.indexOf(e.target.id);

			seasons.splice(index, 1);
		}
		setState({
			...state,
			activity: {...state.activity, seasons: seasons},
		});
	};

	const handleCheckRegion = (e) => {
		setState({
			...state,
			activity: {...state.activity, region: e.target.id},
		});
	};

	const handleChange = (e) =>
		setState({
			...state,
			activity: {...state.activity, [e.target.name]: e.target.value},
		});

	const handleSubmit = (e) => {
		e.preventDefault();
		const {
			_id,
			title,
			subtitle,
			categories,
			seasons,
			region,
			images,
			description,
			phone,
			website,
			activity_full_address,
			activity_locality,
			activity_province,
			activity_state,
			activity_country,
			activity_lat,
			activity_lng,
			activity_rating,
			activity_place_id,
			activity_opening_hours,
			duration,
			price,
		} = state.activity;
		service
			.editActivity(
				_id,
				title,
				subtitle,
				categories,
				seasons,
				region,
				images,
				description,
				phone,
				website,
				activity_full_address,
				activity_locality,
				activity_province,
				activity_state,
				activity_country,
				activity_lat,
				activity_lng,
				activity_rating,
				activity_place_id,
				activity_opening_hours,
				duration,
				price
			)
			.then(() => Router.push("/dashboard"));
	};

	return (
		<>
			<Head>
				<title>Edita l'activitat - Escapadesenparella.cat</title>
			</Head>

			<div id="activity" className="composer">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
					}
					user={user}
					path={queryId}
				/>
				<Container className="mw-1600">
					<Row>
						<Col lg={12} className="sided-shadow">
							<div className="form-composer">
								<h1>Editar l'activitaty</h1>
								<p className="sub-h1">
									Edit and submit your activity so others start enjoying it.
								</p>
							</div>
							<Form onSubmit={handleSubmit}>
								<Form.Group>
									<Form.Label>Title</Form.Label>
									<Form.Control
										type="text"
										name="title"
										placeholder="Activity title"
										defaultValue={title}
										onChange={handleChange}
									/>
								</Form.Group>
								<Form.Group>
									<Form.Label>Subtitle</Form.Label>
									<Form.Control
										type="text"
										name="subtitle"
										placeholder="Activity subtitle"
										defaultValue={subtitle}
										onChange={handleChange}
									/>
								</Form.Group>
								<Form.Row>
									<Col lg={4}>
										<Form.Group>
											<Form.Label>Activity Category</Form.Label>
											<Form.Check
												type="checkbox"
												name="romantic"
												id="romantic"
												label="Romantic"
												onChange={handleCheckCategory}
												checked={isRomantic}
											/>
											<Form.Check
												type="checkbox"
												name="adventure"
												id="adventure"
												label="Adventure"
												onChange={handleCheckCategory}
												checked={isAdventure}
											/>

											<Form.Check
												type="checkbox"
												name="gastronomic"
												id="gastronomic"
												label="Gastronomic"
												onChange={handleCheckCategory}
												checked={isGastronomic}
											/>
											<Form.Check
												type="checkbox"
												name="cultural"
												id="cultural"
												label="Cultural"
												onChange={handleCheckCategory}
												checked={isCultural}
											/>
											<Form.Check
												type="checkbox"
												name="relax"
												id="relax"
												label="Relax"
												onChange={handleCheckCategory}
												checked={isRelax}
											/>
										</Form.Group>
									</Col>
									<Col lg={4}>
										<Form.Group>
											<Form.Label>Activity Season</Form.Label>
											<Form.Check
												type="checkbox"
												name="winter"
												id="winter"
												label="Winter"
												onChange={handleCheckSeason}
												checked={isWinter}
											/>
											<Form.Check
												type="checkbox"
												name="spring"
												id="spring"
												label="Spring"
												onChange={handleCheckSeason}
												checked={isSpring}
											/>
											<Form.Check
												type="checkbox"
												name="summer"
												id="summer"
												label="Summer"
												onChange={handleCheckSeason}
												checked={isSummer}
											/>
											<Form.Check
												type="checkbox"
												name="autumn"
												id="autumn"
												label="Autumn"
												onChange={handleCheckSeason}
												checked={isAutumn}
											/>
										</Form.Group>
									</Col>
									<Col lg={4}>
										<Form.Group>
											<Form.Group>
												<Form.Label>Activity Region</Form.Label>
												<Form.Check
													type="radio"
													id="barcelona"
													label="Barcelona"
													name="activitySeason"
													onChange={handleCheckRegion}
													checked={isBarcelona}
												/>
												<Form.Check
													type="radio"
													id="tarragona"
													label="Tarragona"
													name="activitySeason"
													onChange={handleCheckRegion}
													checked={isTarragona}
												/>
												<Form.Check
													type="radio"
													id="girona"
													label="Girona"
													name="activitySeason"
													onChange={handleCheckRegion}
													checked={isGirona}
												/>
												<Form.Check
													type="radio"
													id="lleida"
													label="Lleida"
													name="activitySeason"
													onChange={handleCheckRegion}
													checked={isLleida}
												/>
												<Form.Check
													type="radio"
													id="costaBrava"
													label="Costa Brava"
													name="activitySeason"
													onChange={handleCheckRegion}
													checked={isCostaBrava}
												/>
												<Form.Check
													type="radio"
													id="costaDaurada"
													label="Costa Daurada"
													name="activitySeason"
													onChange={handleCheckRegion}
													checked={isCostaDaurada}
												/>
												<Form.Check
													type="radio"
													id="pirineus"
													label="Pirineus"
													name="activitySeason"
													onChange={handleCheckRegion}
													checked={isPirineus}
												/>
											</Form.Group>
										</Form.Group>
									</Col>
								</Form.Row>
								<Form.Group>
									<Form.Label>Location</Form.Label>
									<Autocomplete
										className="location-control"
										apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`}
										style={{width: "100%"}}
										defaultValue={activity_full_address}
										onPlaceSelected={(activity) => {
											let activity_full_address,
												activity_locality,
												activity_province,
												activity_state,
												activity_country,
												activity_lat,
												activity_lng,
												activity_rating,
												activity_id,
												activity_opening_hours;

											activity_full_address = activity.formatted_address;
											activity.address_components.forEach((el) => {
												if (el.types[0] === "locality") {
													activity_locality = el.long_name;
												}
												if (el.types[0] === "administrative_area_level_2") {
													activity_province = el.long_name;
												}
												if (el.types[0] === "administrative_area_level_1") {
													activity_state = el.long_name;
												}
												if (el.types[0] === "country") {
													activity_country = el.long_name;
												}
											});

											if (activity.geometry.viewport) {
												if (activity.geometry.viewport.Za) {
													activity_lat = activity.geometry.viewport.Za.i;
												} else {
													activity_lat = activity.geometry.viewport.ab.i;
												}
												activity_lng = activity.geometry.viewport.Va.i;
											}

											activity_rating = activity.rating;
											activity_id = activity.place_id;

											if (activity.opening_hours) {
												activity_opening_hours =
													activity.opening_hours.weekday_text;
											}

											setState({
												...state,
												activity: {
													...state.activity,
													activity_full_address: activity_full_address,
													activity_locality: activity_locality,
													activity_province: activity_province,
													activity_state: activity_state,
													activity_country: activity_country,
													activity_lat: activity_lat,
													activity_lng: activity_lng,
													activity_rating: activity_rating,
													activity_id: activity_id,
													activity_opening_hours: activity_opening_hours,
												},
											});
										}}
										types={["establishment"]}
										placeholder={"Type the activity address"}
										fields={[
											"rating",
											"place_id",
											"opening_hours",
											"address_components",
											"formatted_address",
											"geometry",
										]}
									/>
								</Form.Group>
								<Form.Row>
									<Col lg={6}>
										<Form.Group>
											<Form.Label>Phone Number</Form.Label>
											<Form.Control
												type="tel"
												name="phone"
												placeholder="Phone number for contact details"
												onChange={handleChange}
												value={phone}
											/>
										</Form.Group>
									</Col>
									<Col lg={6}>
										<Form.Group>
											<Form.Label>Website</Form.Label>
											<Form.Control
												type="url"
												name="website"
												placeholder="Activity website"
												onChange={handleChange}
												value={website}
											/>
										</Form.Group>
									</Col>
								</Form.Row>
								<Form.Row>
									<Col lg={6}>
										<Form.Group>
											<Form.Label>Price (€)</Form.Label>
											<Form.Control
												type="number"
												name="price"
												placeholder="Activity price"
												onChange={handleChange}
												value={price}
											/>
										</Form.Group>
									</Col>
									<Col lg={6}>
										<Form.Group>
											<Form.Label>Duration (h)</Form.Label>
											<Form.Control
												type="number"
												name="duration"
												placeholder="Activity duration"
												onChange={handleChange}
												value={duration}
											/>
										</Form.Group>
									</Col>
								</Form.Row>
								<div className="images">
									<span>Activity Images</span>
									<Form.Row>
										<Col lg={2}>
											<Form.Group>
												<div className="image-drop-zone">
													<Form.Label>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="icon icon-tabler icon-tabler-photo"
															width="44"
															height="44"
															viewBox="0 0 24 24"
															strokeWidth="1.5"
															stroke="#2c3e50"
															fill="none"
															strokeLinecap="round"
															strokeLinejoin="round"
														>
															<path stroke="none" d="M0 0h24v24H0z" />
															<line x1="15" y1="8" x2="15.01" y2="8" />
															<rect x="4" y="4" width="16" height="16" rx="3" />
															<path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
															<path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
														</svg>
														<Form.Control
															type="file"
															onChange={handleFileUpload}
														/>
													</Form.Label>
												</div>
											</Form.Group>
										</Col>
										<Col lg={2}>
											<Form.Group>
												<div className="image-drop-zone">
													<Form.Label>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="icon icon-tabler icon-tabler-photo"
															width="44"
															height="44"
															viewBox="0 0 24 24"
															strokeWidth="1.5"
															stroke="#2c3e50"
															fill="none"
															strokeLinecap="round"
															strokeLinejoin="round"
														>
															<path stroke="none" d="M0 0h24v24H0z" />
															<line x1="15" y1="8" x2="15.01" y2="8" />
															<rect x="4" y="4" width="16" height="16" rx="3" />
															<path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
															<path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
														</svg>
														<Form.Control
															type="file"
															onChange={handleFileUpload}
														/>
													</Form.Label>
												</div>
											</Form.Group>
										</Col>
										<Col lg={2}>
											<Form.Group>
												<div className="image-drop-zone">
													<Form.Label>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="icon icon-tabler icon-tabler-photo"
															width="44"
															height="44"
															viewBox="0 0 24 24"
															strokeWidth="1.5"
															stroke="#2c3e50"
															fill="none"
															strokeLinecap="round"
															strokeLinejoin="round"
														>
															<path stroke="none" d="M0 0h24v24H0z" />
															<line x1="15" y1="8" x2="15.01" y2="8" />
															<rect x="4" y="4" width="16" height="16" rx="3" />
															<path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
															<path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
														</svg>
														<Form.Control
															type="file"
															onChange={handleFileUpload}
														/>
													</Form.Label>
												</div>
											</Form.Group>
										</Col>
										<Col lg={2}>
											<Form.Group>
												<div className="image-drop-zone">
													<Form.Label>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="icon icon-tabler icon-tabler-photo"
															width="44"
															height="44"
															viewBox="0 0 24 24"
															strokeWidth="1.5"
															stroke="#2c3e50"
															fill="none"
															strokeLinecap="round"
															strokeLinejoin="round"
														>
															<path stroke="none" d="M0 0h24v24H0z" />
															<line x1="15" y1="8" x2="15.01" y2="8" />
															<rect x="4" y="4" width="16" height="16" rx="3" />
															<path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
															<path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
														</svg>
														<Form.Control
															type="file"
															onChange={handleFileUpload}
														/>
													</Form.Label>
												</div>
											</Form.Group>
										</Col>
										<Col lg={2}>
											<Form.Group>
												<div className="image-drop-zone">
													<Form.Label>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="icon icon-tabler icon-tabler-photo"
															width="44"
															height="44"
															viewBox="0 0 24 24"
															strokeWidth="1.5"
															stroke="#2c3e50"
															fill="none"
															strokeLinecap="round"
															strokeLinejoin="round"
														>
															<path stroke="none" d="M0 0h24v24H0z" />
															<line x1="15" y1="8" x2="15.01" y2="8" />
															<rect x="4" y="4" width="16" height="16" rx="3" />
															<path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
															<path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
														</svg>
														<Form.Control
															type="file"
															onChange={handleFileUpload}
														/>
													</Form.Label>
												</div>
											</Form.Group>
										</Col>
									</Form.Row>
								</div>
								<Form.Group>
									<Form.Label>Description</Form.Label>
									<Form.Control
										as="textarea"
										rows="5"
										type="text"
										name="description"
										placeholder="Activity description"
										defaultValue={description}
										onChange={handleChange}
									/>
								</Form.Group>
							</Form>
						</Col>
					</Row>
				</Container>
				<div className="progress-bar-outter">
					<Container className="d-flex align-items-center">
						<div className="col left">{/* <span>Section 1 of 7 </span> */}</div>
						<div className="col center">
							{/* <div className="progress">
							<div
								className="progress-bar"
								role="progressbar"
								style={{width: "33%"}}
								aria-valuenow="25"
								aria-valuemin="0"
								aria-valuemax="100"
							></div>
						</div> */}
						</div>
						<div className="col right">
							<div className="buttons d-flex justify-space-between justify-content-end">
								<Button type="submit" variant="none" onClick={handleSubmit}>
									Save changes
								</Button>
							</div>
						</div>
					</Container>
				</div>
			</div>
		</>
	);
};

export default ActivityEditionForm;
