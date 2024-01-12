const ListingHeader = ({ title, subtitle, sponsorData }) => {
	return (
		<section className="py-5">
			<div className="container px-0">
				<div className="flex flex-wrap items-center justify-between ">
					<div className="w-full md:w-1/2 max-w-md">
						<h1
							className="my-0"
							dangerouslySetInnerHTML={{ __html: title }}
						></h1>
						<div className="text-block mt-2.5" dangerouslySetInnerHTML={{ __html: subtitle }}></div>
					</div>
					<div
						className="py-1.5 md:py-2.5 w-full md:w-1/2"
					></div>
				</div>
			</div>
		</section>
	);
};

export default ListingHeader;
