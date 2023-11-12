import { useEffect, useState } from "react";
import NavigationBar from "../components/global/NavigationBar";
import ContentService from "../services/contentService";
import PublicContentBox from "../components/listings/PublicContentBox";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import FetchingSpinner from "../components/global/FetchingSpinner";
import PublicSquareBox from "../components/listings/PublicSquareBox";

const Search = (props) => {
	const router = useRouter();
	const searchQuery = router.asPath.slice(7);
	const initialState = {
		loggedUser: props.user,
		searchQuery: searchQuery,
		isFetching: false,
		hasResults: false,
		searchResults: [],
		activitiesFound: [],
		placesFound: [],
		updatedSearch: false,
	};
	const [state, setState] = useState(initialState);
	const service = new ContentService();

	useEffect(() => {
		const fetchData = async () => {
			setState({ ...state, isFetching: true });
			const searchQueryResults = await service.searchBarQuery(
				state.searchQuery
			);
			if (searchQueryResults instanceof Array) {
				let hasResults;
				searchQueryResults.length > 0
					? (hasResults = true)
					: (hasResults = false);
				setState({
					...state,
					isFetching: false,
					hasResults: hasResults,
					searchResults: searchQueryResults,
				});
			} else if (searchQueryResults instanceof Object) {
				let hasResults;
				searchQueryResults.places.length > 0 ||
				searchQueryResults.activities.length > 0
					? (hasResults = true)
					: (hasResults = false);
				setState({
					...state,
					isFetching: false,
					hasResults: hasResults,
					activitiesFound: searchQueryResults.activities,
					placesFound: searchQueryResults.places,
				});
			}
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const searchQuery = router.asPath.slice(7);
		if (state.searchQuery !== searchQuery) {
			const fetchData = async () => {
				const searchQueryResults = await service.searchBarQuery(
					searchQuery
				);
				let hasResults;
				searchQueryResults.places.length > 0 ||
				searchQueryResults.activities.length > 0
					? (hasResults = true)
					: (hasResults = false);
				setState({
					...state,
					isFetching: false,
					hasResults: hasResults,
					activitiesFound: searchQueryResults.activities,
					placesFound: searchQueryResults.places,
				});
			};
			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.searchQuery, router]);

	if (state.isFetching) {
		return <FetchingSpinner />;
	}

	let searchResultsList;
	let searchResultsLength;

	if (state.searchResults.length > 0) {
		searchResultsLength = state.searchResults.length;
	} else {
		searchResultsLength =
			state.activitiesFound.length + state.placesFound.length;
	}

	let browsedText = router.query ? router.query.query : null;

	if (state.activitiesFound.length > 0 || state.placesFound.length > 0) {
		let searchResults = [];
		state.activitiesFound.map((el) => searchResults.push(el));
		state.placesFound.map((el) => searchResults.push(el));
		searchResultsList = searchResults.map((el) => {
			let location;
			if (el.type === "activity") {
				location =
					el.activity_locality === undefined
						? el.activity_country
						: el.activity_locality;
			} else {
				location =
					el.place_locality === undefined
						? el.place_country
						: el.place_locality;
			}

			return (
				<PublicSquareBox
					key={el._id}
					type={el.type}
					slug={el.slug}
					id={el._id}
					cover={el.cover}
					title={el.title}
					subtitle={el.subtitle}
					rating={el.activity_rating || el.place_rating}
					placeType={el.placeType}
					categoria={el.categories}
					duration={el.duration}
					website={el.website}
					phone={el.phone}
					isVerified={el.isVerified}
					location={location}
				/>
			);
		});
	} else {
		if (
			searchResultsLength === 0 &&
			state.activitiesFound.length === 0 &&
			state.placesFound.length === 0
		) {
			searchResultsList = (
				<div className="box empty d-flex">
					<div className="media">
						<img
							src="../../empty-search-results.svg"
							alt="Graphic no results"
						/>
					</div>
					<div className="text">
						<p>
							<b>
								Vaja, no hem pogut trobar resultats per la teva
								cerca {browsedText}
							</b>{" "}
							😞
							<br />
							Cerca de nou per obtenir altres resultats
						</p>
						<Link href={"/"}>
							<a className="btn btn-m btn-dark text-center">
								Cercar de nou
							</a>
						</Link>
					</div>
				</div>
			);
		} else {
			searchResultsList = state.searchResults.map((el) => {
				let location;
				if (el.type === "activity") {
					location =
						el.activity_locality === undefined
							? el.activity_country
							: el.activity_locality;
				} else {
					location =
						el.place_locality === undefined
							? el.place_country
							: el.place_locality;
				}

				return (
					<PublicSquareBox
						key={el._id}
						type={el.type}
						slug={el.slug}
						id={el._id}
						cover={el.cover}
						title={el.title}
						subtitle={el.subtitle}
						rating={el.activity_rating || el.place_rating}
						placeType={el.placeType}
						categoria={el.categories}
						duration={el.duration}
						website={el.website}
						phone={el.phone}
						isVerified={el.isVerified}
						location={location}
					/>
				);
			});
		}
	}

	return (
		<>
			<Head>
				<title>
					{browsedText} - Resultats de cerca | Escapadesenparella.cat
				</title>
			</Head>
			<div id="searchPage">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
					user={props.user}
				/>
				<main>
					<div className="pt-6">
						<div className="container">
							<ul className="breadcrumb">
								<li className="breadcrumb__item">
									<a
										href="/"
										title="Inici"
										className="breadcrumb__link"
									>
										Inici
									</a>
								</li>
								<li className="breadcrumb__item">
									<span className="breadcrumb__link active">
										Resultats de cerca
									</span>
								</li>
							</ul>
						</div>
					</div>
					<section className="pt-6 pb-12">
						<div className="container">
							<div className="border-b border-primary-50">
								<h1 className="text-2xl md:text-3xl ">
									Resultats de cerca
								</h1>
								<p className="mt-2">
									Hem trobat{" "}
									<span>{searchResultsLength} resultats</span>{" "}
									en base a la teva cerca{" "}
									<b>"{browsedText}"</b>:
								</p>
							</div>
							<div className="flex flex-wrap items-start mt-3 -mx-1.5">
								{searchResultsList}
							</div>
						</div>
					</section>
				</main>
			</div>
		</>
	);
};

export default Search;
