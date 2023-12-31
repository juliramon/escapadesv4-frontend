import Link from "next/link";
import { useEffect, useState } from "react";
import PublicSquareBox from "../../components/listings/PublicSquareBox";
import StoryListing from "../listings/StoryListing";
import { Splide, SplideTrack, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/core';

const HomePageResults = ({
	featuredRegions,
	featuredActivities,
	mostRecentPlaces,
	mostRecentStories,
}) => {
	const initialState = {
		mostRecentGetaways: [],
		featuredActivities: [],
		featuredRegions: [],
		mostRecentStories: [],
		emptyBlocksPerRow: [0, 1, 2, 3],
	};
	const [state, setState] = useState(initialState);

	useEffect(() => {
		if (
			mostRecentPlaces.length > 0 ||
			featuredActivities.length > 0 ||
			mostRecentPlaces.length > 0 ||
			mostRecentStories.length > 0 ||
			featuredRomanticGetaways.length > 0 ||
			featuredAdventureGetaways.length > 0 ||
			featuredGastronomicGetaways.length > 0
		) {
			setState({
				...state,
				featuredActivities: featuredActivities,
				mostRecentGetaways: mostRecentPlaces,
				featuredRegions: featuredRegions,
				mostRecentGetaways: mostRecentPlaces,
				featuredActivities: featuredActivities,
				mostRecentStories: mostRecentStories,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const date = new Date();
	const foundationYears = date.getFullYear() - 2015;

	return (
		<div id="homePageResults" className="relative z-30">
			<div className="container">
				<div className="w-full">
					{/* Most recent places */}
					<section className="pt-12 lg:pt-16">
						<h2 className="mb-0">
							Allotjaments afegits recentment
						</h2>
						<div className="flex flex-wrap items-start -mx-1.5 mt-4">
							{state.mostRecentGetaways.length > 0
								? state.mostRecentGetaways.map((el, idx) => {
									let location;
									if (el.type === "activity") {
										location = (
											<span className="listing-location">{`${el.activity_locality ===
												undefined
												? el.activity_state
												: el.activity_locality
												}`}</span>
										);
									}
									if (el.type === "place") {
										location = (
											<span className="listing-location">{`${el.place_locality ===
												undefined
												? ""
												: el.place_locality
												}`}</span>
										);
									}
									return (
										<PublicSquareBox
											key={el._id}
											type={el.type}
											slug={el.slug}
											id={el._id}
											cover={el.cover}
											title={el.title}
											subtitle={el.subtitle}
											rating={
												el.activity_rating ||
												el.place_rating
											}
											placeType={el.placeType}
											categoria={el.categories}
											duration={el.duration}
											location={location}
											isVerified={el.isVerified}
											website={el.website}
											phone={el.phone}
										/>
									);
								})
								: state.emptyBlocksPerRow.map((el, idx) => (
									<div
										key={idx}
										className="w-full md:w-1/2 lg:w-1/4 px-2"
										role="status"
									>
										<div className="flex justify-center items-center max-w-sm h-56 bg-gray-300 rounded-md animate-pulse dark:bg-gray-700">
											<div className="flex justify-center items-center w-full h-48 bg-gray-300 rounded-md sm:w-96 dark:bg-gray-700">
												<svg
													className="w-12 h-12 text-gray-200"
													xmlns="http://www.w3.org/2000/svg"
													aria-hidden="true"
													fill="currentColor"
													viewBox="0 0 640 512"
												>
													<path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
												</svg>
											</div>
											<span className="sr-only">
												Loading...
											</span>
										</div>
									</div>
								))}
						</div>
						<a
							href="/allotjaments"
							title="Veure més allotjaments amb encant a Catalunya"
							className="button button__ghost button__med text-[16px] inline-flex items-center mt-4 transition-all duration-300 ease-in-out"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="mr-1.5"
								width={20}
								height={20}
								viewBox="0 0 24 24"
								strokeWidth="2"
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
								<path d="M9 6l6 6l-6 6"></path>
							</svg>
							Veure'n més
						</a>
					</section>

					{/* Featured activities */}
					<section className="pt-12 lg:pt-16">
						<h2 className="mb-0">
							Experiències en parella a Catalunya
						</h2>
						<div className="flex flex-wrap items-start -mx-1.5 mt-4">
							{state.featuredActivities.length > 0
								? state.featuredActivities.map((el, idx) => {
									let location;
									if (el.type === "activity") {
										location = (
											<span className="listing-location">{`${el.activity_locality ===
												undefined
												? el.activity_state
												: el.activity_locality
												}`}</span>
										);
									}
									if (el.type === "place") {
										location = (
											<span className="listing-location">{`${el.place_locality ===
												undefined
												? ""
												: el.place_locality
												}`}</span>
										);
									}
									return (
										<PublicSquareBox
											key={el._id}
											type={el.type}
											slug={el.slug}
											id={el._id}
											cover={el.cover}
											title={el.title}
											subtitle={el.subtitle}
											rating={
												el.activity_rating ||
												el.place_rating
											}
											placeType={el.placeType}
											categoria={el.categories}
											duration={el.duration}
											location={location}
											isVerified={el.isVerified}
											website={el.website}
											phone={el.phone}
										/>
									);
								})
								: state.emptyBlocksPerRow.map((el, idx) => (
									<div
										key={idx}
										className="w-full md:w-1/2 lg:w-1/4 px-2"
										role="status"
									>
										<div className="flex justify-center items-center max-w-sm h-56 bg-gray-300 rounded-md animate-pulse dark:bg-gray-700">
											<div className="flex justify-center items-center w-full h-48 bg-gray-300 rounded-md sm:w-96 dark:bg-gray-700">
												<svg
													className="w-12 h-12 text-gray-200"
													xmlns="http://www.w3.org/2000/svg"
													aria-hidden="true"
													fill="currentColor"
													viewBox="0 0 640 512"
												>
													<path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
												</svg>
											</div>
											<span className="sr-only">
												Loading...
											</span>
										</div>
									</div>
								))}
						</div>
						<a
							href="/escapades-romantiques"
							title="Veure més escapades romàntiques"
							className="button button__ghost button__med text-[16px] inline-flex items-center mt-2.5 transition-all duration-300 ease-in-out"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="mr-1.5"
								width={20}
								height={20}
								viewBox="0 0 24 24"
								strokeWidth="2"
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
								<path d="M9 6l6 6l-6 6"></path>
							</svg>
							Veure'n més
						</a>
					</section>

					{/* Featured regions */}
					<section className="pt-12 pb-6 lg:pt-16">
						<h2 className="mb-0">
							Zones per descobrir
						</h2>
						<div className="flex flex-wrap mt-4">
							<Splide options={{
								gap: "20px",
								perMove: 1,
								perPage: 4,
								arrows: true,
								breakpoints: {
									1024: {
										perPage: 3
									},
									768: {
										perPage: 2
									},
									640: {
										perPage: 1
									}
								}
							}} hasTrack={false} aria-label="Zones per descobrir">
								<SplideTrack>
									{state.featuredRegions
										? state.featuredRegions.map(
											(el, idx) => {
												return (
													<SplideSlide key={idx}>
														<article >
															<Link
																href={
																	"escapades-catalunya/" +
																	el.slug
																}
															>
																<a
																	title={
																		el.title
																	}
																	className="flex flex-wrap items-center shadow-md rounded-md overflow-hidden"
																>
																	<picture className="block w-full h-full overflow-hidden">
																		<img
																			src={
																				el.image
																			}
																			alt={
																				el.title
																			}
																			className="w-full h-full object-cover"
																			width={
																				48
																			}
																			height={
																				48
																			}
																			loading="lazy"
																		/>
																	</picture>
																</a>
															</Link>
														</article>
													</SplideSlide>
												);
											}
										)
										: null}
								</SplideTrack>
								<div className="splide__arrows">
									<button className="splide__arrow splide__arrow--prev w-12 h-12 bg-white rounded-full shadow flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2">
										<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-left" width={24} height={24} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path d="M15 6l-6 6l6 6" />
										</svg>
									</button>
									<button className="splide__arrow splide__arrow--next w-12 h-12 bg-white rounded-full shadow flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2">
										<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-right" width={24} height={24} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path d="M9 6l6 6l-6 6" />
										</svg>
									</button>
								</div>
							</Splide>
						</div>
					</section>

					{/* About us section */}
					<section className="pt-12 lg:pt-16">
						<div className="container">
							<div className="flex flex-wrap items-center justify-start overflow-hidden relative rounded-md lg:py-12 lg:pr-20">
								<div className="relative lg:absolute inset-0 rounded-md overflow-hidden flex justify-end">
									<div className="w-full lg:w-8/12 rounded-md overflow-hidden">
										<picture>
											<source
												srcSet="../../home-about-s-m.webp"
												media="(max-width: 768px)"
												type="image/webp"
											/>
											<source
												srcSet="../../home-about-s-m.jpg"
												media="(max-width: 768px)"
											/>
											<source
												srcSet="../../home-about-s.webp"
												media="(min-width: 768px)"
												type="image/webp"
											/>
											<source
												srcSet="../../home-about-s.webp"
												media="(max-width: 768px)"
											/>
											<img
												src="../../home-about-s.jpg"
												alt="Escapades en parella, i molt més"
												width="400"
												height="300"
												className="w-full h-full object-cover"
												loading="lazy"
											/>
										</picture>
									</div>
								</div>
								<div className="w-full lg:w-6/12 rounded-md bg-white relative z-10 lg:shadow-lg overflow-hidden pt-8 lg:px-8 lg:pb-8">
									<h2 className="mb-4">
										Allotjaments amb encant i experiències originals per a les parelles més exigent
									</h2>
									<p className="text-[16px]">
										Fa {foundationYears} anys vam començar a
										compartir les escapades en parella que
										fèiem arreu de Catalunya, amb l'objectiu
										de motivar a sortir a{" "}
										<strong>descobrir Catalunya</strong>, i
										donar a conèixer llocs únics per gaudir
										en parella, perquè crèiem, i seguim
										creient, que hi ha vida més enllà d'anar
										al cinema o veure Netflix al sofà.
									</p>
									<p className="text-[16px] mb-0">
										A dia d'avui estem encantats de poder
										seguir compartint amb tots vosaltres les{" "}
										<strong>
											millors escapades en parella a
											Catalunya
										</strong>
										, així que gràcies per ser aquí llegint
										aquesta nota. Perquè per nosaltres,
										Escapadesenparella.cat és molt més que
										escapades en parella; esperem
										transmetre't aquest sentiment!
									</p>
									<div className="mt-6">
										<a
											href="/contacte"
											title="Contacta'ns"
											className="button button__primary button__med px-8"
										>
											Contacta'ns
										</a>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Most recent stories */}
					<section className="py-12 lg:py-16">
						<h2 className="mb-0">
							Últimes entrades al blog d' "Històries en parella"
						</h2>
						<div className="flex flex-wrap items-start mt-2 -mx-1.5">
							{state.mostRecentStories.length > 0
								? state.mostRecentStories.map((story, idx) => {
									return (
										<article
											key={idx}
											className="w-full md:w-1/2 lg:w-1/3 px-2.5 py-2 mb-4 lg:mb-0"
										>
											<StoryListing
												story={story}
												index={idx}
											/>
										</article>
									);
								})
								: ""}
						</div>
						<a
							href="/histories"
							title="Veure més històries"
							className="button button__ghost button__med text-[16px] inline-flex items-center mt-2.5 transition-all duration-300 ease-in-out"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="mr-1.5"
								width={20}
								height={20}
								viewBox="0 0 24 24"
								strokeWidth="2"
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
								<path d="M9 6l6 6l-6 6"></path>
							</svg>
							Veure'n més
						</a>
					</section>
				</div>
			</div>
		</div>
	);
};

export default HomePageResults;
