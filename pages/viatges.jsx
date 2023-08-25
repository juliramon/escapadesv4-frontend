import Link from "next/link";
import Footer from "../components/global/Footer";
import NavigationBar from "../components/global/NavigationBar";
import GlobalMetas from "../components/head/GlobalMetas";
import Breadcrumb from "../components/richsnippets/Breadcrumb";
import UserContext from "../contexts/UserContext";
import { useContext, useEffect } from "react";
import ContentService from "../services/contentService";
import TripCategoryBox from "../components/listings/TripCategoryBox";

const Trips = ({ tripCategories, featuredTripCategories }) => {
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
			/>
			<div className="lists">
				<NavigationBar user={user} />
				<main>
					{/* Section cover */}
					<section className="px-6 pt-3">
						<div className="flex flex-wrap items-stretch -mx-3">
							<div className="px-3 w-full lg:w-auto">
								<div className="bg-[#eeeeee] flex items-center justify-center pl-14 pr-16 py-14 rounded-lg md:rounded-2xl h-full">
									<div className="max-w-xs">
										<ul className="breadcrumb mb-3">
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
												<span className="breadcrumb__link active">
													Viatges en parella
												</span>
											</li>
										</ul>
										<h1 className="underlined-element">
											Viatges en parella
										</h1>
										<div className="mt-6 mb-0">
											Descobreix el món amb nosaltres.
											<br />
											T'expliquem els nostres viatges,
											aventures i consells a mesura que
											anem descobrint nous països.
										</div>
									</div>
								</div>
							</div>

							<div className="w-full lg:flex-1 px-3">
								<div className="glide js-slider-featuredTripCategories">
									<div
										className="glide__track"
										data-glide-el="track"
									>
										<div className="glide__slides">
											{featuredTripCategories
												? featuredTripCategories.map(
														(category) => {
															return (
																<div className="rounded-lg lg:rounded-2xl overflow-hidden glide__slide">
																	<div className="flex flex-wrap items-stretch justify-end rounded-lg lg:rounded-2xl overflow-hidden bg-primary-400 relative lg:min-h-[65vh]">
																		<div className="w-full absolute h-full inset-0">
																			<picture className="block w-full h-full relative after:absolute after:inset-0 after:bg-primary-900 after:bg-opacity-20 after:mix-blend-multiply">
																				<img
																					src={
																						category.image
																					}
																					alt={
																						category.title
																					}
																					className="w-full h-full object-cover object-[100%_95%]"
																					loading="eager"
																					fetchpriority="high"
																				/>
																			</picture>
																		</div>
																		<div className="w-full relative z-10">
																			<div className="flex justify-end items-end p-6 h-full ">
																				<Link
																					href={`/viatges/${category.slug}`}
																				>
																					<a className="w-full max-w-sm bg-white p-8 rounded-lg md:rounded-xl">
																						<span className="bg-secondary-600 px-3 py-1 text-xs text-white rounded-md inline-block mb-4">
																							Destacat
																						</span>
																						<h2 className="text-xl my-0 font-medium">
																							{
																								category.title
																							}
																						</h2>
																						<div
																							className="text-block mt-1.5 text-15 text-primary-400 line-clamp-4"
																							dangerouslySetInnerHTML={{
																								__html: category.seoTextHeader,
																							}}
																						></div>

																						<div class="mt-6 flex items-center justify-between">
																							<div class="inline-flex items-center justify-center text-sm leading-tight">
																								<svg
																									xmlns="http://www.w3.org/2000/svg"
																									className="icon icon-tabler icon-tabler-globe mr-1.5"
																									width={
																										15
																									}
																									height={
																										15
																									}
																									viewBox="0 0 24 24"
																									strokeWidth={
																										1.5
																									}
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

																								{
																									category.country
																								}
																							</div>
																							<span class="text-13 text-tertiary-800 group-hover:text-tertiary-900 transition-all duration-300 ease-in-out inline-flex items-center leading-tight">
																								<svg
																									xmlns="http://www.w3.org/2000/svg"
																									class="mr-1"
																									width="15"
																									height="15"
																									viewBox="0 0 24 24"
																									strokeWidth="2"
																									stroke="currentColor"
																									fill="none"
																									stroke-linecap="round"
																									stroke-linejoin="round"
																								>
																									<path
																										stroke="none"
																										d="M0 0h24v24H0z"
																										fill="none"
																									></path>
																									<path d="M12 5l0 14"></path>
																									<path d="M5 12l14 0"></path>
																								</svg>
																								Veure'n
																								més
																							</span>
																						</div>
																					</a>
																				</Link>
																			</div>
																		</div>
																	</div>
																</div>
															);
														}
												  )
												: null}
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Section trips list */}
					<section className="p-6">
						<div className="flex flex-wrap items-stretch -mx-3">
							{tripCategories
								? tripCategories.map((tripCategory) => {
										return (
											<TripCategoryBox
												key={tripCategory.id}
												image={tripCategory.image}
												title={tripCategory.title}
												subtitle={
													tripCategory.seoTextHeader
												}
												slug={tripCategory.slug}
												country={tripCategory.country}
											/>
										);
								  })
								: null}
						</div>
					</section>
				</main>
			</div>
			<Footer />
		</>
	);
};

export async function getServerSideProps({ params }) {
	const service = new ContentService();
	const tripCategories = await service.getTripCategories();
	const featuredTripCategories = await service.getFeaturedTripCategories();

	return {
		props: {
			tripCategories,
			featuredTripCategories,
		},
	};
}

export default Trips;
