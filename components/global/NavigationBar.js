import Router from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import UserContext from "../../contexts/UserContext";
import ContentBar from "../homepage/ContentBar";
import VerticalsNav from "./VerticalsNav";
import {
	DESTINATIONS,
	GETAWAY_CATEGORIES,
	STAY_CATEGORIES,
	VERTICALS,
} from "../../utils/siteTaxonomy";

const ADMIN_PANEL_URL = "/2i8ZXlkM4cFKUPBrm3-admin-panel";

/** Icona del quadre de comandament. */
const DashboardIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.6"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<rect x="4" y="4" width="6" height="6" rx="1" />
		<rect x="14" y="4" width="6" height="6" rx="1" />
		<rect x="4" y="14" width="6" height="6" rx="1" />
		<rect x="14" y="14" width="6" height="6" rx="1" />
	</svg>
);

const NavigationBar = () => {
	const { user } = useContext(UserContext);
	const searchInputRef = useRef(null);

	// `_app` llegeix la sessió del localStorage mentre renderitza, de manera
	// que al client ja hi és al primer render i al servidor no. Pintar
	// l'enllaç abans d'hidratar trencaria la hidratació de totes les pàgines,
	// així que s'espera a tenir el component muntat.
	const [hasMounted, setHasMounted] = useState(false);
	useEffect(() => setHasMounted(true), []);

	// El panell només carrega per als comptes d'administrador; ensenyar-hi
	// l'enllaç a la resta els deixaria en un spinner que no acaba mai.
	const isAdmin = hasMounted && Boolean(user) && user.userType === "admin";

	const initialState = {
		searchQuery: "",
		isResponsiveMenuOpen: false,
		isSearchPanelOpen: false,
		isMenuDropdownOpen: false,
		isCategoriesDropdownOpen: false,
	};
	const [state, setState] = useState(initialState);

	const handleKeyPress = (e) => {
		let searchQuery = e.target.value;
		setState({ ...state, searchQuery: searchQuery });
		if (e.keyCode === 13) {
			e.preventDefault();
			Router.push(`/search?query=${searchQuery}`);
		}
	};

	const handleSearchSubmit = (e) => {
		if (state.searchQuery !== "") {
			Router.push(`/search?query=${state.searchQuery}`);
		} else {
			e.preventDefault();
			searchInputRef.current.focus();
		}
	};

	const handleResponsiveMenu = () =>
		!state.isResponsiveMenuOpen
			? setState({ ...state, isResponsiveMenuOpen: true })
			: setState({ ...state, isResponsiveMenuOpen: false });

	const handleSearchPanel = () =>
		!state.isSearchPanelOpen
			? setState({ ...state, isSearchPanelOpen: true })
			: setState({ ...state, isSearchPanelOpen: false });

	const handleMenuDropdownVisibility = () =>
		!state.isMenuDropdownOpen
			? setState({ ...state, isMenuDropdownOpen: true })
			: setState({ ...state, isMenuDropdownOpen: false });

	const handleCategoriesDropdownVisibility = () => {
		if (!state.isCategoriesDropdownOpen) {
			setState({ ...state, isCategoriesDropdownOpen: true });
		} else {
			setState({ ...state, isCategoriesDropdownOpen: false });
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				state.isCategoriesDropdownOpen &&
				!event.target.closest(".search__panel")
			) {
				setState({ ...state, isCategoriesDropdownOpen: false });
			}
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [state.isCategoriesDropdownOpen]);

	/** Enllaços secundaris: viuen al desplegable "més" de l'escriptori. */
	const dropdownItems = [
		{
			href: "/sobre-nosaltres",
			title: "Sobre nosaltres",
			text: "Sobre nosaltres",
		},
		{
			href: "/premsa-i-mitjans",
			title: "Premsa i mitjans",
			text: "Premsa i mitjans",
		},
		{
			href: "/empreses",
			title: "Per a empreses",
			text: "Per a empreses",
		},
		{
			href: "/contacte",
			title: "Contacta'ns",
			liClassName: "mt-2",
			aClassName: "button button__primary button__med",
			text: "Contacta'ns",
		},
	];

	/** Grups de categories que es despleguen dins el calaix de mòbil. */
	const mobileGroups = [
		{
			heading: "Per tipus d'escapada",
			items: GETAWAY_CATEGORIES,
			prefix: "/",
		},
		{
			heading: "Per tipus d'allotjament",
			items: STAY_CATEGORIES,
			prefix: "/",
		},
		{
			heading: "Destinacions",
			items: DESTINATIONS,
			prefix: "/destinacions/",
		},
	];

	return (
		<header className="z-[60] bg-white w-full sticky top-0 border-b border-neutral-100">
			<nav className="container py-3 md:py-4 menu">
				<div className="w-full grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-4 items-center">
					{/* El logo portava al panell d'administració quan hi havia
					    sessió: qualsevol usuari, també els que no en són
					    administradors, perdia la manera de tornar a la portada. */}
					<Link href="/">
						<a
							title="Inici"
							className="col-span-2 md:col-span-3 lg:col-span-3"
						>
							<picture>
								<img
									src="/logo-escapades-en-parella.svg"
									alt="Logo Escapadesenparella.cat"
									width={144}
									height={50}
									className="w-36 md:w-40 h-auto"
									loading="eager"
								/>
							</picture>
						</a>
					</Link>

					<div
						className={`menu grid grid-cols-subgrid col-span-2 md:col-span-5 lg:col-span-9 ${
							state.isResponsiveMenuOpen ? "open" : ""
						}`}
					>
						{/* Button open */}
						<div className="menu__open col-span-2 md:col-span-5">
							<button
								className="search__open"
								onClick={() => handleSearchPanel()}
								aria-label="Obrir panell de cerca"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="26"
									height="26"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path stroke="none" d="M0 0h24v24H0z" />
									<circle cx="10" cy="10" r="7" />
									<line x1="21" y1="21" x2="15" y2="15" />
								</svg>
							</button>
							<button
								className=""
								aria-label="Botó obrir menú"
								onClick={() => handleResponsiveMenu()}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-menu-2"
									width="32"
									height="32"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="#232323"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path
										stroke="none"
										d="M0 0h24v24H0z"
										fill="none"
									/>
									<line x1="4" y1="6" x2="20" y2="6" />
									<line x1="4" y1="12" x2="20" y2="12" />
									<line x1="4" y1="18" x2="20" y2="18" />
								</svg>
							</button>
						</div>

						{/* Button close */}
						<div className="lg:hidden absolute top-0 right-0 z-[60]">
							<button
								className="menu__close"
								aria-label="Botó tancar menu"
								onClick={() => handleResponsiveMenu()}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="32"
									height="32"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="#00206B"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path
										stroke="none"
										d="M0 0h24v24H0z"
										fill="none"
									/>
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							</button>
						</div>

						{/* Menu list */}
						<div className="menu__list-wrapper grid grid-cols-subgrid col-span-3 md:col-span-6 lg:col-span-9">
							<div className="menu__list menu__list--drawer grid grid-cols-subgrid col-span-3 md:col-span-6 lg:col-span-9">
								{/* Cercador: sempre visible a partir de lg */}
								<div className="col-span-3 md:col-span-4 lg:col-span-6">
									<div
										className={`search__panel menu-dropdown ${
											state.isSearchPanelOpen
												? "open"
												: ""
										}`}
									>
										<button
											className="search__close"
											aria-label="Botó tancar menu"
											onClick={() => handleSearchPanel()}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="32"
												height="32"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="#00206B"
												fill="none"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path
													stroke="none"
													d="M0 0h24v24H0z"
													fill="none"
												/>
												<line
													x1="18"
													y1="6"
													x2="6"
													y2="18"
												/>
												<line
													x1="6"
													y1="6"
													x2="18"
													y2="18"
												/>
											</svg>
										</button>
										<form className="search__form">
											<label
												htmlFor="search"
												className="search__label"
											>
												Cerca experiències i
												allotjaments
											</label>
											<fieldset className="search__fieldset">
												<input
													onKeyDown={handleKeyPress}
													type="text"
													name="search"
													id="search"
													ref={searchInputRef}
													placeholder="On voleu anar? Cerca una experiència, un allotjament o una zona"
													className="search__input"
													autoComplete="off"
													onFocus={() =>
														handleCategoriesDropdownVisibility()
													}
												/>

												<button
													type="submit"
													className="search__submit button button__med button__primary"
													onClick={handleSearchSubmit}
												>
													<span>Buscar</span>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="22"
														height="22"
														viewBox="0 0 24 24"
														strokeWidth="1.5"
														stroke="currentColor"
														fill="none"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<path
															stroke="none"
															d="M0 0h24v24H0z"
														/>
														<circle
															cx="10"
															cy="10"
															r="7"
														/>
														<line
															x1="21"
															y1="21"
															x2="15"
															y2="15"
														/>
													</svg>
												</button>
											</fieldset>
										</form>
										{state.isCategoriesDropdownOpen ? (
											<ul className="list-none bg-white rounded-xl border border-primary-50 shadow-md m-0 w-full absolute top-12 left-0 p-5 flex flex-col gap-y-4 max-h-[50vh] overflow-y-auto z-50">
												<span className="text-xs">
													Escapades per categories
												</span>
												<ContentBar />
											</ul>
										) : (
											""
										)}
									</div>
								</div>

								{/* Navegació completa dins el calaix de mòbil */}
								<div className="col-span-3 md:col-span-6 lg:hidden mt-6">
									{isAdmin ? (
										<Link href={ADMIN_PANEL_URL}>
											<a
												title="Panell d'administració"
												className="button button__ghost button__med w-full mb-4 inline-flex items-center justify-center gap-x-2"
												onClick={() =>
													handleResponsiveMenu()
												}
											>
												<DashboardIcon />
												Panell d&apos;administració
											</a>
										</Link>
									) : null}
									<ul className="list-none p-0 m-0 flex flex-col gap-y-1">
										{VERTICALS.map((vertical) => (
											<li
												key={vertical.href}
												className="m-0"
											>
												<Link href={vertical.href}>
													<a
														title={vertical.title}
														className={`block py-2 text-base ${
															vertical.highlight
																? "text-tertiary-800 font-medium"
																: "text-grey-700"
														}`}
													>
														{vertical.label}
													</a>
												</Link>
											</li>
										))}
									</ul>

									{mobileGroups.map((group) => (
										<div
											key={group.heading}
											className="mt-6 pt-5 border-t border-neutral-100"
										>
											<span className="block text-13 uppercase tracking-wider text-grey-300 mb-2">
												{group.heading}
											</span>
											<ul className="list-none p-0 m-0 flex flex-wrap gap-2">
												{group.items.map((item) => (
													<li
														key={item.slug}
														className="m-0"
													>
														<Link
															href={`${group.prefix}${item.slug}`}
														>
															<a className="inline-block rounded-full border border-neutral-200 px-3 py-1.5 text-15 text-grey-700">
																{item.label}
															</a>
														</Link>
													</li>
												))}
											</ul>
										</div>
									))}

									<div className="mt-6 pt-5 border-t border-neutral-100">
										<ul className="list-none p-0 m-0 flex flex-col gap-y-1">
											{dropdownItems.map((item) => (
												<li
													key={item.href}
													className="m-0"
												>
													<Link href={item.href}>
														<a
															className={
																item.aClassName
																	? `${item.aClassName} mt-3`
																	: "block py-2 text-base text-grey-700"
															}
														>
															{item.text}
														</a>
													</Link>
												</li>
											))}
										</ul>
									</div>
								</div>

								{/* Accions de la dreta (escriptori) */}
								<ul className="hidden lg:flex lg:col-span-3 list-none p-0 m-0 lg:justify-end lg:items-center gap-x-2">
									{isAdmin ? (
										<li className="menu__item">
											<Link href={ADMIN_PANEL_URL}>
												<a
													title="Panell d'administració"
													className="button button__ghost button__xs whitespace-nowrap inline-flex items-center gap-x-1.5"
												>
													<DashboardIcon />
													Panell
												</a>
											</Link>
										</li>
									) : null}
									<li className="menu__item">
										<Link href="/descomptes-viatjar">
											<a
												title="Descomptes per viatjar"
												className="button button__ghost button__xs whitespace-nowrap"
											>
												Descomptes
											</a>
										</Link>
									</li>
									<li
										className={`menu__item menu-dropdown ${
											state.isMenuDropdownOpen
												? "open"
												: ""
										}`}
									>
										<button
											className={`menu__link menu__link-more menu-dropdown__button rounded-full p-2.5 bg-gray-100 text-neutral-900`}
											onClick={() =>
												handleMenuDropdownVisibility()
											}
											aria-label="Gestionar menú"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path
													stroke="none"
													d="M0 0h24v24H0z"
													fill="none"
												/>
												<path d="M4 6l16 0" />
												<path d="M4 12l16 0" />
												<path d="M4 18l16 0" />
											</svg>
										</button>
										<ul className="menu-dropdown__list">
											{dropdownItems.map((item) => {
												return (
													<li
														key={item.href}
														className={`menu__item ${
															item.liClassName
																? item.liClassName
																: ""
														}`}
													>
														<Link href={item.href}>
															<a
																className={`menu__link lg:gap-x-5 ${
																	item.aClassName
																		? item.aClassName
																		: ""
																}`}
															>
																{item.text}
															</a>
														</Link>
													</li>
												);
											})}
										</ul>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</nav>
			<VerticalsNav />
		</header>
	);
};

export default NavigationBar;
