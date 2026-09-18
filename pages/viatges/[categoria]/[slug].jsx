import { useContext } from "react";
import Link from "next/link";
import {
	cloudinaryImage,
	cloudinaryResponsive,
} from "../../../utils/cloudinary";
import NavigationBar from "../../../components/global/NavigationBar";
import ContentService from "../../../services/contentService";
import UserContext from "../../../contexts/UserContext";
import ContentParser from "../../../utils/ContentParser";
import Footer from "../../../components/global/Footer";
import GlobalMetas from "../../../components/head/GlobalMetas";
import FancyboxUtil from "../../../utils/FancyboxUtils";
import { formatDateTimeToISODate } from "../../../utils/helpers";
import BlogPostingRichSnippet from "../../../components/richsnippets/BlogPostingRichSnippet";
import BreadcrumbRichSnippet from "../../../components/richsnippets/BreadcrumbRichSnippet";
import ShareBarModal from "../../../components/social/ShareBarModal";
import FollowInstagramBox from "../../../components/global/FollowInstagramBox";
import AdBanner from "../../../components/ads/AdBanner";
import AdSlot from "../../../components/ads/AdSlot";
import MobileAnchorAd from "../../../components/ads/MobileAnchorAd";
import RelatedListings from "../../../components/listingpage/RelatedListings";
import TripEntryPager from "../../../components/listings/TripEntryPager";
import { toEditorialCard } from "../../../utils/listingProps";

