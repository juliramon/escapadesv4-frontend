import Link from "next/link";

const Hero = () => {
	const heroText = {
		title: `La vostra propera escapada en parella comença aquí`,
		description: `Troba experiències i allotjaments amb encant per una escapada inoblidable`,
		button_link_1: "/activitats",
		button_text_1: "Veure experiències",
		button_title_1: "Veure experiències originals a Catalunya",
		button_link_2: "/allotjaments",
		button_text_2: "Veure allotjaments",
		button_title_2: "Veure allotjaments amb encant a Catalunya",
	};
	return (
		<>
			<section
				id="hero"
				className="flex items-stretch pt-8 md:pt-12 lg:pt-20"
			>
				<div className="container">
					<div className="flex flex-wrap items-stretch">
						<div className="w-full relative z-10">
							<div className="relative h-full overflow-hidden flex items-center justify-center text-center">
								<div className="relative z-10 flex items-center justify-center">
									<div className="">
										<div className="breadcrumb justify-center text-sm">
											<div className="inline-flex items-center bg-gray-100 hover:bg-gray-200 transition-all duration-300 ease-in-out rounded-full pr-2.5">
												<Link href="/descomptes-viatjar">
													<a className="inline-flex items-center active">
														<span className="bg-secondary-800 inline-flex items-center px-2.5 py-2 rounded-full text-white mr-2">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width={16}
																height={16}
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth={2}
																strokeLinecap="round"
																strokeLinejoin="round"
															>
																<path
																	stroke="none"
																	d="M0 0h24v24H0z"
																	fill="none"
																/>
																<path d="M17 17m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
																<path d="M7 7m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
																<path d="M6 18l12 -12" />
															</svg>
															<span className="hidden md:inline-block md:ml-1">
																Descomptes
															</span>
														</span>
														Estalvia amb els
														descomptes per viatjar
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width={16}
															height={16}
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															strokeWidth={2}
															strokeLinecap="round"
															strokeLinejoin="round"
															className="ml-1"
														>
															<path
																stroke="none"
																d="M0 0h24v24H0z"
																fill="none"
															/>
															<path d="M9 6l6 6l-6 6" />
														</svg>
													</a>
												</Link>
											</div>
										</div>
										<h1
											className="mt-4 lg:mt-6 mb-0"
											dangerouslySetInnerHTML={{
												__html: heroText.title,
											}}
										></h1>
										<p
											className="mt-4 !mb-0 text-block--xl leading-normal max-w-[55ch] mx-auto"
											dangerouslySetInnerHTML={{
												__html: heroText.description,
											}}
										></p>
										<div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 md:mt-7">
											<div className="w-full lg:w-auto">
												<Link
													href={
														heroText.button_link_1
													}
												>
													<a
														title={
															heroText.button_title_1
														}
														className="button button__primary button__lg w-full lg:w-auto text-center justify-center"
													>
														{heroText.button_text_1}
													</a>
												</Link>
											</div>
											<div className="w-full lg:w-auto">
												<Link
													href={
														heroText.button_link_2
													}
												>
													<a
														title={
															heroText.button_title_2
														}
														className="button button__ghost button__lg w-full lg:w-auto text-center justify-center"
													>
														{heroText.button_text_2}
													</a>
												</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Hero;
