import React, { useState } from "react";
import { useCookies } from "react-cookie";

const FollowBox = () => {
	const [cookies, setCookie, removeCookie] = useCookies("");
	const initialState = {
		boxVisible: true,
	};
	const [state, setState] = useState(initialState);

	let cookieCreationDate = new Date();
	let cookieExpirationDate = new Date();
	cookieExpirationDate.setDate(cookieCreationDate.getDate() + 6);

	const closeBox = () => {
		setState({ ...state, boxVisible: false });
		setCookie("followBox", "false", { expires: cookieExpirationDate });
	};

	if (state.boxVisible || cookies.followBox === "true") {
		return (
			<div className="flex items-center fixed right-4 left-4 bottom-4 md:bottom-5 md:right-auto md:left-1/2 md:-translate-x-1/2 z-50 bg-white py-4 pl-4 pr-8 rounded-md shadow-xl">
				<button
					onClick={() => closeBox()}
					className="absolute top-0 -translate-y-1/2 right-0 translate-x-1/2 bg-white rounded-full p-0.5 shadow-lg"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="icon icon-tabler icon-tabler-x"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="#00206B"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>

				<div className="w-28 h-28 rounded-md overflow-hidden">
					<picture>
						<source srcSet="./cover-instagram-escapadesenparella.jpg" />
						<img
							src="./cover-instagram-escapadesenparella.jpg"
							data-src="./cover-instagram-escapadesenparella.jpg"
							alt="Segueix @escapadesenparella a Instagram"
							className="w-full h-full object-cover"
							width="110"
							height="110"
							loading="lazy"
						/>
					</picture>
				</div>

				<div className="ml-5 flex-1">
					<h3 className="text-base font-normal max-w-[250px]">
						Les millors escapades en parella també a Instagram
					</h3>
					<a
						href="https://instagram.com/escapadesenparella"
						title="Segueix-nos a Instagram"
						className="bg-primary-300 hover:bg-primary-500 hover:text-white transition-all duration-300 ease-in-out py-2 px-4 text-sm mt-3 inline-flex items-center rounded-md"
						onClick={() => closeBox()}
						rel="nofollow noreferrer"
						target="_blank"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="mr-1.5"
							width={24}
							height={24}
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							fill="none"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<rect x={4} y={4} width={16} height={16} rx={4}></rect>
							<circle cx={12} cy={12} r={3}></circle>
							<line x1="16.5" y1="7.5" x2="16.5" y2="7.501"></line>
						</svg>
						Segueix-nos
					</a>
				</div>
			</div>
		);
	} else {
		return null;
	}
};

export default FollowBox;
