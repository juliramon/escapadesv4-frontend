import Link from "next/link";
import Footer from "../components/global/Footer";
import NavigationBar from "../components/global/NavigationBar";
import GlobalMetas from "../components/head/GlobalMetas";
import Breadcrumb from "../components/richsnippets/Breadcrumb";
import UserContext from "../contexts/UserContext";
import { useContext } from "react";
import ContentService from "../services/contentService";
import TripCategoryBox from "../components/listings/TripCategoryBox";

const Trips = ({ tripCategories, featuredTripCategories }) => {
	const { user } = useContext(UserContext);
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
					<section className="px-6 pt-1">
						<div className="glide js-slider-featuredTripCategories">
							<div className="glide__track" data-glide-el="track">
								<div className="glide__slides">
									{featuredTripCategories
										? featuredTripCategories.map(
												(category) => {
													return (
														<div className="rounded-lg lg:rounded-2xl overflow-hidden glide__slide">
															<div className="flex flex-wrap items-stretch justify-end rounded-lg lg:rounded-2xl overflow-hidden bg-primary-400 relative md:min-h-[65vh]">
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
																<div className="w-full md:w-1/3 backdrop-blur-lg relative z-10">
																	<div className="flex justify-center items-end px-12 pt-12 pb-20 h-full">
																		<div className="w-full max-w-sm">
																			<h1 className="text-white md:text-5xl font-headingsCondensed">
																				{
																					category.title
																				}
																			</h1>
																			<div
																				className="text-white mt-6 text-block text-block--xl"
																				dangerouslySetInnerHTML={{
																					__html: category.seoTextHeader,
																				}}
																			></div>

																			<Link href="">
																				<a
																					title=""
																					className="button button__primary button__med mt-8"
																				>
																					Llegir-ne
																					més
																				</a>
																			</Link>
																		</div>
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
