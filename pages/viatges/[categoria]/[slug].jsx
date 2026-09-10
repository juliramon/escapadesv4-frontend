import { useContext } from "react";
import { cloudinaryUrl } from "../../../utils/cloudinary";
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

const StoryListing = ({ tripEntryDetails, categoryDetails }) => {
	const { user } = useContext(UserContext);

	let slicedDescription = [];

	const buildImagesGrid = (start, end) => {
		const images = tripEntryDetails.images.slice(start, end);

		return (
			<FancyboxUtil
				options={{
					infinite: true,
				}}
			>
				<div className="flex flex-wrap -mx-1 cursor-pointer">
					{images.map((image, idx) => {
						return (
							<div
								className="w-full md:w-1/2 lg:w-1/3 px-1 mb-2 flex-auto"
								data-fancybox="gallery"
								data-src={image}
							>
								<picture
									key={idx}
									className="block rounded-2xl overflow-hidden aspect-1 relative"
								>
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

	const coverImgDesktop = cloudinaryUrl(tripEntryDetails.cover, "w_1392,h_783,c_fill");
	const coverImgMobile = cloudinaryUrl(tripEntryDetails.cover, "w_400,h_300,c_fill");

	const coverAuthorImg = cloudinaryUrl(tripEntryDetails.owner.avatar, "w_32,h_32,c_fill");

	return (
		<>
			{/* Browser metas  */}
			<GlobalMetas
				title={tripEntryDetails.metaTitle}
				description={tripEntryDetails.metaDescription}
				url={`https://escapadesenparella.cat/viatges/${categoryDetails.slug}/${tripEntryDetails.slug}`}
				image={tripEntryDetails.cover}
				canonical={`https://escapadesenparella.cat/viatges/${categoryDetails.slug}/${tripEntryDetails.slug}`}
			/>
			{/* Rich snippets */}
			<BreadcrumbRichSnippet
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Viatges"
				page2Url="https://escapadesenparella.cat/viatges"
				page3Title={categoryDetails.title}
				page3Url={`https://escapadesenparella.cat/viatges/${categoryDetails.slug}/${categoryDetails.slug}`}
				page4Title={tripEntryDetails.metaTitle}
				page4Url={`https://escapadesenparella.cat/viatges/${categoryDetails.slug}/${tripEntryDetails.slug}`}
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
												href={`https://escapadesenparella.cat/viatges/${categoryDetails.slug}`}
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
														<u>
															{formatDateTimeToISODate(
																tripEntryDetails.createdAt
															)}
														</u>
													</time>
												</span>
											</div>
											<ShareBarModal
												picture={coverImgMobile}
												title={tripEntryDetails.title}
												rating={null}
												slug={`https://escapadesenparella.cat/viatges/${categoryDetails.slug}/${tripEntryDetails.slug}`}
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
								<picture className="block aspect-w-4 aspect-h-3 lg:aspect-w-16 lg:aspect-h-9 h-full rounded-2xl overflow-hidden">
									<source
										srcSet={coverImgMobile}
										media="(max-width: 768px)"
									/>
									<source
										srcSet={coverImgDesktop}
										media="(min-width: 768px)"
									/>
									<img
										src={coverImgDesktop}
										alt={tripEntryDetails.title}
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
						<section className="pt-7">
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
																tripEntryDetails.updatedAt
															)}
														>
															<u>
																{formatDateTimeToISODate(
																	tripEntryDetails.updatedAt
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
										</div>

										{/* Aside */}
										<aside className="md:col-span-4">
											<div className="relative xl:sticky xl:top-24 mt-1.5">
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
				<section className="py-8 md:py-12">
					<div className="container">
						<div className="border-t border-primary-50 pt-8 md:pt-12">
							<AdBanner
								data-ad-slot="9222117584"
								data-ad-format="autorelaxed"
							/>
						</div>
					</div>
				</section>
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
	const categoryDetails = await service.getTripCategoryDetails(
		params.categoria
	);
	const tripEntryDetails = await service.getTripEntryDetails(params.slug);

	if (!tripEntryDetails) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			tripEntryDetails,
			categoryDetails,
		},
	};
}

export default StoryListing;
