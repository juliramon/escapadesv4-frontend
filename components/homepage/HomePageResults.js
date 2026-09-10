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

	/**
	 * Xifres del bloc "Qui hi ha al darrere". Són els mateixos totals que
	 * alimenten els verticals: si l'API no els retorna, el bloc de xifres
	 * simplement no es pinta en comptes d'ensenyar zeros.
	 */
	const aboutStats = [
		{
			value: totals.activities,
			label: "experiències provades",
			href: "/activitats",
		},
		{
			value: totals.places,
			label: "allotjaments amb encant",
			href: "/allotjaments",
		},
		{
			value: totals.stories,
			label: "històries publicades",
			href: "/histories",
		},
	].filter((stat) => Number(stat.value) > 0);

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
					<div className="bg-gray-50 rounded-2xl overflow-hidden">
						<div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
							<div className="lg:col-span-5 relative">
								<picture className="block h-full">
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
										className="w-full h-full object-cover min-h-[260px] md:min-h-[340px] lg:min-h-full"
										loading="lazy"
									/>
								</picture>
								<span className="absolute top-4 left-4 lg:top-6 lg:left-6 inline-flex items-center gap-x-1.5 rounded-full bg-white/95 px-3 py-1.5 text-13 text-grey-700 shadow-sm">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width={15}
										height={15}
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-secondary-600"
										aria-hidden="true"
									>
										<path
											stroke="none"
											d="M0 0h24v24H0z"
											fill="none"
										/>
										<circle cx="12" cy="11" r="3" />
										<path d="M17.657 16.657L13.414 20.9a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
									</svg>
									Des del 2015, per Catalunya
								</span>
							</div>

							<div className="lg:col-span-7 p-6 md:p-10 lg:p-12">
								<span className="block text-13 uppercase tracking-widest text-tertiary-800 mb-2">
									Qui hi ha al darrere
								</span>
								<h2 className="my-0 text-balance">
									{foundationYears} anys d&apos;escapades en
									parella per Catalunya
								</h2>
								<p className="mt-4 text-block leading-normal text-grey-400">
									Des del 2015 recorrem el país buscant{" "}
									<strong className="text-grey-700">
										escapades en parella
									</strong>{" "}
									que valguin la pena: caps de setmana
									originals,{" "}
									<Link href="/allotjaments">
										<a className="underline underline-offset-2 hover:text-grey-700">
											allotjaments amb encant
										</a>
									</Link>{" "}
									i{" "}
									<Link href="/activitats">
										<a className="underline underline-offset-2 hover:text-grey-700">
											experiències per fer de dos en dos
										</a>
									</Link>
									. Tot el que trobareu aquí l&apos;hem
									visitat o verificat nosaltres, i us ho
									expliquem a les{" "}
									<Link href="/histories">
										<a className="underline underline-offset-2 hover:text-grey-700">
											nostres històries
										</a>
									</Link>
									.
								</p>

								{/*
								 * Les xifres són la prova del que diu el
								 * paràgraf: surten de les mateixes dades que
								 * alimenten els verticals, no són un adorn.
								 */}
								{aboutStats.length ? (
									<dl className="grid grid-cols-3 gap-x-4 gap-y-2 mt-7 pt-6 border-t border-primary-50">
										{aboutStats.map((stat) => (
											<div key={stat.label}>
												<dt className="sr-only">
													{stat.label}
												</dt>
												<dd className="m-0">
													<Link href={stat.href}>
														<a className="group block">
															<span className="block font-headings text-2xl md:text-3xl leading-none text-grey-700">
																{stat.value}
															</span>
															<span className="block mt-1 text-13 text-grey-400 group-hover:text-grey-700 transition-colors">
																{stat.label}
															</span>
														</a>
													</Link>
												</dd>
											</div>
										))}
									</dl>
								) : null}

								<div className="flex flex-wrap gap-2.5 mt-7">
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
				</div>
			</section>
		</div>
	);
};

export default HomePageResults;
