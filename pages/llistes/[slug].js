import { useRouter } from "next/router";
import {
	cloudinaryImage,
	cloudinaryResponsive,
} from "../../utils/cloudinary";
import { useContext, useEffect, useState } from "react";
import Footer from "../../components/global/Footer";
import NavigationBar from "../../components/global/NavigationBar";
import ShareModal from "../../components/modals/ShareModal";
import SignUpModal from "../../components/modals/SignUpModal";
import UserContext from "../../contexts/UserContext";
import ContentService from "../../services/contentService";
import {
	DEFAULT_LOCALE,
	FIELDS,
	LOCALES,
	findBySlug,
	localized,
	segment,
	slugFor,
} from "../../utils/i18n";
import FollowInstagramBox from "../../components/global/FollowInstagramBox";
import GlobalMetas from "../../components/head/GlobalMetas";
import BlogPostingRichSnippet from "../../components/richsnippets/BlogPostingRichSnippet";
import BreadcrumbRichSnippet from "../../components/richsnippets/BreadcrumbRichSnippet";
import { formatDateTimeToISODate } from "../../utils/helpers";
import ShareBarModal from "../../components/social/ShareBarModal";
import AdBanner from "../../components/ads/AdBanner";
import MobileAnchorAd from "../../components/ads/MobileAnchorAd";
import RelatedListings from "../../components/listingpage/RelatedListings";
import {
	loadListCatalog,
	relatedEditorial,
} from "../../utils/relatedContent";
import ContentParser from "../../utils/ContentParser";
import ItemListRichSnippet from "../../components/richsnippets/ItemListRichSnippet";

