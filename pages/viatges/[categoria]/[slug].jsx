import { useContext } from "react";
import NavigationBar from "../../../components/global/NavigationBar";
import ContentService from "../../../services/contentService";
import UserContext from "../../../contexts/UserContext";
import parse from "html-react-parser";
import Footer from "../../../components/global/Footer";
import GlobalMetas from "../../../components/head/GlobalMetas";
import FancyboxUtil from "../../../utils/FancyboxUtils";
import { formatDateTimeToISODate } from "../../../utils/helpers";
import ArticleRichSnippet from "../../../components/richsnippets/ArticleRichSnippet";
import BreadcrumbRichSnippet from "../../../components/richsnippets/BreadcrumbRichSnippet";

const StoryListing = ({ tripEntryDetails, categoryDetails }) => {
	const { user } = useContext(UserContext);

	let parsedDescription;
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
									className="block rounded-md overflow-hidden aspect-1"
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
		parsedDescription = parse(tripEntryDetails.description);
		parsedDescription.map((el) => slicedDescription.push(el));
		if (slicedDescription.length > 1) {
			slicedDescription.forEach((el, idx) => {
				if (
					typeof el.props.children == "string" &&
					el.props.children.includes("post_images")
				) {
					const str = el.props.children;

					const found = str.replace(/^\D+/g, "");
					const foundArr = found.slice(0, -2).split(",");
					const startingIndex = foundArr[0];
					const endIndex = foundArr[1];

					slicedDescription[idx] = buildImagesGrid(
						startingIndex,
						endIndex
					);
				}
			});
		}
	}

	const coverPath = tripEntryDetails.cover.substring(0, 51);
	const imageId = tripEntryDetails.cover.substring(63);
	const coverImgDesktop = `${coverPath}w_896,h_504,c_fill/${imageId}`;
	const coverImgMobile = `${coverPath}w_366,h_206,c_fill/${imageId}`;

	const coverAuthorPath = tripEntryDetails.owner.avatar.substring(0, 51);
	const imageAuthorId = tripEntryDetails.owner.avatar.substring(63);
	const coverAuthorImg = `${coverAuthorPath}w_32,h_32,c_fill/${imageAuthorId}`;

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
			<ArticleRichSnippet
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
				<div className="pt-3 px-4">
					<div className="w-full">
						<ul className="breadcrumb">
							<li className="breadcrumb__item">
								<a
									href="/"
									title="Inici"
									className="breadcrumb__link"
								>
									Inici
								</a>
							</li>
							<li className="breadcrumb__item">
								<a href="/viatges" className="breadcrumb__link">
									Viatges
								</a>
							</li>
							<li className="breadcrumb__item">
								<a
									href={`/viatges/${categoryDetails.slug}`}
									title={categoryDetails.title}
									className="breadcrumb__link"
								>
									{categoryDetails.title}
								</a>
							</li>
							<li className="breadcrumb__item">
								<span className="breadcrumb__link active">
									{tripEntryDetails.title}
								</span>
							</li>
						</ul>
					</div>
				</div>
				<main>
					<article className="pt-12 pb-4">
						<div className="container">
							<div className="max-w-full md:max-w-2xl mx-auto">
								<h1 className="md:text-center">
									{tripEntryDetails.title}
								</h1>
								<p className="text-lg md:text-xl md:text-center md:px-16 mt-2.5">
									{tripEntryDetails.subtitle}
								</p>
								<div className="mt-3 flex flex-wrap items-center md:justify-center">
									<div className="flex flex-wrap items-center">
										<div className="rounded-full overflow-hidden w-8 h-8 mr-2.5">
											<picture>
												<img
													src={coverAuthorImg}
													alt={
														tripEntryDetails.owner
															.fullName
													}
													width={32}
													height={32}
													className="w-full h-full object-cover"
													loadgin="eager"
													fetchpriority="high"
												/>
											</picture>
										</div>
										<span className="text-sm text-primary-400 text-opacity-80">
											{tripEntryDetails.owner.fullName}
										</span>
										<span className="mx-2 text-sm text-primary-400 text-opacity-80">
											·
										</span>
										<span className="text-sm text-primary-400 text-opacity-80">
											Publicat el{" "}
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
								</div>
							</div>

							<div className="w-full max-w-full md:max-w-4xl md:mx-auto mt-6">
								<div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
									<picture>
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
											width={400}
											height={300}
											className="w-full h-full object-cover"
											fetchpriority="high"
											loading="eager"
										/>
									</picture>
								</div>
								<figcaption className="text-xs mt-2 text-primary-400 text-opacity-80">
									Foto d' <u>Andrea Prat</u> i{" "}
									<u>Juli Ramon</u> per Escapadesenparella.cat
								</figcaption>
							</div>

							<div className="w-full max-w-full md:max-w-2xl mx-auto pt-8">
								<div className="text-center text-tertiary-500 text-opacity-80 text-sm py-4 mb-5 md:mb-6 bg-tertiary-100 bg-opacity-50 flex items-center justify-center rounded-md">
									<span className="inline-block">
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
								</div>
								<div className="listing-description">
									{slicedDescription}
								</div>
							</div>
						</div>
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