const StoryListing = ({
	tripEntryDetails,
	categoryDetails,
	previousEntry,
	nextEntry,
	otherEntries,
}) => {
	const { user } = useContext(UserContext);

	let slicedDescription = [];

	const categoryPath = `/viatges/${categoryDetails.slug}`;

	const buildImagesGrid = (start, end) => {
		const images = tripEntryDetails.images.slice(start, end);

		// El parser substitueix el marcador `post_images` d'enmig del text per
		// això, dins d'un array que React pinta tal qual: sense clau, avisa que
		// falta i pot reaprofitar el node equivocat si n'hi ha més d'una.
		return (
			<FancyboxUtil
				key={`gallery-${start}-${end}`}
				options={{
					infinite: true,
				}}
			>
				<div className="flex flex-wrap -mx-1 cursor-pointer">
					{images.map((image, idx) => {
						return (
							<div
								key={image || idx}
								className="w-full md:w-1/2 lg:w-1/3 px-1 mb-2 flex-auto"
								data-fancybox="gallery"
								data-src={image}
							>
								<picture className="block rounded-2xl overflow-hidden aspect-1 relative">
									<img
										src={image}
										alt={`${tripEntryDetails.title} - ${
											idx + 1
										}`}
										width={400}
										height={300}
										className="w-full h-full object-cover object-center"
										loading="lazy"
									/>
								</picture>
							</div>
						);
					})}
				</div>
			</FancyboxUtil>
		);
	};

	if (tripEntryDetails.description) {
		// Abans es feia aquí a mà: repetia el tractament de `post_images` que ja
		// hi ha al parser, deixava un `console.log` a producció i llegia
		// `el.props.children` sense comprovar-ho, cosa que peta amb qualsevol
		// node de text solt. Passant pel parser, les entrades de viatge també
		// entenen els blocs de galeria i els anuncis del cos.
		slicedDescription = ContentParser.parseStoryContent(
			tripEntryDetails.description,
			tripEntryDetails.images,
			buildImagesGrid,
			null,
			{ title: tripEntryDetails.title }
		);
	}

	// La portada és l'element més gran de la pantalla i el que decideix el LCP.
	// Va per amplades: un mòbil es baixa la de 480 px, no la de 1.729. El
	// retall canvia amb la pantalla (4:3 amunt, 16:9 a partir de tauleta),
	// així que cada `<source>` porta la seva llista d'amplades.
	const desktopCover = cloudinaryResponsive(tripEntryDetails.cover, {
		widths: [768, 1024, 1400, 1920],
		ratio: 9 / 16,
		sizes: "(min-width: 1400px) 1392px, 100vw",
	});
	const mobileCover = cloudinaryResponsive(tripEntryDetails.cover, {
		widths: [480, 768, 960],
		ratio: 3 / 4,
	});

	const coverImgMobile = mobileCover.src;

	const coverAuthorImg = cloudinaryImage(
		tripEntryDetails.owner.avatar,
		32,
		32
	).src;

	const shareUrl = `https://escapadesenparella.cat/viatges/${categoryDetails.slug}/${tripEntryDetails.slug}`;

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title={tripEntryDetails.metaTitle}
				fallbackTitle={tripEntryDetails.title}
				description={tripEntryDetails.metaDescription}
				fallbackDescription={tripEntryDetails.subtitle}
				url={shareUrl}
				image={tripEntryDetails.cover}
				canonical={shareUrl}
				type="article"
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Viatges"
				page2Url="https://escapadesenparella.cat/viatges"
				page3Title={categoryDetails.title}
				page3Url={`https://escapadesenparella.cat/viatges/${categoryDetails.slug}`}
				page4Title={tripEntryDetails.title}
				page4Url={shareUrl}
			/>
			<BlogPostingRichSnippet
				headline={tripEntryDetails.title}
				summary={tripEntryDetails.subtitle}
				image={tripEntryDetails.cover}
				author={tripEntryDetails.owner.fullName}
				publicationDate={tripEntryDetails.createdAt}
				modificationDate={tripEntryDetails.updatedAt}
			/>
			<div className="listing-story">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
					user={user}
				/>
				<main>
					<article>
						<section className="pt-8 md:pt-10 lg:pt-12 pb-6 md:pb-8 bg-tertiary-50 ">
							{/* Breadcrumb + article header */}
							<div className="w-full">
								<div className="container">
									<ul className="breadcrumb max-w-5xl mx-auto">
										<li className="breadcrumb__item">
											<a
												href="/"
												className="breadcrumb__link"
											>
												Inici
											</a>
										</li>
										<li className="breadcrumb__item">
											<a
												href="/viatges"
												className="breadcrumb__link"
											>
												Viatges
											</a>
										</li>
										<li className="breadcrumb__item">
											<a
												href={categoryPath}
												className="breadcrumb__link"
											>
												{categoryDetails.title}
											</a>
										</li>
									</ul>
								</div>
							</div>

							{/* Article heading + subtitle + meta info */}
							<div className="relative mt-4 md:mt-7">
								<div className="container">
									<div className="md:max-w-xl lg:max-w-5xl lg:mx-auto">
										{/* Tornar al viatge. El fil d'Ariadna ja
										    hi porta, però en lletra petita i sense
										    dir que això és un diari: el xip diu de
										    quin viatge és i per on va. */}
										<Link href={categoryPath}>
											<a className="inline-flex items-center gap-x-1.5 bg-white text-primary-500 text-13 leading-none rounded-full py-2 px-3 mb-3 hover:bg-primary-50 transition-colors duration-200 ease-in-out">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width={14}
													height={14}
													viewBox="0 0 24 24"
													strokeWidth={1.5}
													stroke="currentColor"
													fill="none"
													strokeLinecap="round"
													strokeLinejoin="round"
													aria-hidden="true"
												>
													<path
														stroke="none"
														d="M0 0h24v24H0z"
														fill="none"
													/>
													<path d="M7 9a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
													<path d="M5.75 15a8.015 8.015 0 1 0 9.25 -13" />
													<path d="M11 17v4" />
													<path d="M7 21h8" />
												</svg>
												{categoryDetails.title}
											</a>
										</Link>
										<h1 className="font-display max-w-3xl my-0">
											{tripEntryDetails.title}
										</h1>
										<p className="lg:text-xl font-light mt-2.5 mb-3 md:mt-3 md:mb-4 max-w-3xl">
											{tripEntryDetails.subtitle}
										</p>
										{/* Informació de l'autor */}
										<div className="flex flex-wrap items-center gap-4">
											<div className="flex flex-wrap items-center">
												<div className="rounded-full overflow-hidden w-8 h-8 mr-2.5">
													<picture>
														<img
															src={coverAuthorImg}
															alt={
																tripEntryDetails
																	.owner
																	.fullName
															}
															className={
																"w-full h-full object-cover"
															}
															width={32}
															height={32}
															loading="eager"
															fetchpriority="high"
														/>
													</picture>
												</div>
												<span className="text-sm">
													{
														tripEntryDetails.owner
															.fullName
													}
												</span>
												<span className="mx-2 text-sm ">
													–
												</span>
												<span className="text-sm ">
													<time
														dateTime={formatDateTimeToISODate(
															tripEntryDetails.createdAt
														)}
													>
														{formatDateTimeToISODate(
															tripEntryDetails.createdAt
														)}
													</time>
												</span>
											</div>
											<ShareBarModal
												picture={coverImgMobile}
												title={tripEntryDetails.title}
												rating={null}
												slug={shareUrl}
												locality={null}
												colorClass={
													"text-primary-500 text-sm"
												}
											/>
										</div>
									</div>
								</div>
							</div>
						</section>

						{/* Article cover */}
						<div className="relative after:absolute after:top-0 after:inset-x-0 after:bg-tertiary-50 after:h-20">
							<div className="container relative z-10">
								<figure className="my-0">
									<picture className="block aspect-w-4 aspect-h-3 lg:aspect-w-16 lg:aspect-h-9 h-full rounded-2xl overflow-hidden">
										<source
											srcSet={mobileCover.srcSet}
											sizes={mobileCover.sizes}
											media="(max-width: 768px)"
										/>
										<source
											srcSet={desktopCover.srcSet}
											sizes={desktopCover.sizes}
											media="(min-width: 768px)"
										/>
										<img
											src={desktopCover.src}
											alt={tripEntryDetails.title}
											className={
												"w-full h-full object-cover"
											}
											width={desktopCover.width}
											height={desktopCover.height}
											loading="eager"
											fetchpriority="high"
											decoding="async"
										/>
									</picture>
									{/* El `figcaption` anava solt, fora de cap
									    `figure`, i tant el crèdit com les dates
									    anaven subratllats sense ser enllaços. */}
									<figcaption className="mt-2 text-13 text-grey-400">
										Foto d&apos;Andrea Prat i Juli Ramon per
										Escapadesenparella.cat
									</figcaption>
								</figure>
							</div>
						</div>

						{/* Article description */}
						<section className="pt-7">
							<div className="container">
								<div className="max-w-5xl mx-auto">
									<div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 gap-x-12">
										<div className="md:col-span-8">
											<div className="w-full border-b border-primary-50 pb-4">
												<span className="block text-13 text-grey-400">
													Darrera actualització:{" "}
													<time
														dateTime={formatDateTimeToISODate(
															tripEntryDetails.updatedAt
														)}
													>
														{formatDateTimeToISODate(
															tripEntryDetails.updatedAt
														)}
													</time>
												</span>
											</div>
											<div className="listing-description w-full mt-6 md:mt-8">
												{slicedDescription}
											</div>

											{/* Continuar llegint el viatge, al
											    final del text i abans dels
											    anuncis. */}
											<div className="mt-10 md:mt-14">
												<TripEntryPager
													previousEntry={
														previousEntry
													}
													nextEntry={nextEntry}
													basePath={categoryPath}
												/>
											</div>

											<div className="pt-8 md:pt-12">
												<div className="border-t border-primary-50 pt-8 md:pt-12">
													<AdBanner
														data-ad-slot="9222117584"
														data-ad-format="autorelaxed"
													/>
												</div>
											</div>
										</div>

										{/* Aside */}
										<aside className="md:col-span-4">
											<div className="relative md:sticky md:top-24 mt-1.5">
												<div className="p-7 bg-white rounded-2xl border border-primary-50">
													<FollowInstagramBox />
												</div>
												<AdSlot
													placement="sidebar"
													containerClassName="p-7 bg-white rounded-2xl border border-primary-50 mt-7"
												/>
											</div>
										</aside>
									</div>
								</div>
							</div>
						</section>
					</article>

					{/* La resta de dies del viatge: fins ara l'entrada no
					    enllaçava enlloc i qui hi arribava des de cerca no
					    tenia manera de saber que formava part d'un diari. */}
					<RelatedListings
						eyebrow="Segueix el viatge"
						title={`Més dies de ${categoryDetails.title}`}
						description="La resta del diari d'aquest viatge, dia a dia."
						href={categoryPath}
						linkLabel="Veure el viatge sencer"
						items={otherEntries}
						variant="editorial"
						basePath={categoryPath}
						badge={categoryDetails.country}
					/>
				</main>
			</div>
			<Footer
				logo_url={
					"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
				}
			/>
			<MobileAnchorAd />
		</>
	);
};

