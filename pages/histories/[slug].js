import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import NavigationBar from "../../components/global/NavigationBar";
import ContentService from "../../services/contentService";
import UserContext from "../../contexts/UserContext";
import parse from "html-react-parser";
import Footer from "../../components/global/Footer";
import FooterHistoria from "../../components/global/FooterHistoria";
import GlobalMetas from "../../components/head/GlobalMetas";
import FancyboxUtil from "../../utils/FancyboxUtils";
import { formatDateTimeToISODate } from "../../utils/helpers";
import ShareBar from "../../components/social/ShareBar";
import BreadcrumbRichSnippet from "../../components/richsnippets/BreadcrumbRichSnippet";
import ArticleRichSnippet from "../../components/richsnippets/ArticleRichSnippet";
import Image from "next/image";

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

	let parsedDescription;
	let slicedDescription = [];

	const welcomeText = (
		<div className="mb-8">
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
									className="block rounded-md overflow-hidden aspect-1 relative"
								>
									<Image src={image}
										alt={`${storyDetails.title} - ${idx + 1
											}`}
										layout="fill"
										objectFit="cover"
										blur="true"
										blurDataURL={image}
										loading="lazy"
									/>
									{/* <img
										src={image}
										alt={`${storyDetails.title} - ${idx + 1
											}`}
										width={400}
										height={300}
										className="w-full h-full object-cover object-center"
										loading="lazy"
									/> */}
								</picture>
							</div>
						);
					})}
				</div>
			</FancyboxUtil>
		);
	};

	if (storyDetails.description) {
		parsedDescription = parse(storyDetails.description);
		parsedDescription.map((el) => slicedDescription.push(el));
		if (slicedDescription.length > 1) {
			slicedDescription.splice(1, 0, welcomeText);
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

	const coverPath = storyDetails.cover.substring(0, 51);
	const imageId = storyDetails.cover.substring(63);
	const coverImg = `${coverPath}w_812,h_457,c_fill/${imageId}`;

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
				image={storyDetails.cover}
				canonical={`https://escapadesenparella.cat/histories/${storyDetails.slug}`}
				preconnect={'https://res.cloudinary.com/'}
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
			<ArticleRichSnippet
				headline={storyDetails.title}
				summary={storyDetails.subtitle}
				image={storyDetails.cover}
				author={storyDetails.owner.fullName}
				publicationDate={storyDetails.createdAt}
				modificationDate={storyDetails.updatedAt}
			/>
			<div className="listing-story">
				<NavigationBar />
				<main>
					<article className="py-4 lg:pt-12">
						<div className="container">
							{/* Breadcrumb + article header */}
							<div className="w-full">
								<div className="w-full lg:max-w-3xl">
									<div className="pb-2">
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
													<a
														href="/histories"
														className="breadcrumb__link underline underline-offset-4 text-secondary-500"
													>
														Històries en parella
													</a>
												</li>
											</ul>
										</div>
									</div>
									<h1>{storyDetails.title}</h1>
								</div>
							</div>

							{/* Article cover + subtitle + meta info */}
							<div className="w-full mt-10">
								<div className="flex flex-wrap items-stretch -mx-2.5">
									<div className="w-full lg:w-7/12 px-2.5">
										<picture className="block aspect-w-16 aspect-h-9 h-full rounded-lg overflow-hidden">
											<Image src={coverImg}
												alt={storyDetails.title}
												layout="fill"
												priority={true}
												loading="eager"
												placeholder="blur"
												blurDataURL={coverImg}
											/>
										</picture>
									</div>
									<div className="w-full lg:w-5/12 px-2.5">
										<div className="flex flex-col h-full bg-[#f5f5f5] rounded-lg p-5 lg:p-10 relative z-10">
											<div className="flex-1">
												<p className="text-xl lg:text-2xl font-light mb-4">
													{storyDetails.subtitle}
												</p>
												{/* Informació de l'autor */}
												<div className="lg:mt-3 flex flex-wrap items-center">
													<div className="flex flex-wrap items-center">
														<div className="rounded-full overflow-hidden w-8 h-8 mr-2.5">
															<picture>
																<Image src={coverAuthorImg}
																	alt={storyDetails.owner.fullName}
																	width={32}
																	height={32}
																	priority={true}
																	loading="eager"
																/>
															</picture>
														</div>
														<span className="text-sm">
															{
																storyDetails
																	.owner
																	.fullName
															}
														</span>
														<span className="mx-2 text-sm ">
															·
														</span>
														<span className="text-sm ">
															Publicat el{" "}
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
												</div>
											</div>
											<div className="mt-5 lg:mt-7">
												<ShareBar
													color="text-grey-700"
													iconsSize={20}
												/>
												<span className="block text-xs mt-1.5">
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
												<figcaption className="text-xs text-grey-400 block mt-1.5">
													Foto d' <u>Andrea Prat</u> i{" "}
													<u>Juli Ramon</u> per
													Escapadesenparella.cat
												</figcaption>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Article description */}
							<div className="w-full max-w-full lg:max-w-5xl mx-auto mt-10">
								<div className="listing-description w-full max-w-[55ch] first-letter:text-2xl lg:first-letter:text-4xl first-letter:text-secondary-500">
									{slicedDescription}
								</div>
							</div>
						</div>
					</article>
				</main>
				<section>
					<div className="container">
						<FooterHistoria />
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
