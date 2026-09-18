import { Fragment, useContext } from "react";
import Footer from "../components/global/Footer";
import NavigationBar from "../components/global/NavigationBar";
import GlobalMetas from "../components/head/GlobalMetas";
import BreadcrumbRichSnippet from "../components/richsnippets/BreadcrumbRichSnippet";
import UserContext from "../contexts/UserContext";
import ContentService from "../services/contentService";
import ListingHeader from "../components/headers/ListingHeader";
import SectionHeading from "../components/homepage/SectionHeading";
import TripCategoryBox from "../components/listings/TripCategoryBox";
import FeaturedTripHero from "../components/listings/FeaturedTripHero";
import ShareBarModal from "../components/social/ShareBarModal";
import AdSlot from "../components/ads/AdSlot";
import MobileAnchorAd from "../components/ads/MobileAnchorAd";
import {
	toFeaturedTripCard,
	toTripCategoryCard,
} from "../utils/listingProps";

/** Després de la primera fila d'escriptori (3 columnes) i de la tercera. */
const AD_POSITIONS = [3, 9];

const Trips = ({ tripCategories, featuredTripCategories }) => {
	const { user } = useContext(UserContext);

	// El destacat ja surt a dalt: repetir-lo a la graella era ensenyar dues
	// vegades el mateix viatge en una pantalla i mitja.
	const featuredSlugs = new Set(
		(featuredTripCategories || []).map((category) => category.slug)
	);
	const restOfCategories = (tripCategories || []).filter(
		(category) => !featuredSlugs.has(category.slug)
	);

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title="Viatges en parella"
				description="Viatges en parella arreu del món. Descobreix amb nosaltres països, cultures i experiències úniques arreu del planeta."
				url="https://escapadesenparella.cat/viatges"
				image="https://res.cloudinary.com/juligoodie/image/upload/v1632416196/getaways-guru/zpdiudqa0bk8sc3wfyue.jpg"
				canonical="https://escapadesenparella.cat/viatges"
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Viatges en parella"
				page2Url={`https://escapadesenparella.cat/viatges`}
			/>
			<div className="lists">
				<NavigationBar user={user} />
				<main>
					{/* Capçalera: la mateixa que la resta de llistats, perquè
					    la primera fila de destinacions quedi per sobre del
					    plec en un portàtil. */}
					<ListingHeader
						title={`<span class="text-secondary-500">Viatges</span> en parella`}
						subtitle="Descobreix el món amb nosaltres. T'expliquem els nostres viatges, aventures i consells a mesura que anem descobrint nous països."
						breadcrumbLevel1="Viatges en parella"
						actions={
							<ShareBarModal
								picture={null}
								title={"Viatges en parella"}
								rating={null}
								slug={`https://escapadesenparella.cat/viatges`}
								locality={null}
								colorClass={"text-primary-500 text-sm"}
							/>
						}
					/>

					{/* Viatge destacat */}
					{featuredTripCategories &&
					featuredTripCategories.length > 0 ? (
						<section className="pt-6 md:pt-8">
							<div className="container">
								<h2 className="sr-only">Viatge destacat</h2>
								<FeaturedTripHero
									categories={featuredTripCategories}
								/>
							</div>
						</section>
					) : null}

					{/* Totes les destinacions */}
					<section className="pt-10 md:pt-14 pb-12 lg:pb-20">
						<div className="container">
							<SectionHeading
								eyebrow="Destinacions"
								title="Tots els viatges"
								description={`${
									tripCategories ? tripCategories.length : 0
								} països i regions explicats dia a dia, amb el que ens va agradar més i el que no us podeu perdre.`}
							/>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 md:mt-8">
								{restOfCategories.map((tripCategory, idx) => (
									<Fragment
										key={
											tripCategory._id ||
											tripCategory.slug
										}
									>
										<TripCategoryBox
											image={tripCategory.image}
											title={tripCategory.title}
											subtitle={
												tripCategory.seoTextHeader
											}
											slug={tripCategory.slug}
											country={tripCategory.country}
											priority={idx < 3 ? "eager" : "lazy"}
										/>
										{AD_POSITIONS.includes(idx + 1) ? (
											<AdSlot
												placement="inFeed"
												containerClassName="h-full rounded-2xl bg-gray-50 p-3"
											/>
										) : null}
									</Fragment>
								))}
							</div>
						</div>
					</section>
				</main>
			</div>
			<Footer />
			<MobileAnchorAd />
		</>
	);
};

export async function getServerSideProps() {
	const service = new ContentService();
	const [tripCategories, featuredTripCategories] = await Promise.all([
		service.getTripCategories(),
		service.getFeaturedTripCategories(),
	]);

	// L'API torna el document sencer de cada categoria —carrusel, relat,
	// iframe del mapa i tot el text de SEO—, i Next ho incrusta a l'HTML com a
	// JSON encara que la pàgina només en pinti la portada i l'entradeta.
	return {
		props: {
			tripCategories: (tripCategories || []).map(toTripCategoryCard),
			featuredTripCategories: (featuredTripCategories || []).map(
				toFeaturedTripCard
			),
		},
	};
}

export default Trips;
