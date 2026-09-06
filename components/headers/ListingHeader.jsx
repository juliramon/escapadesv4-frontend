const ListingHeader = ({
	title,
	subtitle,
	textHeader,
	sponsorData,
	breadcrumbLevel1,
	breadcrumbLevel2,
}) => {
	return (
		<>
			{/* Listing heading + subtitle + meta info */}
			<section className="pt-8 md:pt-12 lg:pt-20">
				<div className="container">
					<ul className="breadcrumb justify-center">
						<li className="breadcrumb__item">
							<a
								href="/"
								title="Inici"
								className="breadcrumb__link"
							>
								Inici
							</a>
						</li>
						{breadcrumbLevel1 ? (
							<li className="breadcrumb__item">
								<span className="breadcrumb__link active">
									{breadcrumbLevel1}
								</span>
							</li>
						) : null}
						{breadcrumbLevel2 ? (
							<li className="breadcrumb__item">
								<span className="breadcrumb__link active">
									{breadcrumbLevel2}
								</span>
							</li>
						) : null}
					</ul>
					<div className="md:max-w-xl lg:max-w-5xl mx-auto text-center mt-4">
						<h1
							className="my-0 text-balance"
							dangerouslySetInnerHTML={{ __html: title }}
						></h1>
						{subtitle ? (
							<div
								className="mt-4 !mb-0 text-block--xl leading-normal max-w-[55ch] mx-auto [&>p]:inline"
								dangerouslySetInnerHTML={{ __html: subtitle }}
							></div>
						) : null}
						{textHeader ? (
							<div
								className="!mb-0 text-block--xl leading-normal max-w-[55ch] mx-auto [&>p]:inline"
								dangerouslySetInnerHTML={{ __html: textHeader }}
							></div>
						) : null}
						{/* Les pàgines de categoria i destinació ja passaven aquest
						    bloc, però el component no el rebia i el patrocini no
						    es renderitzava enlloc. */}
						{sponsorData ? (
							<div className="mt-6 flex justify-center">
								{sponsorData}
							</div>
						) : null}
					</div>
				</div>
			</section>
		</>
	);
};

export default ListingHeader;
