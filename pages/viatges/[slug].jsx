import React, { useContext, useEffect } from "react";
import ContentService from "../../services/contentService";
import GlobalMetas from "../../components/head/GlobalMetas";
import Breadcrumb from "../../components/richsnippets/Breadcrumb";
import NavigationBar from "../../components/global/NavigationBar";
import Footer from "../../components/global/Footer";
import UserContext from "../../contexts/UserContext";

const CategoryTrip = ({
	categoryDetails,
	allResults,
	paginatedResults,
	totalItems,
	numPages,
}) => {
	const { user } = useContext(UserContext);
	useEffect(() => {
		const underlinedElement = document.querySelector(".underlined-element");
		if (!underlinedElement) return;

		underlinedElement.classList.add("active");
	});
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
			<Breadcrumb
				page1Title="Inici"
				page1Url="https://escapadesenparella.cat"
				page2Title="Viatges en parella"
				page2Url={`https://escapadesenparella.cat/viatges`}
				page3Title={categoryDetails.title}
				page3Url={`https://escapadesenparella.cat/viatges/${categoryDetails.slug}`}
			/>
			<div className="tripCategory">
				<NavigationBar user={user} />
				<main>
					{/* Section cover */}
					<section className="px-6 pt-1">
						<div className="rounded-lg lg:rounded-2xl overflow-hidden">
							<div className="flex flex-wrap items-stretch justify-end rounded-lg lg:rounded-2xl overflow-hidden bg-primary-400 relative md:min-h-[65vh]">
								<div className="w-full absolute h-full inset-0">
									<picture className="block w-full h-full relative after:absolute after:inset-0 after:bg-primary-900 after:bg-opacity-50 after:mix-blend-multiply">
										<img
											src={categoryDetails.image}
											alt={categoryDetails.title}
											className="w-full h-full object-cover object-[100%_95%]"
											loading="eager"
											fetchpriority="high"
										/>
									</picture>
								</div>
								<div className="w-full relative z-10">
									<div className="flex justify-center items-center pt-20 px-12 pb-12 h-full">
										<div className="w-full max-w-xl">
											<ul className="breadcrumb text-white justify-center mb-12">
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
														href="/viatges"
														className="breadcrumb__link"
													>
														Viatges en parella
													</a>
												</li>
												<li className="breadcrumb__item">
													<span className="breadcrumb__link active">
														{categoryDetails.title}
													</span>
												</li>
											</ul>
											<div class="mb-4 flex items-center justify-center">
												<div class="flex items-center justify-center leading-tight text-white text-center">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="icon icon-tabler icon-tabler-globe mr-1.5"
														width={20}
														height={20}
														viewBox="0 0 24 24"
														stroke-width={1.5}
														stroke="currentColor"
														fill="none"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path
															stroke="none"
															d="M0 0h24v24H0z"
															fill="none"
														></path>
														<path d="M7 9a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
														<path d="M5.75 15a8.015 8.015 0 1 0 9.25 -13"></path>
														<path d="M11 17v4"></path>
														<path d="M7 21h8"></path>
													</svg>
													{categoryDetails.country}
												</div>
											</div>
											<div class="flex justify-center">
												<h1 className="my-0 font-medium text-center text-white underlined-element">
													{categoryDetails.title}
												</h1>
											</div>
											<div
												className="text-block--xl mt-6 text-white text-center"
												dangerouslySetInnerHTML={{
													__html: categoryDetails.seoTextHeader,
												}}
											></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Section intro */}
					<section className="py-10 md:py-16">
						<div className="container">
							<div className="w-full max-w-6xl mx-auto">
								<div className="flex flex-wrap items-center -mx-4">
									<div className="w-full lg:w-1/2 px-4 mb-8">
										<div
											className="text-block pr-12"
											dangerouslySetInnerHTML={{
												__html: categoryDetails.seoText,
											}}
										></div>
									</div>
									{categoryDetails.mapLocation ? (
										<div className="w-full lg:w-1/2 px-4">
											<div
												className="aspect-w-16 aspect-h-9 rounded-lg md:rounded-2xl overflow-hidden"
												dangerouslySetInnerHTML={{
													__html: categoryDetails.mapLocation,
												}}
											></div>
										</div>
									) : null}
								</div>
							</div>
						</div>
					</section>

					{/* Section results list */}
				</main>
			</div>
			<Footer />
		</>
	);
};

export async function getStaticPaths() {
	const service = new ContentService();
	const tripCategories = await service.getTripCategories();
	const paths = tripCategories.map((categoria) => ({
		params: { slug: categoria.slug },
	}));
	return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
	const service = new ContentService();
	const categoryDetails = await service.getTripCategoryDetails(params.slug);
	// let { allResults, paginatedResults, totalItems, numPages } =
	// 	await service.getTripCategoryResults(categoryDetails.title);

	if (!categoryDetails) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			categoryDetails,
			// allResults,
			// paginatedResults,
			// totalItems,
			// numPages,
		},
		revalidate: 120,
	};
}

export default CategoryTrip;
