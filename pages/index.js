import ContentService from "../services/contentService";
import GlobalMetas from "../components/head/GlobalMetas";
import NavigationBar from "../components/global/NavigationBar";
import HomeHeader from "../components/headers/HomeHeader";
import HomePageResults from "../components/homepage/HomePageResults";
import Footer from "../components/global/Footer";
import LocalBusinessRichSnippet from "../components/richsnippets/LocalBusinessRichSnippet";

const Homepage = (props) => {
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
			<LocalBusinessRichSnippet />
			<main id="homepage">
				<NavigationBar />
				<HomeHeader totals={props.totals} />
				<HomePageResults
					categories={props.categories}
					featuredRegions={props.featuredRegions}
					featuredActivities={props.featuredActivities}
					mostRecentPlaces={props.mostRecentPlaces}
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
	const mostRecentPlaces = await service.getMostRecentPlaces();
	const mostRecentStories = await service.getMostRecentStories();
	const categories = await service.getCategories();
	const totals = await service.getSiteStats();

	console.log(featuredActivities.length)

	return {
		props: {
			categories,
			featuredRegions,
			featuredActivities,
			mostRecentPlaces,
			mostRecentStories,
			totals,
		},
		revalidate: 120,
	};
}

export default Homepage;
