import Link from "next/link";
import { useState } from "react";
import PublicSquareBox from "../../components/listings/PublicSquareBox";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";
import FeaturedStoryBox from "../listings/FeaturedStoryBox";
import "@splidejs/react-splide/css/core";

const HomePageResults = ({
	featuredCategories,
	featuredRegions,
	featuredActivities,
	mostRecentPlaces,
	mostRecentStories,
}) => {
	const initialState = {
		mostRecentGetaways: mostRecentPlaces,
		featuredActivities: featuredActivities,
		featuredRegions: featuredRegions,
		mostRecentStories: mostRecentStories,
		featuredCategories: featuredCategories,
		emptyBlocksPerRow: [0, 1, 2, 3],
	};

	const [state, setState] = useState(initialState);

	const date = new Date();
	const foundationYears = date.getFullYear() - 2015;

	return (
		<div id="homePageResults" className="relative z-30">
			{/* Most recent stories */}
			<section className="pt-12 md:pt-16 lg:pt-20">
				<div className="container">
					<Splide
						options={{
							gap: "20px",
							perMove: 1,
							perPage: 1,
							arrows: true,
							pagination: false,
						}}
						hasTrack={false}
						aria-label="Zones per descobrir"
					>
						<SplideTrack>
							{state.mostRecentStories
								? state.mostRecentStories.map((el, idx) => {
										return (
											<SplideSlide key={idx}>
												<article key={idx}>
													<FeaturedStoryBox
														story={el}
														index={idx}
													/>
												</article>
											</SplideSlide>
										);
								  })
								: null}
						</SplideTrack>
						<div className="splide__arrows absolute top-1/2 -translate-y-1/2 inline-flex flex-col gap-y-4 -right-5 lg:flex-row lg:gap-x-4 lg:right-9 lg:bottom-8 lg:top-auto lg:translate-y-0">
							<button className="splide__arrow splide__arrow--prev ">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-chevron-left"
									width={24}
									height={24}
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path
										stroke="none"
										d="M0 0h24v24H0z"
										fill="none"
									/>
									<path d="M15 6l-6 6l6 6" />
								</svg>
							</button>
							<button className="splide__arrow splide__arrow--next">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-chevron-right"
									width={24}
									height={24}
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path
										stroke="none"
										d="M0 0h24v24H0z"
										fill="none"
									/>
									<path d="M9 6l6 6l-6 6" />
								</svg>
							</button>
						</div>
					</Splide>
				</div>
			</section>

			{/* Text block categories */}
			<section className="pt-12 md:pt-16 lg:pt-32">
				<div className="container">
					<h2 className="text-center max-w-7xl mx-auto mb-8 md:mb-16">
						<span className="font-condensed subtitle block">
							Centenars d'experiències i allotjaments
						</span>

						<div className="flex flex-wrap items-center justify-center mt-6 md:mt-8 gap-y-2.5">
							<span className="inline-block mr-4">
								per a escapades{" "}
							</span>
							{state.featuredCategories.map((el, idx) => {
								const image = el.image;
								const imagePath = image?.substring(0, 51);
								const imageId = image?.substring(63);
								const imageIdWebp = image
									?.substring(63)
									.replace("jpg", "webp");
								const imageImgMobile = `${imagePath}w_32,h_32,c_fill/${imageId}`;
								const imageImgWebpMobile = `${imagePath}f_webp/w_32,h_32,c_fill/${imageIdWebp}`;
								const imageImgWebp = `${imagePath}f_webp/w_80,h_80,c_fill/${imageIdWebp}`;
								const imageImg = `${imagePath}w_80,h_80,c_fill/${imageId}`;

								return (
									<Link href={`/${el.slug}`} key={idx}>
										<a className="underline inline-flex items-center relative mr-2.5 lg:mr-4">
											<picture className="w-8 h-8 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 mr-2.5 lg:mr-4 rounded-md md:rounded-2xl overflow-hidden inline-block rotate-[5deg]">
												<source
													srcSet={imageImgWebpMobile}
													media="(max-width: 768px)"
													type="image/webp"
												/>
												<source
													srcSet={imageImgMobile}
													media="(max-width: 768px)"
												/>
												<source
													srcSet={imageImgWebp}
													media="(min-width: 768px)"
													type="image/webp"
												/>
												<source
													srcSet={imageImg}
													media="(min-width: 768px)"
												/>
												<img
													src={imageImgMobile}
													alt={el.title}
													width={32}
													height={32}
													className="w-full h-full object-cover"
													loading="lazy"
												/>
											</picture>
											{el.pluralName === "aventura"
												? "d'"
												: ""}
											{el.pluralName}
											{idx <
											state.featuredCategories.length - 1
												? ", "
												: ""}
										</a>
									</Link>
								);
							})}
							<span className="inline-flex mr-2.5 lg:mr-4">
								i molt més
							</span>
						</div>
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-4 lg:mt-7">
						{state.mostRecentGetaways.length > 0
							? state.mostRecentGetaways.map((el, idx) => {
									let location;
									if (el.type === "activity") {
										location = (
											<span className="listing-location">{`${
												el.activity_locality ===
												undefined
													? el.activity_state
													: el.activity_locality
											}`}</span>
										);
									}
									if (el.type === "place") {
										location = (
											<span className="listing-location">{`${
												el.place_locality === undefined
													? ""
													: el.place_locality
											}`}</span>
										);
									}
									const priority =
										idx === 0 ? "eager" : "lazy";
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
											imgPriority={priority}
										/>
									);
							  })
							: state.emptyBlocksPerRow.map((el, idx) => (
									<div
										key={idx}
										className="w-full"
										role="status"
									>
										<div className="flex justify-center items-center w-full aspect-[4/3] bg-gray-300 rounded-2xl animate-pulse dark:bg-gray-700">
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
					<div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-4 lg:mt-7">
						{state.featuredActivities.length > 0
							? state.featuredActivities.map((el, idx) => {
									let location;
									if (el.type === "activity") {
										location = (
											<span className="listing-location">{`${
												el.activity_locality ===
												undefined
													? el.activity_state
													: el.activity_locality
											}`}</span>
										);
									}
									if (el.type === "place") {
										location = (
											<span className="listing-location">{`${
												el.place_locality === undefined
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
										className="w-full"
										role="status"
									>
										<div className="flex justify-center items-center w-full aspect-[4/3] bg-gray-300 rounded-2xl animate-pulse dark:bg-gray-700">
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
					<div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 md:mt-12">
						<div className="w-full lg:w-auto">
							<Link href={"/activitats"}>
								<a
									title={
										"Veure més experiències originals a Catalunya"
									}
									className="button button__primary button__lg w-full lg:w-auto text-center justify-center"
								>
									{"Veure experiències"}
								</a>
							</Link>
						</div>
						<div className="w-full lg:w-auto">
							<Link href={"/allotjaments"}>
								<a
									title={
										"Veure allotjaments amb encant a Catalunya"
									}
									className="button button__ghost button__lg w-full lg:w-auto text-center justify-center"
								>
									{"Veure allotjaments"}
								</a>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Featured regions */}
			<section className="py-12 md:pt-16 md:pb-0 lg:pt-20 bg-tertiary-50 md:bg-transparent mt-12 md:mt-0">
				<div className="container">
					<div className="bg-tertiary-50 rounded-2xl md:py-12 lg:py-20 md:px-12 lg:px-16">
						<h2 className="my-0 text-center">
							Escapades per Catalunya
						</h2>
						<p className="mt-4 !mb-0 text-block--xl leading-normal max-w-[55ch] mx-auto text-center">
							Descobreix les millors destinacions per a una
							escapada en parella a Catalunya.
						</p>
						<div className="flex flex-wrap rounded-2xl mt-8 lg:mt-12">
							<Splide
								options={{
									gap: "20px",
									perMove: 1,
									perPage: 4,
									arrows: true,
									pagination: false,
									breakpoints: {
										1024: {
											perPage: 3,
										},
										768: {
											perPage: 2,
										},
										640: {
											perPage: 1,
										},
									},
								}}
								hasTrack={false}
								aria-label="Zones per descobrir"
							>
								<SplideTrack>
									{state.featuredRegions
										? state.featuredRegions.map(
												(el, idx) => {
													return (
														<SplideSlide key={idx}>
															<article>
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
																		className="flex flex-wrap items-center rounded-xl overflow-hidden"
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
																					390
																				}
																				height={
																					525
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
								<div className="splide__arrows absolute top-1/2 -translate-y-1/2 inline-flex flex-col gap-y-4 -right-5 lg:flex-row lg:gap-x-4 lg:right-9 lg:bottom-8 lg:top-auto lg:translate-y-0">
									<button className="splide__arrow splide__arrow--prev">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-chevron-left"
											width={24}
											height={24}
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											/>
											<path d="M15 6l-6 6l6 6" />
										</svg>
									</button>
									<button className="splide__arrow splide__arrow--next">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-chevron-right"
											width={24}
											height={24}
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											/>
											<path d="M9 6l6 6l-6 6" />
										</svg>
									</button>
								</div>
							</Splide>
						</div>
					</div>
				</div>
			</section>

			{/* About us section */}
			<section className="py-12 md:py-16 lg:py-20">
				<div className="container">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-9">
						<div className="relative h-full col-span-1 order-2">
							<picture className="block aspect-[4/3] lg:col-span-7 w-full h-full">
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
									className="w-full h-full object-cover rounded-2xl"
									loading="lazy"
								/>
							</picture>
						</div>
						<div className="col-span-1 order-1">
							<div className="relative h-full md:px-16 2xl:px-20 overflow-hidden flex items-center justify-center lg:justify-start">
								<div className="relative z-10 md:min-h-[150px] lg:min-h-[300px] flex items-center justify-center rounded-2xl bg-white md:p-10">
									<div className="max-w-[33rem]">
										<h2 className="mb-4 md:mb-7">
											{foundationYears} anys d'escapades
											en escapades en parella a Catalunya
										</h2>
										<p className="text-block leading-normal">
											Fa {foundationYears} anys vam
											començar a compartir les escapades
											en parella que fèiem arreu de
											Catalunya, amb l'objectiu de fer-vos
											gaudir de{" "}
											<strong>
												caps de setmana originals
											</strong>
											, de sortir a{" "}
											<strong>descobrir Catalunya</strong>
											, de compartir{" "}
											<strong>
												ofertes de cap de setmana a
												Catalunya
											</strong>
											, i sobretot donar a conèixer llocs
											únics i{" "}
											<strong>
												experiències per gaudir en
												parella
											</strong>
											, perquè crèiem, i seguim creient,
											que hi ha vida més enllà d'anar al
											cinema o veure Netflix al sofà.
										</p>
										<p className="text-block leading-normal mb-0">
											A dia d'avui estem encantats de
											poder seguir compartint amb tots
											vosaltres les{" "}
											<strong>
												millors escapades en parella a
												Catalunya
											</strong>
											. Perquè per nosaltres,
											Escapadesenparella.cat és molt més
											que escapades en parella; esperem
											transmetre't aquest sentiment!
										</p>
										<a
											href="/sobre-nosaltres"
											title="Conèix-nos millor"
											className="button button__primary button__lg mt-4 md:mt-7"
										>
											Conèix-nos millor
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default HomePageResults;
