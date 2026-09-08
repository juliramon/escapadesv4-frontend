import Link from "next/link";
import AdSlot from "../ads/AdSlot";
import EditorialCard from "../listings/EditorialCard";
import ListingGrid from "../listings/ListingGrid";
import CategoryRail from "./CategoryRail";
import DestinationRail from "./DestinationRail";
import SectionHeading from "./SectionHeading";
import VerticalTiles from "./VerticalTiles";
import { GETAWAY_CATEGORIES, STAY_CATEGORIES } from "../../utils/siteTaxonomy";

/**
 * Uneix la taxonomia estàtica (ordre i etiquetes curtes) amb les dades de
 * l'API (imatges i títols llargs). Si una categoria encara no existeix a
 * l'API, es descarta en comptes de pintar un forat.
 */
const withCategoryImages = (taxonomy, apiCategories = []) =>
	taxonomy
		.map((entry) => {
			const match = apiCategories.find(
				(category) => category.slug === entry.slug
			);
			if (!match) return null;
			return { ...entry, image: match.image, title: match.title };
		})
		.filter(Boolean);

const HomePageResults = ({
	categories = [],
	featuredDestinations = [],
	featuredActivities = [],
	mostRecentPlaces = [],
	mostRecentStories = [],
	featuredLists = [],
	totals = {},
}) => {
	const getawayCategories = withCategoryImages(GETAWAY_CATEGORIES, categories);
	const stayCategories = withCategoryImages(STAY_CATEGORIES, categories);

	const date = new Date();
	const foundationYears = date.getFullYear() - 2015;

	return (
		<div id="homePageResults" className="relative z-30">
			{/* Accés directe per categories */}
			<section className="pt-10 md:pt-14 lg:pt-16">
				<div className="container">
					<SectionHeading
						eyebrow="Per on comencem?"
						title="Escapades per tipus de pla"
						description="Trieu el pla i us ensenyem les experiències i els allotjaments que hi encaixen."
					/>
					<div className="mt-6 md:mt-8">
						<CategoryRail categories={getawayCategories} />
					</div>

					<div className="mt-10 md:mt-12">
						<SectionHeading
							title="On voleu dormir?"
							titleTag="h3"
							href="/allotjaments"
							linkLabel="Veure tots els allotjaments"
						/>
						<div className="mt-5 md:mt-6">
							<CategoryRail categories={stayCategories} />
						</div>
					</div>
				</div>
			</section>

			{/* Allotjaments amb encant */}
			<section className="pt-12 md:pt-16 lg:pt-20">
				<div className="container">
					<SectionHeading
						eyebrow="Allotjaments"
						title="Allotjaments amb encant per a dos"
						description="Hotels petits, cases rurals, cabanyes als arbres i refugis triats un a un."
						href="/allotjaments"
						linkLabel="Veure tots els allotjaments"
					/>
					<div className="mt-6 md:mt-8">
						<ListingGrid
							items={mostRecentPlaces}
							adPositions={[4]}
							eagerCount={4}
						/>
					</div>
				</div>
			</section>

			{/* Experiències */}
			<section className="pt-12 md:pt-16 lg:pt-20">
				<div className="container">
					<SectionHeading
						eyebrow="Experiències"
						title="Experiències per fer en parella"
						description="Activitats, rutes i plans per omplir el cap de setmana d'alguna cosa més que carretera."
						href="/activitats"
						linkLabel="Veure totes les experiències"
					/>
					<div className="mt-6 md:mt-8">
						<ListingGrid
							items={featuredActivities}
							showAds={false}
							eagerCount={0}
						/>
					</div>
				</div>
			</section>

			{/* Bloc publicitari entre seccions */}
			<section className="pt-12 md:pt-16">
				<div className="container">
					<AdSlot
						placement="leaderboard"
						containerClassName="rounded-2xl bg-gray-50 p-4 md:p-6 text-center"
					/>
				</div>
			</section>

			{/* Destinacions */}
			<section className="pt-12 md:pt-16 lg:pt-20">
				<div className="container">
					<SectionHeading
						eyebrow="Destinacions"
						title="Escapades per Catalunya, zona a zona"
						description="Trieu una zona i us hi ensenyem on dormir, què fer i què val la pena veure."
						href="/destinacions"
						linkLabel="Veure totes les destinacions"
					/>
					<div className="mt-6 md:mt-8">
						<DestinationRail destinations={featuredDestinations} />
					</div>
				</div>
			</section>

			{/* Verticals del web */}
			<section className="pt-12 md:pt-16 lg:pt-20">
				<div className="container">
					<SectionHeading
						eyebrow="Tot el que hi trobareu"
						title="Sis maneres de preparar la propera escapada"
					/>
					<div className="mt-6 md:mt-8">
						<VerticalTiles totals={totals} />
					</div>
				</div>
			</section>

			{/* Contingut editorial: històries i llistes */}
			<section className="pt-12 md:pt-16 lg:pt-20">
				<div className="container">
					<SectionHeading
						eyebrow="Històries"
						title="Escapades que hem fet nosaltres"
						description="Les explicem de primera mà, amb el que va funcionar i el que no."
						href="/histories"
						linkLabel="Veure totes les històries"
					/>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 md:mt-8">
						{mostRecentStories.slice(0, 3).map((story, index) => (
							<EditorialCard
								key={story._id}
								href={`/histories/${story.slug}`}
								cover={story.cover}
								title={story.title}
								subtitle={story.subtitle}
								date={story.createdAt}
								badge="Història"
								index={index}
							/>
						))}
					</div>
				</div>
			</section>

			{featuredLists.length ? (
				<section className="pt-12 md:pt-16 lg:pt-20">
					<div className="container">
						<SectionHeading
							eyebrow="Llistes"
							title="Idees ja triades, per decidir ràpid"
							description="Seleccions temàtiques per quan sabeu que voleu sortir però no on."
							href="/llistes"
							linkLabel="Veure totes les llistes"
						/>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6 md:mt-8">
							{featuredLists.slice(0, 3).map((list, index) => (
								<EditorialCard
									key={list._id}
									href={`/llistes/${list.slug}`}
									cover={list.cover}
									title={list.title}
									subtitle={list.subtitle}
									date={list.createdAt}
									badge="Llista"
									index={index}
								/>
							))}
						</div>
					</div>
				</section>
			) : null}

			{/* Qui hi ha al darrere */}
			<section className="py-12 md:py-16 lg:py-20">
				<div className="container">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
						<div className="lg:col-span-5">
							<picture className="block aspect-w-4 aspect-h-3 w-full">
								<source
									srcSet="/home-about-s-m.webp"
									media="(max-width: 768px)"
									type="image/webp"
								/>
								<source
									srcSet="/home-about-s-m.jpg"
									media="(max-width: 768px)"
								/>
								<source
									srcSet="/home-about-s.webp"
									media="(min-width: 768px)"
									type="image/webp"
								/>
								<img
									src="/home-about-s.jpg"
									alt="L'Andrea i en Juli, els autors d'Escapadesenparella.cat"
									width="400"
									height="300"
									className="w-full h-full object-cover rounded-2xl"
									loading="lazy"
								/>
							</picture>
						</div>
						<div className="lg:col-span-7">
							<span className="block text-13 uppercase tracking-widest text-tertiary-800 mb-2">
								Qui hi ha al darrere
							</span>
							<h2 className="my-0 text-balance">
								{foundationYears} anys recorrent Catalunya en
								parella
							</h2>
							<p className="mt-4 text-block leading-normal text-grey-400">
								Des del 2015 compartim les escapades que fem
								arreu de Catalunya:{" "}
								<strong className="text-grey-700">
									caps de setmana originals
								</strong>
								, llocs per{" "}
								<strong className="text-grey-700">
									descobrir Catalunya
								</strong>{" "}
								i{" "}
								<strong className="text-grey-700">
									experiències per gaudir en parella
								</strong>
								. Tot el que hi ha aquí l'hem visitat o
								verificat nosaltres.
							</p>
							<div className="flex flex-wrap gap-2.5 mt-6">
								<Link href="/sobre-nosaltres">
									<a
										title="Conèixer-nos millor"
										className="button button__primary button__med"
									>
										Conèixer-nos millor
									</a>
								</Link>
								<Link href="/contacte">
									<a
										title="Contactar amb Escapadesenparella.cat"
										className="button button__ghost button__med"
									>
										Contactar
									</a>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default HomePageResults;
