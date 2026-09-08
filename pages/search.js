import { useEffect, useState } from "react";
import NavigationBar from "../components/global/NavigationBar";
import ContentService from "../services/contentService";
import { useRouter } from "next/router";
import Head from "next/head";
import FetchingSpinner from "../components/global/FetchingSpinner";
import ListingGrid from "../components/listings/ListingGrid";
import TaxonomyChips from "../components/listings/TaxonomyChips";
import Footer from "../components/global/Footer";
import MobileAnchorAd from "../components/ads/MobileAnchorAd";
import {
	DESTINATIONS,
	GETAWAY_CATEGORIES,
	STAY_CATEGORIES,
} from "../utils/siteTaxonomy";

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

	// Segons l'endpoint, els resultats arriben com a llista plana o separats
	// per tipus. Els unifiquem en un sol array per poder-los pintar amb la
	// mateixa graella que la resta de llistats.
	const results =
		state.activitiesFound.length > 0 || state.placesFound.length > 0
			? [...state.activitiesFound, ...state.placesFound]
			: state.searchResults;

	const searchResultsLength = results.length;
	const browsedText = router.query ? router.query.query : null;

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
							<div className="border-b border-primary-50 pb-6">
								<h1 className="my-0">Resultats de cerca</h1>
								<p className="mt-3 mb-0 text-block text-grey-400">
									{searchResultsLength > 0 ? (
										<>
											Hem trobat{" "}
											<strong className="text-grey-700">
												{searchResultsLength}{" "}
												{searchResultsLength === 1
													? "resultat"
													: "resultats"}
											</strong>{" "}
											per a <b>&laquo;{browsedText}&raquo;</b>
										</>
									) : (
										<>
											No hem trobat cap resultat per a{" "}
											<b>&laquo;{browsedText}&raquo;</b>
										</>
									)}
								</p>
							</div>

							{searchResultsLength > 0 ? (
								<ListingGrid
									items={results}
									eagerCount={4}
									className="mt-8"
								/>
							) : (
								<div className="mt-8 max-w-3xl">
									<p className="text-block text-grey-400">
										Proveu amb un altre terme, o entreu per
										una d&apos;aquestes portes:
									</p>
									<TaxonomyChips
										heading="Per tipus d'escapada"
										items={GETAWAY_CATEGORIES}
										className="mt-6"
									/>
									<TaxonomyChips
										heading="Per tipus d'allotjament"
										items={STAY_CATEGORIES}
										className="mt-6"
									/>
									<TaxonomyChips
										heading="Per destinació"
										items={DESTINATIONS}
										prefix="/destinacions/"
										className="mt-6"
									/>
								</div>
							)}
						</div>
					</section>
				</main>
				<Footer />
			</div>
			<MobileAnchorAd />
		</>
	);
};

export default Search;