/**
 * Les entrades de viatge es generaven a cada visita: 1,1–1,8 s fins al primer
 * byte, també per a Googlebot. Amb ISR es generen un cop, se serveixen de la
 * cache de Vercel i es refresquen cada dos minuts, com ja fan la portada, les
 * categories i les destinacions.
 */
export async function getStaticPaths() {
	const service = new ContentService();

	// Si l'API no respon en temps de build, no s'ha de tombar tot el build:
	// amb fallback "blocking" les pàgines es generen a la primera visita.
	let tripEntries = [];
	try {
		tripEntries = (await service.getAllTripEntries())?.allTrips || [];
	} catch (err) {
		console.warn(
			"getStaticPaths: no s'han pogut llistar les entrades de viatge, es generaran sota demanda.",
		);
	}

	return {
		// L'entrada penja del slug de la seva categoria de viatge.
		paths: tripEntries
			.filter((entry) => entry?.slug && entry?.trip?.slug)
			.map((entry) => ({
				params: { categoria: entry.trip.slug, slug: entry.slug },
			})),
		// "blocking" en lloc de false: amb false, una entrada publicada des
		// del panell donaria 404 fins al següent desplegament.
		fallback: "blocking",
	};
}

export async function getStaticProps({ params }) {
	const service = new ContentService();
	const categoryDetails = await service.getTripCategoryDetails(
		params.categoria
	);
	const tripEntryDetails = await service.getTripEntryDetails(params.slug);

	if (!tripEntryDetails || !categoryDetails) {
		return {
			notFound: true,
			revalidate: 120,
		};
	}

	// Els germans d'aquesta entrada, per ordre de publicació ascendent: és
	// l'ordre del viatge («dia 1», «dia 2»...), no el del llistat, que ensenya
	// primer el més nou.
	let siblings = [];
	try {
		const { allTrips } = await service.paginateTripCategory(
			categoryDetails._id,
			0
		);
		siblings = (allTrips || [])
			.map(toEditorialCard)
			.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
	} catch (err) {
		console.warn(
			"getStaticProps: no s'han pogut llistar els altres dies del viatge."
		);
	}

	const currentIndex = siblings.findIndex(
		(entry) => entry.slug === tripEntryDetails.slug
	);
	const previousEntry =
		currentIndex > 0 ? siblings[currentIndex - 1] : null;
	const nextEntry =
		currentIndex >= 0 && currentIndex < siblings.length - 1
			? siblings[currentIndex + 1]
			: null;

	// Al bloc de relacionats hi van els dies que no són ni aquest ni els dos
	// que ja surten a l'anterior/següent: així no es repeteix res.
	const shownSlugs = new Set(
		[tripEntryDetails.slug, previousEntry?.slug, nextEntry?.slug].filter(
			Boolean
		)
	);
	const otherEntries = siblings.filter(
		(entry) => !shownSlugs.has(entry.slug)
	);

	return {
		props: {
			tripEntryDetails,
			categoryDetails,
			previousEntry,
			nextEntry,
			otherEntries,
		},
		revalidate: 120,
	};
}

export default StoryListing;
