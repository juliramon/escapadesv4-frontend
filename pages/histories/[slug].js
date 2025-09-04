import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import NavigationBar from "../../components/global/NavigationBar";
import ContentService from "../../services/contentService";
import UserContext from "../../contexts/UserContext";
import Footer from "../../components/global/Footer";
import FollowInstagramBox from "../../components/global/FollowInstagramBox";
import GlobalMetas from "../../components/head/GlobalMetas";
import FancyboxUtil from "../../utils/FancyboxUtils";
import { formatDateTimeToISODate } from "../../utils/helpers";
import BreadcrumbRichSnippet from "../../components/richsnippets/BreadcrumbRichSnippet";
import BlogPostingRichSnippet from "../../components/richsnippets/BlogPostingRichSnippet";
import ShareBarModal from "../../components/social/ShareBarModal";
import AdBanner from "../../components/ads/AdBanner";
import ContentParser from "../../utils/ContentParser";

const StoryListing = ({ storyDetails }) => {
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

	let slicedDescription = [];

	const welcomeText = (
		<div className="mb-5" key="welcome-text">
			<h2>
				{storyDetails.title}: Benvinguts a l'escapada de la setmana, ens
				hi acompanyeu?
			</h2>
		</div>
	);

	const buildImagesGrid = (start, end) => {
		const images = storyDetails.images.slice(start, end);

		return (
			<FancyboxUtil
				options={{
					infinite: true,
				}}
				key={`images-grid-${start}-${end}`}
			>
				<div className="flex flex-wrap -mx-1 cursor-pointer">
					{images.map((image, idx) => {
						return (
							<div
								className="w-1/2 md:w-1/3 px-1 mb-2 flex-auto"
								data-fancybox="gallery"
								data-src={image}
								key={idx}
							>
								<picture
									key={idx}
									className="block rounded-2xl overflow-hidden aspect-1 relative"
								>
									<img
										src={image}
										alt={`${storyDetails.title} - ${
											idx + 1
										}`}
										className={"w-full h-full object-cover"}
										width={400}
										height={300}
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

	if (storyDetails.description) {
		// Usar el nuevo parser que soporta atajos de banners publicitarios
		slicedDescription = ContentParser.parseStoryContent(
			storyDetails.description,
			storyDetails.images,
			buildImagesGrid,
			welcomeText
		);
	}

	const coverPath = storyDetails.cover.substring(0, 51);
	const imageId = storyDetails.cover.substring(63);

	const coverImg = `${coverPath}w_1729,h_973,c_fill/${imageId}`;
	const coverImgMob = `${coverPath}w_450,h_337,c_fill/${imageId}`;
	const coverImageIdWebp = storyDetails.cover
		?.substring(63)
		.replace("jpg", "webp");
	const coverImgWebp = `${coverPath}f_webp/w_1729,h_973,c_fill/${coverImageIdWebp}`;
	const coverImgWebpMobile = `${coverPath}f_webp/w_450,h_337,c_fill/${coverImageIdWebp}`;

	const ogImg = `${coverPath}w_1200,h_630,c_fill/${imageId}`;

	const coverAuthorPath = storyDetails.owner.avatar.substring(0, 51);
	const imageAuthorId = storyDetails.owner.avatar.substring(63);
	const coverAuthorImg = `${coverAuthorPath}w_32,h_32,c_fill/${imageAuthorId}`;

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title={storyDetails.metaTitle}
				description={storyDetails.metaDescription}
				url={`https://escapadesenparella.cat/histories/${storyDetails.slug}`}
				image={ogImg}
				canonical={`https://escapadesenparella.cat/histories/${storyDetails.slug}`}
				preconnect={"https://res.cloudinary.com/"}
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Històries"
				page2Url="https://escapadesenparella.cat/histories"
				page3Title={storyDetails.metaTitle}
				page3Url={`https://escapadesenparella.cat/histories/${storyDetails.slug}`}
			/>
			<BlogPostingRichSnippet
				headline={storyDetails.title}
				summary={storyDetails.subtitle}
				image={ogImg}
				author={storyDetails.owner.fullName}
				publicationDate={storyDetails.createdAt}
				modificationDate={storyDetails.updatedAt}
			/>
			<div className="listing-story">
				<NavigationBar />
				<main>
					<article>
						<section className="pt-8 md:pt-10 lg:pt-12 pb-6 md:pb-8">
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
												href="/histories"
												className="breadcrumb__link"
											>
												Històries en parella
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
											{storyDetails.title}
										</h1>
										<p className="mt-4 !mb-0 text-block--xl leading-normal max-w-[55ch]">
											{storyDetails.subtitle}
										</p>
										{/* Informació de l'autor */}
										<div className="flex flex-wrap items-center gap-4 mt-4">
											<div className="flex flex-wrap items-center gap-x-1.5">
												<div className="rounded-full overflow-hidden w-8 h-8 mr-1.5">
													<picture>
														<img
															src={coverAuthorImg}
															alt={
																storyDetails
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
												<span className="text-15 text-grey-400 inline-block">
													{
														storyDetails.owner
															.fullName
													}
												</span>
												<span className="text-15 text-grey-400 inline-block ">
													–
												</span>
												<span className="text-15 text-grey-400 inline-block ">
													<time
														dateTime={formatDateTimeToISODate(
															storyDetails.createdAt
														)}
													>
														<u>
															{formatDateTimeToISODate(
																storyDetails.createdAt
															)}
														</u>
													</time>
												</span>
											</div>
											<ShareBarModal
												picture={coverImgMob}
												title={storyDetails.title}
												rating={null}
												slug={`https://escapadesenparella.cat/histories/${storyDetails.slug}`}
												locality={null}
												colorClass={
													"text-15 text-grey-400 inline-block"
												}
											/>
										</div>
									</div>
								</div>
							</div>
						</section>

						{/* Article cover */}
						<div className="relative">
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
										srcSet={coverImg}
										media="(min-width: 768px)"
									/>
									<img
										src={coverImg}
										alt={storyDetails.title}
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
																storyDetails.updatedAt
															)}
														>
															<u>
																{formatDateTimeToISODate(
																	storyDetails.updatedAt
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
											<div className="listing-description w-full mt-6 md:mt-8">
												{slicedDescription}
											</div>
											<div className="pt-8 md:pt-12">
												<div className="border-t border-primary-50">
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
				</main>
			</div>
			<Footer
				logo_url={
					"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
				}
			/>
		</>
	);
};

export async function getServerSideProps({ params }) {
	const service = new ContentService();
	const storyDetails = await service.getStoryDetails(params.slug);

	if (!storyDetails) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			storyDetails,
		},
	};
}

export default StoryListing;
