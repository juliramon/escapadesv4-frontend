import ContentService from "../services/contentService";
import GlobalMetas from "../components/head/GlobalMetas";
import NavigationBar from "../components/global/NavigationBar";
import HomeHeader from "../components/headers/HomeHeader";
import HomePageResults from "../components/homepage/HomePageResults";
import Footer from "../components/global/Footer";
import LocalBusinessRichSnippet from "../components/richsnippets/LocalBusinessRichSnippet";
import { getPicturesBySeason } from "../utils/helpers";

const Homepage = (props) => {
	const firstSlidePictures = {
		spring: {
			picture_webp: "/home-cover-primavera.webp",
			picture_raw: "/home-cover-primavera.jpg",
			picture_webp_mob: "/home-cover-primavera-m.webp",
			picture_raw_mob: "/home-cover-primavera-m.jpg",
		},
		summer: {
			picture_webp: "/home-cover-estiu.webp",
			picture_raw: "/home-cover-estiu.jpg",
			picture_webp_mob: "/home-cover-estiu-m.webp",
			picture_raw_mob: "/home-cover-estiu-m.jpg",
		},
		autumn: {
			picture_webp: "/home-cover-tardor.webp",
			picture_raw: "/home-cover-tardor.jpg",
			picture_webp_mob: "/home-cover-tardor-m.webp",
			picture_raw_mob: "/home-cover-tardor-m.jpg",
		},
		winter: {
			picture_webp: "/home-cover-hivern.webp",
			picture_raw: "/home-cover-hivern.jpg",
			picture_webp_mob: "/home-cover-hivern-m.webp",
			picture_raw_mob: "/home-cover-hivern-m.jpg",
		},
	};

	const currentDate = new Date();
	const slideImage = getPicturesBySeason(currentDate, firstSlidePictures);

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title="Escapades originals a Catalunya"
				description="Escapades en parella per gaudir i desconnectar. Experiències i allotjaments verificats i originals, pensats per a una escapada en parella per recordar."
				url="https://escapadesenparella.cat"
				image={slideImage.picture_raw}
				canonical="https://escapadesenparella.cat"
			/>
			{/* Rich snippets */}
			<LocalBusinessRichSnippet />
			<main id="homepage">
				<NavigationBar />
				<HomeHeader slideImage={slideImage} />
				<HomePageResults
					featuredCategories={props.featuredCategories}
					mostRecentPlaces={props.mostRecentPlaces}
					featuredActivities={props.featuredActivities}
					featuredDestinations={props.featuredDestinations}
					mostRecentStories={props.mostRecentStories}
				/>
				<Footer />
			</main>
		</>
	);
};

export async function getStaticProps() {
	const service = new ContentService();
	const mostRecentPlaces = await service.getMostRecentPlaces();
	const featuredActivities = await service.getFeaturedActivities();
	const featuredDestinations = await service.getFeaturedDestinations();
	const mostRecentStories = await service.getMostRecentStories();
	const featuredCategories = await service.getFeaturedCategories();
	const totals = await service.getSiteStats();

	return {
		props: {
			featuredDestinations,
			featuredActivities,
			mostRecentPlaces,
			mostRecentStories,
			featuredCategories,
			totals,
		},
		revalidate: 120,
	};
}

export default Homepage;