const ListView = ({ listDetails, relatedLists }) => {
	const { user } = useContext(UserContext);
	const router = useRouter();
	// En castellà la ruta és `/es/listas/<slug traduït>`: el segment i el
	// slug van tots dos en l'idioma de la pàgina.
	const seccio = segment("llistes", router.locale);
	const urlLlista = `https://escapadesenparella.cat/${seccio}/${slugFor(
		listDetails,
		router.locale,
	)}`;

	useEffect(() => {
		if (
			router.pathname.includes("editar") ||
			router.pathname.includes("nova-activitat") ||
			router.pathname.includes("nou-allotjament") ||
			router.pathname.includes("nova-historia")
		) {
			document.querySelector("body").classList.add("composer");
		} else {
			document.querySelector("body").classList.remove("composer");
		}
	}, [router]);

	const urlToShare = `https://escapadesenparella.cat/llistes/${router.query.slug}`;

	const [queryId, setQueryId] = useState(null);

	useEffect(() => {
		if (router && router.query) {
			setQueryId(router.query.slug);
		}
	}, [router]);

	const [modalVisibility, setModalVisibility] = useState(false);
	const handleModalVisibility = () => setModalVisibility(true);
	const hideModalVisibility = () => setModalVisibility(false);

	const [shareModalVisibility, setShareModalVisibility] = useState(false);
	const handleShareModalVisibility = () => setShareModalVisibility(true);
	const hideShareModalVisibility = () => setShareModalVisibility(false);

	// La portada és l'element més gran de la pantalla i el que decideix el LCP.
	// Va per amplades: un mòbil es baixa la de 480 px, no la de 1.729. El
	// retall canvia amb la pantalla (4:3 amunt, 16:9 a partir de tauleta),
	// així que cada `<source>` porta la seva llista d'amplades.
	const desktopCover = cloudinaryResponsive(listDetails.cover, {
		widths: [768, 1024, 1400, 1920],
		ratio: 9 / 16,
		sizes: "(min-width: 1200px) 1200px, 100vw",
	});
	const mobileCover = cloudinaryResponsive(listDetails.cover, {
		widths: [480, 768, 960],
		ratio: 3 / 4,
	});

	const coverImg = desktopCover.src;

	const ogImg = cloudinaryImage(listDetails.cover, 1200, 630).src;

	const coverAuthorImg = cloudinaryImage(listDetails.owner.avatar, 32, 32).src;

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title={listDetails.metaTitle}
				fallbackTitle={listDetails.title}
				description={listDetails.metaDescription}
				fallbackDescription={listDetails.subtitle}
				url={urlLlista}
				image={ogImg}
				canonical={urlLlista}
				type="article"
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Llistes"
				page2Url={`https://escapadesenparella.cat/${seccio}`}
				page3Title={listDetails.title}
				page3Url={urlLlista}
			/>
			<BlogPostingRichSnippet
				headline={listDetails.title}
				summary={listDetails.subtitle}
				image={ogImg}
				author={listDetails.owner.fullName}
				publicationDate={listDetails.createdAt}
				modificationDate={listDetails.updatedAt}
			/>
			{/* Els elements de la llista, tal com estan escrits al text. */}
			<ItemListRichSnippet
				html={listDetails.description}
				name={listDetails.title}
				url={urlLlista}
			/>
			<div className="listing-list">
				<NavigationBar />
				<main>
					<article>
						<section className="pt-8 md:pt-10 lg:pt-12">
							{/* Breadcrumb + article header */}
							<div className="w-full">
								<div className="container">
									<ul className="breadcrumb max-w-3xl mx-auto">
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
												href="/llistes"
												className="breadcrumb__link"
											>
												Llistes
											</a>
										</li>
									</ul>
								</div>
							</div>

							{/* Article heading + subtitle + meta info */}
							<div className="relative mt-4 md:mt-7">
								<div className="container">
									<div className="md:max-w-xl lg:max-w-3xl lg:mx-auto">
										<h1 className="h2 max-w-3xl my-0">
											{listDetails.title}
										</h1>
										<p className="mt-4 !mb-0 text-block--xl leading-normal max-w-[55ch]">
											{listDetails.subtitle}
										</p>
										{/* Informació de l'autor */}
										<div className="flex flex-wrap items-stretch m-0 p-0 gap-x-2 mt-6">
											<div className="flex flex-wrap items-center text-primary-500 bg-gray-100 rounded-lg py-2.5 px-3 text-sm gap-x-1">
												<picture className="inline-block rounded-full overflow-hidden w-8 h-8 mr-2.5">
													<img
														src={coverAuthorImg}
														alt={
															listDetails.owner
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
												{listDetails.owner.fullName}
											</div>

											<div className="flex flex-wrap items-center text-primary-500 bg-gray-100 rounded-lg py-2.5 px-3 text-sm gap-x-1">
												<time
													dateTime={formatDateTimeToISODate(
														listDetails.createdAt
													)}
												>
													{formatDateTimeToISODate(
														listDetails.createdAt
													)}
												</time>
											</div>

											<div className="flex flex-wrap items-center text-primary-500 bg-gray-100 rounded-lg py-2.5 px-3 text-sm gap-x-1">
												<ShareBarModal
													picture={coverImg}
													title={listDetails.title}
													rating={null}
													slug={urlLlista}
													locality={null}
													colorClass={
														"text-primary-500 text-sm"
													}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>

						{/* Article cover */}
						<div className="pt-8 md:pt-12">
							<div className="container relative z-10">
								<picture className="block aspect-[4/3] md:aspect-[16/9] relative rounded-2xl overflow-hidden max-w-[1200px] mx-auto">
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
										alt={listDetails.title}
										className={"w-full h-full object-cover"}
										width={desktopCover.width}
										height={desktopCover.height}
										loading="eager"
										fetchpriority="high"
										decoding="async"
									/>
								</picture>
							</div>
						</div>

						{/* Article description */}
						<section className="py-7 md:pb-12">
							<div className="container">
								<div className="max-w-5xl mx-auto">
									<div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 gap-x-12">
										<div className="md:col-span-8">
											<div className="w-full border-b border-primary-50 pb-8">
												<div className="flex flex-col h-full">
													<span className="block text-sm">
														Darrera actualització:{" "}
														<time
															dateTime={formatDateTimeToISODate(
																listDetails.updatedAt
															)}
														>
															<u>
																{formatDateTimeToISODate(
																	listDetails.updatedAt
																)}
															</u>
														</time>
													</span>
													<figcaption className="text-sm font-light block">
														Foto d'{" "}
														<u>Andrea Prat</u> i{" "}
														<u>Juli Ramon</u> per
														Escapadesenparella.cat
													</figcaption>
												</div>
											</div>
											<div className="list__description w-full mt-6 md:mt-8">
												{ContentParser.parseContent(
													listDetails.description,
													{ title: listDetails.title }
												)}
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
												<div className="p-7 bg-white rounded-2xl border border-primary-50 mt-7">
													<span className="inline-block text-xs">
														Anunci
													</span>
													<AdBanner
														data-ad-slot="4940975412"
														data-ad-format="auto"
														data-full-width-responsive="true"
													/>
												</div>
											</div>
										</aside>
									</div>
								</div>
							</div>
						</section>
					</article>
				<RelatedListings
					eyebrow="Més idees"
					title="Altres llistes d'escapades"
					description="Seleccions temàtiques per decidir on anar."
					href="/llistes"
					linkLabel="Veure totes les llistes"
					items={relatedLists}
					variant="editorial"
					basePath="/llistes"
					badge="Llista"
				/>
				</main>

				<SignUpModal
					visibility={modalVisibility}
					hideModal={hideModalVisibility}
				/>
				<ShareModal
					visibility={shareModalVisibility}
					hideModal={hideShareModalVisibility}
					url={urlToShare}
				/>
				<Footer
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
				/>
				<MobileAnchorAd />
			</div>
		</>
	);
};

