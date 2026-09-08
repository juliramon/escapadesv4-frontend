import ContentService from "../services/contentService";
import GlobalMetas from "../components/head/GlobalMetas";
import NavigationBar from "../components/global/NavigationBar";
import HomeHeader from "../components/headers/HomeHeader";
import HomePageResults from "../components/homepage/HomePageResults";
import Footer from "../components/global/Footer";
import MobileAnchorAd from "../components/ads/MobileAnchorAd";
import LocalBusinessRichSnippet from "../components/richsnippets/LocalBusinessRichSnippet";
import { getPicturesBySeason } from "../utils/helpers";
import { pickFields, toEditorialCard, toListingCard } from "../utils/listingProps";

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
				<HomeHeader slideImage={slideImage} totals={props.totals} />
				<HomePageResults
					categories={props.categories}
					mostRecentPlaces={props.mostRecentPlaces}
					featuredActivities={props.featuredActivities}
					featuredDestinations={props.featuredDestinations}
					mostRecentStories={props.mostRecentStories}
					featuredLists={props.featuredLists}
					totals={props.totals}
				/>
				<Footer />
				<MobileAnchorAd />
			</main>
		</>
	);
};

/**
 * Cada crida va per separat: si un endpoint cau, la portada segueix
 * construint-se amb la resta de blocs en comptes de trencar la generació
 * estàtica sencera.
 */
const safeFetch = async (request, fallback) => {
	try {
		const data = await request();
		return data ?? fallback;
	} catch (error) {
		console.error("[homepage] no s'ha pogut carregar un bloc:", error.message);
		return fallback;
	}
};

export async function getStaticProps() {
	const service = new ContentService();

	const [
		mostRecentPlaces,
		featuredActivities,
		destinations,
		mostRecentStories,
		categories,
		lists,
		totals,
	] = await Promise.all([
		safeFetch(() => service.getMostRecentPlaces(), []),
		safeFetch(() => service.getFeaturedActivities(), []),
		safeFetch(() => service.getDestinations(), []),
		safeFetch(() => service.getMostRecentStories(), []),
		safeFetch(() => service.getCategories(), []),
		safeFetch(() => service.getAllLists(), []),
		safeFetch(() => service.getSiteStats(), {}),
	]);

	// Les destacades primer, però ensenyant-les totes: només una de les sis
	// destinacions està marcada com a destacada i el carril quedava buit.
	const featuredDestinations = [...destinations]
		.sort(
			(a, b) =>
				Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured))
		)
		.map((destination) =>
			pickFields(destination, ["slug", "title", "subtitle", "image"])
		);

	return {
		props: {
			featuredDestinations,
			featuredActivities: featuredActivities.map((item) =>
				toListingCard(item)
			),
			mostRecentPlaces: mostRecentPlaces.map((item) =>
				toListingCard(item)
			),
			mostRecentStories: mostRecentStories
				.slice(0, 3)
				.map((item) => toEditorialCard(item)),
			featuredLists: lists
				.slice(0, 3)
				.map((item) => toEditorialCard(item)),
			categories: categories.map((category) =>
				pickFields(category, ["slug", "title", "image"])
			),
			totals,
		},
		revalidate: 120,
	};
}

export default Homepage;
