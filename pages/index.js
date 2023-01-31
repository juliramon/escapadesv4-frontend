import Head from "next/head";
import ContentService from "../services/contentService";
import { useEffect, useContext } from "react";
import Hero from "../components/homepage/Hero";
import NavigationBar from "../components/global/NavigationBar";
import Footer from "../components/global/Footer";
import HomePageResults from "../components/homepage/HomePageResults";
import { useRouter } from "next/router";
import UserContext from "../contexts/UserContext";
import FollowBox from "../components/global/FollowBox";
import LocalBusiness from "../components/richsnippets/LocalBusiness";
import GlobalMetas from "../components/head/GlobalMetas";

const Homepage = (props) => {
	const { user } = useContext(UserContext);
	const router = useRouter();

	useEffect(() => {
		if (user) {
			router.push("/feed");
		}
	}, [user]);

	if (user) {
		return (
			<Head>
				<title>Carregant...</title>
			</Head>
		);
	}

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title="Escapades en parella a Catalunya, descobreix les millors!"
				description="Troba les millors escapades en parella a Catalunya. Escapades en parella verificades, amb valoracions i recomanacions. Si busques escapar-te en parella, fes clic aquí, t'esperem a Escapadesenparella.cat!"
				url="https://escapadesenparella.cat"
				image="https://res.cloudinary.com/juligoodie/image/upload/v1652527292/getaways-guru/IMGP9489-s_izgty6.jpg"
				canonical="https://escapadesenparella.cat"
			/>
			{/* Rich snippets */}
			<LocalBusiness />
			<main id="homepage">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
				/>
				<Hero />
				<HomePageResults
					featuredRegions={props.featuredRegions}
					featuredActivities={props.featuredActivities}
					featuredList={props.featuredList}
					mostRatedPlaces={props.mostRatedPlaces}
					mostRecentStories={props.mostRecentStories}
					featuredRomanticGetaways={props.featuredRomanticGetaways}
					featuredAdventureGetaways={props.featuredAdventureGetaways}
					featuredGastronomicGetaways={props.featuredGastronomicGetaways}
					featuredRelaxGetaways={props.featuredRelaxGetaways}
					totals={props.totals}
				/>
				<Footer
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
				/>
				<FollowBox />
			</main>
		</>
	);
};

export async function getServerSideProps({ params }) {
	const service = new ContentService();
	const featuredRegions = await service.getFeaturedRegions();
	const featuredActivities = await service.getFeaturedActivities();
	const mostRatedPlaces = await service.getMostRatedPlaces();
	const mostRecentStories = await service.getMostRecentStories();
	const featuredRomanticGetaways = await service.getFeaturedGetawaysByCategory(
		"romantica"
	);
	const featuredAdventureGetaways = await service.getFeaturedGetawaysByCategory(
		"aventura"
	);
	const featuredGastronomicGetaways =
		await service.getFeaturedGetawaysByCategory("gastronomica");
	const featuredRelaxGetaways = await service.getFeaturedGetawaysByCategory(
		"relax"
	);
	const featuredList = await service.getFeaturedList();
	const totals = await service.getCategoriesTotals();

	return {
		props: {
			featuredRegions,
			featuredActivities,
			mostRatedPlaces,
			mostRecentStories,
			featuredRomanticGetaways,
			featuredAdventureGetaways,
			featuredGastronomicGetaways,
			featuredRelaxGetaways,
			featuredList,
			totals,
		},
	};
}

export default Homepage;
