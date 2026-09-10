import { useRouter } from "next/router";
import { cloudinaryUrl } from "../../utils/cloudinary";
import { useContext, useEffect, useState } from "react";
import Footer from "../../components/global/Footer";
import NavigationBar from "../../components/global/NavigationBar";
import ShareModal from "../../components/modals/ShareModal";
import SignUpModal from "../../components/modals/SignUpModal";
import UserContext from "../../contexts/UserContext";
import ContentService from "../../services/contentService";
import FollowInstagramBox from "../../components/global/FollowInstagramBox";
import GlobalMetas from "../../components/head/GlobalMetas";
import BlogPostingRichSnippet from "../../components/richsnippets/BlogPostingRichSnippet";
import BreadcrumbRichSnippet from "../../components/richsnippets/BreadcrumbRichSnippet";
import { formatDateTimeToISODate } from "../../utils/helpers";
import ShareBarModal from "../../components/social/ShareBarModal";
import AdBanner from "../../components/ads/AdBanner";
import MobileAnchorAd from "../../components/ads/MobileAnchorAd";
import RelatedListings from "../../components/listingpage/RelatedListings";
import ContentParser from "../../utils/ContentParser";

const ListView = ({ listDetails, relatedLists }) => {
	const { user } = useContext(UserContext);
	const router = useRouter();

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

	const coverImg = cloudinaryUrl(listDetails.cover, "w_1729,h_973,c_fill");
	const coverImgMob = cloudinaryUrl(listDetails.cover, "w_450,h_337,c_fill");
	const coverImgWebp = cloudinaryUrl(listDetails.cover, "f_webp,w_1729,h_973,c_fill");
	const coverImgWebpMobile = cloudinaryUrl(listDetails.cover, "f_webp,w_450,h_337,c_fill");

	const ogImg = cloudinaryUrl(listDetails.cover, "w_1200,h_630,c_fill");

	const coverAuthorImg = cloudinaryUrl(listDetails.owner.avatar, "w_32,h_32,c_fill");

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title={listDetails.metaTitle}
				description={listDetails.metaDescription}
				url={`https://escapadesenparella.cat/llistes/${listDetails.slug}`}
				image={ogImg}
				canonical={`https://escapadesenparella.cat/llistes/${listDetails.slug}`}
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Llistes"
				page2Url="https://escapadesenparella.cat/llistes"
				page3Title={listDetails.metaTitle}
				page3Url={`https://escapadesenparella.cat/llistes/${listDetails.slug}`}
			/>
			<BlogPostingRichSnippet
				headline={listDetails.title}
				summary={listDetails.subtitle}
				image={ogImg}
				author={listDetails.owner.fullName}
				publicationDate={listDetails.createdAt}
				modificationDate={listDetails.updatedAt}
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
													slug={`https://escapadesenparella.cat/llistes/${listDetails.slug}`}
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
										srcSet={coverImgWebpMobile}
										media="(max-width: 768px)"
									/>
									<source
										srcSet={coverImgWebp}
										media="(min-width: 768px)"
									/>
									<source
										srcSet={coverImgMob}
										media="(max-width: 768px)"
									/>
									<source
										srcSet={coverImg}
										media="(min-width: 768px)"
									/>
									<img
										src={coverImg}
										alt={listDetails.title}
										className={"w-full h-full object-cover"}
										width={400}
										height={300}
										loading="eager"
										fetchpriority="high"
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

export async function getServerSideProps({ params }) {
	const service = new ContentService();
	const listDetails = await service.getListDetails(params.slug);

	if (!listDetails) {
		return {
			notFound: true,
		};
	}

	// Contingut relacionat del peu: sense això la fitxa és un cul-de-sac
	// per a qui hi arriba des de cerca.
	let relatedLists = [];
	try {
		const all = await service.getAllLists();
		relatedLists = (all || [])
			.filter((item) => item.slug !== listDetails.slug)
			.slice(0, 4);
	} catch (error) {
		relatedLists = [];
	}

	return {
		props: {
			listDetails,
			relatedLists,
		},
	};
}

export default ListView;
