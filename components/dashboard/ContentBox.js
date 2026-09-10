import React, { useState } from "react";
import Link from "next/link";
import ContentService from "../../services/contentService";
import ShareModal from "../modals/ShareModal";
import { SeoScoreRing } from "../forms/SeoScore";
import PaymentService from "../../services/paymentService";

const ContentBox = ({
	trip,
	type,
	slug,
	id,
	image,
	title,
	subtitle,
	publicationDate,
	seo = null,
	fetchData,
}) => {
	const [dropdownVisibility, setDropdownVisibility] = useState(false);

	// Hi ha fitxes sense subtítol: `subtitle.slice` les feia petar totes.
	const safeSubtitle = subtitle || "";
	const shortenedSubtitle =
		safeSubtitle.length > 70 ? `${safeSubtitle.slice(0, 70)}…` : safeSubtitle;
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
		} else if (type === "tripEntry") {
			// No hi havia branca per a les entrades de viatge: el botó
			// "Eliminar" del panell d'administració no feia absolutament res.
			service.removeTripEntry(id).then(() => fetchData());
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
	} else if (type === "tripEntry") {
		path = "viatges";
	}

	const urlToShare = `https://escapadesenparella.cat/${path}/${slug}`;

	let url;
	if (type == "tripEntry") {
		url = `/${path}/${trip}/${slug}`;
	}
	if (type != "category" && type != "tripEntry") {
		url = `/${path}/${slug}`;
	}
	if (type == "category") {
		url = `/${slug}`;
	}

	const transformDate = (unformattedDate) =>
		new Date(unformattedDate).toLocaleDateString("ca-ES", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});

	const [shareModalVisibility, setShareModalVisibility] = useState(false);
	const handleShareModalVisibility = () => setShareModalVisibility(true);
	const hideShareModalVisibility = () => setShareModalVisibility(false);

	return (
		<div className="content box flex items-center gap-3 w-full bg-white hover:bg-gray-50 border border-primary-50 rounded-xl mb-2 px-4 py-3 transition-colors">
			<Link href={url}>
				<a className="flex items-center gap-4 min-w-0 flex-1">
					<div className="flex items-center justify-center bg-gray-100 overflow-hidden h-12 w-12 shrink-0 rounded-lg border border-primary-50">
						{image ? (
							<img
								src={image}
								alt={title}
								className="w-full h-full object-cover"
							/>
						) : null}
					</div>
					<div className="min-w-0 flex-1">
						<h3 className="m-0 text-15 font-medium text-primary-500 truncate">
							{title}
						</h3>
						{shortenedSubtitle ? (
							<p className="m-0 text-xs text-primary-400 truncate">
								{shortenedSubtitle}
							</p>
						) : null}
					</div>
					<span className="shrink-0 flex items-center justify-end w-12">
						{seo ? (
							<SeoScoreRing
								score={seo.score}
								level={seo.level}
							/>
						) : (
							<span
								className="text-xs text-primary-300"
								title="Aquest llistat no porta les metadades: obre la fitxa per veure'n el SEO."
							>
								—
							</span>
						)}
					</span>
					<span className="hidden md:block shrink-0 w-28 text-right text-xs text-primary-400">
						{transformDate(publicationDate)}
					</span>
				</a>
			</Link>
			<div className={`dropdown ${dropdownVisibility ? "open" : ""}`}>
				<button
					onClick={() => setDropdownVisibility(!dropdownVisibility)}
				>
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
					<li className="border-b border-primary-50 w-full">
						<Link href={url}>
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
					<li className="border-b border-primary-50 w-full">
						<Link href={url + "/editar"}>
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
									<line
										x1="13.5"
										y1="6.5"
										x2="17.5"
										y2="10.5"
									/>
								</svg>
								Editar
							</a>
						</Link>
					</li>
					<li className="border-b border-primary-50 w-full">
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
						<button
							onClick={removeItem}
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
