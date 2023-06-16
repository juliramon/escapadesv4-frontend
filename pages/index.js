import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import ContentService from "../services/contentService";
import UserContext from "../contexts/UserContext";
import LocalBusiness from "../components/richsnippets/LocalBusiness";
import GlobalMetas from "../components/head/GlobalMetas";
import NavigationBar from "../components/global/NavigationBar";
import HomeHeader from "../components/headers/HomeHeader";
import HomePageResults from "../components/homepage/HomePageResults";
import Footer from "../components/global/Footer";

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
				preload={"bg-geo.webp"}
			/>
			{/* Rich snippets */}
			<LocalBusiness />
			<main id="homepage">
				<NavigationBar />
				<HomeHeader totals={props.totals} />
				<HomePageResults
					categories={props.categories}
					featuredRegions={props.featuredRegions}
					featuredActivities={props.featuredActivities}
					featuredList={props.featuredList}
					mostRatedPlaces={props.mostRatedPlaces}
					featuredRomanticGetaways={props.featuredRomanticGetaways}
					featuredAdventureGetaways={props.featuredAdventureGetaways}
					featuredGastronomicGetaways={
						props.featuredGastronomicGetaways
					}
					mostRecentStories={props.mostRecentStories}
				/>
				<Footer />
			</main>
		</>
	);
};

export async function getStaticProps() {
	const service = new ContentService();
	const featuredRegions = await service.getFeaturedRegions();
	const featuredActivities = await service.getFeaturedActivities();
	const mostRatedPlaces = await service.getMostRatedPlaces();
	const mostRecentStories = await service.getMostRecentStories();
	const featuredRomanticGetaways =
		await service.getFeaturedGetawaysByCategory("romantica");
	const featuredAdventureGetaways =
		await service.getFeaturedGetawaysByCategory("aventura");
	const featuredGastronomicGetaways =
		await service.getFeaturedGetawaysByCategory("gastronomica");

	const featuredList = await service.getFeaturedList();
	const categories = await service.getCategories();
	const totals = await service.getSiteStats();

	return {
		props: {
			categories,
			featuredRegions,
			featuredActivities,
			mostRatedPlaces,
			mostRecentStories,
			featuredRomanticGetaways,
			featuredAdventureGetaways,
			featuredGastronomicGetaways,
			featuredList,
			totals,
		},
		revalidate: 120,
	};
}

export default Homepage;
