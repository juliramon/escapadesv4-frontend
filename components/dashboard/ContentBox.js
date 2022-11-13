import React, { useState } from "react";
import Link from "next/link";
import ContentService from "../../services/contentService";
import ShareModal from "../modals/ShareModal";
import PaymentService from "../../services/paymentService";

const ContentBox = ({
	type,
	slug,
	id,
	image,
	title,
	subtitle,
	publicationDate,
	fetchData,
}) => {
	const [dropdownVisibility, setDropdownVisibility] = useState(false);

	const shortenedSubtitle = subtitle.slice(0, 70);
	const service = new ContentService();
	const paymentService = new PaymentService();
	const removeItem = () => {
		if (type === "activity") {
			service.removeActivity(id).then(() => {
				fetchData();
				paymentService.editUserSubscription();
			});
		} else if (type === "place") {
			service.removePlace(id).then(() => {
				fetchData();
				paymentService.editUserSubscription();
			});
			paymentService.editUserSubscription();
		} else if (type === "story") {
			service.removeStory(id).then(() => fetchData());
		} else if (type === "list") {
			service.removeList(id).then(() => fetchData());
		}
	};
	let path;
	if (type === "activity") {
		path = "activitats";
	} else if (type === "place") {
		path = "allotjaments";
	} else if (type === "story") {
		path = "histories";
	} else if (type === "list") {
		path = "llistes";
	}

	const urlToShare = `https://escapadesenparella.cat/${path}/${slug}`;

	const transformDate = (unformattedDate) => {
		let modpublicationDate = new Date(unformattedDate);
		const getYear = modpublicationDate.getFullYear();
		const getMonth = modpublicationDate.getMonth();
		const getDay = modpublicationDate.getDate();
		return `${getDay}/${getMonth + 1}/${getYear}`;
	};

	const [shareModalVisibility, setShareModalVisibility] = useState(false);
	const handleShareModalVisibility = () => setShareModalVisibility(true);
	const hideShareModalVisibility = () => setShareModalVisibility(false);

	console.log(type);

	return (
		<div className="content rounded box flex items-center w-full bg-primary-100 bg-opacity-50 border border-primary-300 mb-2.5 px-5 py-4">
			<Link href={type != "category" ? `/${path}/${slug}` : `/${slug}`}>
				<a className="flex items-center justify-between w-full">
					<div className="flex items-center justify-center bg-white overflow-hidden h-12 w-12 rounded-md p-0 mr-5 border border-primary-300">
						<img
							src={image}
							alt={title}
							className="w-full h-full object-cover"
						/>
					</div>
					<h3 className="text-lg m-0 pr-5 w-96">{title}</h3>
					<span className="m-0 pr-16 text-sm flex-1">
						{shortenedSubtitle}...
					</span>
					<span className="m-0 text-sm pr-5 block w-32">
						{transformDate(publicationDate)}
					</span>
				</a>
			</Link>
			<div className={`dropdown ${dropdownVisibility ? "open" : ""}`}>
				<button onClick={() => setDropdownVisibility(!dropdownVisibility)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="dropdown__icon"
						width="28"
						height="28"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						stroke="#00206B"
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" />
						<circle cx="5" cy="12" r="1" />
						<circle cx="12" cy="12" r="1" />
						<circle cx="19" cy="12" r="1" />
					</svg>
				</button>
				<ul
					className={`dropdown__menu ${
						dropdownVisibility ? "block" : "hidden"
					}`}
				>
					<li className="border-b border-primary-300 w-full">
						<Link href={`/${path}/${slug}`}>
							<a className="dropdown__menu_item">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="dropdown__menu_icon"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="#00206B"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" />
									<circle cx="12" cy="12" r="2" />
									<path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />
									<path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" />
								</svg>
								Visualitzar
							</a>
						</Link>
					</li>
					<li className="border-b border-primary-300 w-full">
						<Link href={`/${path}/${slug}/editar`}>
							<a className="dropdown__menu_item">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="dropdown__menu_icon"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="#00206B"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" />
									<path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
									<line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
								</svg>
								Editar
							</a>
						</Link>
					</li>
					<li className="border-b border-primary-300 w-full">
						<button
							onClick={() => handleShareModalVisibility()}
							className="dropdown__menu_item"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="dropdown__menu_icon"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="#00206B"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path stroke="none" d="M0 0h24v24H0z" />
								<circle cx="6" cy="12" r="3" />
								<circle cx="18" cy="6" r="3" />
								<circle cx="18" cy="18" r="3" />
								<line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
								<line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
							</svg>
							Compartir
						</button>
					</li>
					<li>
						<button onClick={removeItem} className="dropdown__menu_item">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="dropdown__menu_icon"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="#00206B"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path stroke="none" d="M0 0h24v24H0z" />
								<line x1="4" y1="7" x2="20" y2="7" />
								<line x1="10" y1="11" x2="10" y2="17" />
								<line x1="14" y1="11" x2="14" y2="17" />
								<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
								<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
							</svg>
							Eliminar
						</button>
					</li>
				</ul>
			</div>
			<ShareModal
				visibility={shareModalVisibility}
				hideModal={hideShareModalVisibility}
				url={urlToShare}
			/>
		</div>
	);
};

export default ContentBox;