/**
 * Les llistes es generaven a cada visita: 1,1–1,8 s fins al primer byte,
 * també per a Googlebot. Amb ISR es genera un cop, se serveix de la cache de
 * Vercel i es refresca cada dos minuts, com ja fan la portada, les categories
 * i les destinacions.
 */
export async function getStaticPaths() {
	const service = new ContentService();

	// Si l'API no respon en temps de build, no s'ha de tombar tot el build:
	// amb fallback "blocking" les pàgines es generen a la primera visita.
	let lists = [];
	try {
		lists = (await service.getAllLists()) || [];
	} catch (err) {
		console.warn(
			"getStaticPaths: no s'han pogut llistar les llistes, es generaran sota demanda.",
		);
	}

	return {
		paths: LOCALES.flatMap((locale) =>
			lists
				.filter((list) => list?.slug)
				.map((list) => ({
					params: { slug: slugFor(list, locale) },
					locale,
				})),
		),
		// "blocking" en lloc de false: amb false, una llista publicada des del
		// panell donaria 404 fins al següent desplegament.
		fallback: "blocking",
	};
}

export async function getStaticProps({ params, locale }) {
	const service = new ContentService();
	// En castellà arriba el slug traduït, que l'API no coneix: es busca al
	// catàleg de llistes, que ja està a la memòria intermèdia del mòdul.
	const catala =
		locale && locale !== DEFAULT_LOCALE
			? findBySlug(await service.getAllLists(), params.slug, locale)?.slug
			: params.slug;
	const listDetails = catala ? await service.getListDetails(catala) : null;

	if (!listDetails) {
		return {
			notFound: true,
			revalidate: 120,
		};
	}

	// Contingut relacionat del peu: sense això la llista és un cul-de-sac
	// per a qui hi arriba des de cerca. Abans eren les quatre primeres de
	// l'API, les mateixes a totes les llistes; ara són les del mateix tema
	// («nadal», «estiu», «pallars») i, si no n'hi ha prou, les veïnes.
	let relatedLists = [];
	try {
		relatedLists = relatedEditorial(
			listDetails,
			await loadListCatalog(service),
		);
	} catch (error) {
		relatedLists = [];
	}

	return {
		props: {
			listDetails: localized(listDetails, locale, FIELDS.list),
			relatedLists: (relatedLists || []).map((item) =>
				localized(item, locale, FIELDS.card),
			),
		},
		revalidate: 120,
	};
}

export default ListView;
