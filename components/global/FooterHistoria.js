import React from "react";

const FooterHistoria = () => {
	return (
		<div className="cta-instagram-footer pt-8 pb-14 md:pt-12 md:pb-20 flex flex-col items-center mt-8 md:mt-10 border-t border-primary-100">
			<h2 className="text-center max-w-lg mx-auto">
				Descobreix més escapades com aquesta. Segueix-nos a Instagram!
			</h2>
			<div className="mt-4 mb-1.5">
				<a
					href="https://instagram.com/escapadesenparella"
					title="Segueix Escapadesenparella.cat a Instagram"
					className="flex items-center"
					rel="nofollow"
					target="_blank"
				>
					@escapadesenparella.cat{" "}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="icon icon-tabler icon-tabler-arrow-narrow-right ml-1"
						width="30"
						height="30"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="#F03E51"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<line x1="5" y1="12" x2="19" y2="12" />
						<line x1="15" y1="16" x2="19" y2="12" />
						<line x1="15" y1="8" x2="19" y2="12" />
					</svg>
				</a>
			</div>
			<div className="flex items-center mt-10 banner-wrapper">
				<div className="relative rounded-md overflow-hidden left">
					<img
						src="https://res.cloudinary.com/juligoodie/image/upload/v1610652281/getaways-guru/static-files/escapadesenparella-comes-rubio_luuish.jpg"
						alt=""
					/>
				</div>
				<div className="relative rounded-md overflow-hidden right">
					<img
						src="https://res.cloudinary.com/juligoodie/image/upload/v1610652281/getaways-guru/static-files/escapadesenparella-tossa-mar_m2lvdz.jpg"
						alt=""
					/>
				</div>
			</div>
		</div>
	);
};

export default FooterHistoria;
