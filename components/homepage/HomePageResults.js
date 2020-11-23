import {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import PublicSquareBox from "../../components/listings/PublicSquareBox";

const HomePageResults = ({activities, places}) => {
	const initialState = {
		isFetching: false,
		romanticGetaways: [],
		popularRegions: [],
		adventureGetaways: [],
		mostRatedGetaways: [],
		gastronomicGetaways: [],
	};
	const [state, setState] = useState(initialState);

	useEffect(() => {
		if (activities.length > 0 || places.length > 0) {
			let getaways = [];
			if (activities.length > 0) {
				activities.forEach((el) => getaways.push(el));
			}
			if (places.length > 0) {
				places.forEach((el) => getaways.push(el));
			}
			let hasGetaways;
			getaways.length > 0 ? (hasGetaways = true) : (hasGetaways = false);
			if (hasGetaways) {
				let romanticGetaways = [];
				let adventureGetaways = [];
				let gastronomicGetaways = [];
				let mostRatedGetaways = [];
				getaways.forEach((el) => {
					if (el.categories.includes("adventure")) {
						adventureGetaways.push(el);
					}
					if (el.categories.includes("romantic")) {
						romanticGetaways.push(el);
					}
					if (el.categories.includes("gastronomic")) {
						gastronomicGetaways.push(el);
					}
					if (el.activity_rating > 4 || el.place_rating > 4) {
						mostRatedGetaways.push(el);
					}
				});
				setState({
					...state,
					romanticGetaways: romanticGetaways,
					adventureGetaways: adventureGetaways,
					gastronomicGetaways: gastronomicGetaways,
					mostRatedGetaways: mostRatedGetaways,
					isFetching: hasGetaways,
				});
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	let romanticGetawaysSection,
		adventureGetawaysSection,
		gastronomicGetawaysSection;
	if (state.romanticGetaways.length > 0) {
		let romanticList = state.romanticGetaways.map((el, idx) => {
			while (state.romanticGetaways.indexOf(el) < 4) {
				let location;
				if (el.type === "activity") {
					location = (
						<span className="listing-location">{`${
							el.activity_locality === undefined ? "" : el.activity_locality
						}${el.activity_locality === undefined ? "" : ","} ${
							el.activity_province || el.activity_state
						}, ${el.activity_country}`}</span>
					);
				}
				if (el.type === "place") {
					location = (
						<span className="listing-location">{`${
							el.place_locality === undefined ? "" : el.place_locality
						}${el.place_locality === undefined ? "" : ","} ${
							el.place_province || el.place_state
						}, ${el.place_country}`}</span>
					);
				}
				return (
					<PublicSquareBox
						key={el._id}
						id={el._id}
						type={el.type}
						cover_url={el.images[0]}
						title={el.title}
						subtitle={el.subtitle}
						rating={el.activity_rating || el.place_rating}
						location={location}
					/>
				);
			}
			return undefined;
		});
		romanticGetawaysSection = (
			<section className="homepage-section">
				<h2 className="homepage-section-title">Best romantic getaways</h2>
				<div className="section-listings">
					<div className="section-listings-wrapper">{romanticList}</div>
				</div>
			</section>
		);
	}
	if (state.adventureGetaways.length > 0) {
		let adventureList = state.adventureGetaways.map((el) => {
			while (state.adventureGetaways.indexOf(el) < 4) {
				let location;
				if (el.type === "activity") {
					location = (
						<span className="listing-location">{`${
							el.activity_locality === undefined ? "" : el.activity_locality
						}${el.activity_locality === undefined ? "" : ","} ${
							el.activity_province || el.activity_state
						}, ${el.activity_country}`}</span>
					);
				}
				if (el.type === "place") {
					location = (
						<span className="listing-location">{`${
							el.place_locality === undefined ? "" : el.place_locality
						}${el.place_locality === undefined ? "" : ","} ${
							el.place_province || el.place_state
						}, ${el.place_country}`}</span>
					);
				}
				return (
					<PublicSquareBox
						key={el._id}
						id={el._id}
						type={el.type}
						cover_url={el.images[0]}
						title={el.title}
						subtitle={el.subtitle}
						rating={el.activity_rating || el.place_rating}
						location={location}
					/>
				);
			}
			return undefined;
		});
		adventureGetawaysSection = (
			<section className="homepage-section">
				<h2 className="homepage-section-title">Adventure is calling</h2>
				<div className="section-listings">
					<div className="section-listings-wrapper">{adventureList}</div>
				</div>
			</section>
		);
	}
	if (state.gastronomicGetaways.length > 0) {
		let gastronomicList = state.gastronomicGetaways.map((el) => {
			while (state.gastronomicGetaways.indexOf(el) < 4) {
				let location;
				if (el.type === "activity") {
					location = (
						<span className="listing-location">{`${
							el.activity_locality === undefined ? "" : el.activity_locality
						}${el.activity_locality === undefined ? "" : ","} ${
							el.activity_province || el.activity_state
						}, ${el.activity_country}`}</span>
					);
				}
				if (el.type === "place") {
					location = (
						<span className="listing-location">{`${
							el.place_locality === undefined ? "" : el.place_locality
						}${el.place_locality === undefined ? "" : ","} ${
							el.place_province || el.place_state
						}, ${el.place_country}`}</span>
					);
				}
				return (
					<PublicSquareBox
						key={el._id}
						id={el._id}
						type={el.type}
						cover_url={el.images[0]}
						title={el.title}
						subtitle={el.subtitle}
						rating={el.activity_rating || el.place_rating}
						location={location}
					/>
				);
			}
			return undefined;
		});
		gastronomicGetawaysSection = (
			<section className="homepage-section">
				<h2 className="homepage-section-title">Best gastronomic getaways</h2>
				<div className="section-listings">
					<div className="section-listings-wrapper">{gastronomicList}</div>
				</div>
			</section>
		);
	}
	return (
		<div id="homePageResults">
			<Container className="mw-1200">
				<Row>
					<Col lg={12}>
						{romanticGetawaysSection}
						{adventureGetawaysSection}
						{gastronomicGetawaysSection}
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default HomePageResults;
