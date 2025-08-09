import Router from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import UserContext from "../../contexts/UserContext";
import ContentBar from "../homepage/ContentBar";

const NavigationBar = () => {
	const { user } = useContext(UserContext);
	const searchInputRef = useRef(null);

	const initialState = {
		searchQuery: "",
		isResponsiveMenuOpen: false,
		isSearchPanelOpen: false,
		isMenuDropdownOpen: false,
		isCategoriesDropdownOpen: false,
		logoUrl: "/",
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

	useEffect(() => {
		if (user) {
			setState({
				...initialState,
				logoUrl: "/2i8ZXlkM4cFKUPBrm3-admin-panel",
			});
		}
	}, [user]);

	const dropdownItems = [
		{
			href: "/histories",
			title: "Històries",
			icon: "/icones/icona-histories.png",
			iconWebp: "/icones/icona-histories.webp",
			text: "Històries",
		},
		{
			href: "/llistes",
			title: "Llistes",
			icon: "/icones/icona-llistes.png",
			iconWebp: "/icones/icona-llistes.webp",
			text: "Llistes",
		},
		{
			href: "/viatges",
			title: "Viatges",
			icon: "/icones/icona-viatges.png",
			iconWebp: "/icones/icona-viatges.webp",
			text: "Viatges",
		},

		{
			href: "/sobre-nosaltres",
			title: "Sobre nosaltres",
			icon: "/icones/icona-sobre-nosaltres.png",
			iconWebp: "/icones/icona-sobre-nosaltres.webp",
			text: "Sobre nosaltres",
		},
		{
			href: "/premsa-i-mitjans",
			title: "Premsa i mitjans",
			icon: "/icones/icona-premsa.png",
			iconWebp: "/icones/icona-premsa.webp",
			text: "Premsa i mitjans",
		},
		{
			href: "/contacte",
			title: "Contacta'ns",
			liClassName: "mt-2",
			aClassName: "button button__primary button__med",
			text: "Contacta'ns",
		},
	];

	return (
		<header className="z-[60] bg-white w-full sticky top-0 border-b border-neutral-100">
			<nav className="px-6 lg:px-12 py-4 md:py-4 menu">
				<div className="w-full grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-x-4">
					<Link
						href={{
							pathname: state.logoUrl,
						}}
					>
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
							<div className="menu__list grid grid-cols-subgrid col-span-3 md:col-span-6 lg:col-span-9">
								<ul className="col-span-3 md:col-span-4 lg:col-span-6 list-none p-0 m-0 flex flex-col gap-y-4 lg:flex-row lg:justify-center lg:items-center lg:gap-x-8">
									<li className="menu__item">
										<Link href="/activitats">
											<a
												className="menu__link"
												title="Experiències en parella a Catalunya"
											>
												<picture>
													<source
														srcSet="/icones/icona-activitats.webp"
														type="image/webp"
													/>
													<img
														src="/icones/icona-activitats.png"
														alt="Experiències en parella a Catalunya"
														className="w-9 h-auto lg:w-12"
														width={36}
														height={36}
													/>
												</picture>
												Experiències
											</a>
										</Link>
									</li>
									<li className="menu__item">
										<Link href="/allotjaments">
											<a
												className="menu__link"
												title="Allotjaments amb encant a Catalunya"
											>
												<picture>
													<source
														srcSet="/icones/icona-allotjaments.webp"
														type="image/webp"
													/>
													<img
														src="/icones/icona-allotjaments.png"
														alt="Experiències en parella a Catalunya"
														className="w-9 h-auto lg:w-12"
														width={36}
														height={36}
													/>
												</picture>
												Allotjaments
											</a>
										</Link>
									</li>
									<li className="menu__item">
										<Link href="/escapades-catalunya">
											<a
												className="menu__link"
												title="Escapades per Catalunya"
											>
												<picture>
													<source
														srcSet="/icones/icona-ubicacions.webp"
														type="image/webp"
													/>
													<img
														src="/icones/icona-ubicacions.png"
														alt="Escapades per Catalunya"
														className="w-9 h-auto lg:w-12"
														width={36}
														height={36}
													/>
												</picture>
												Ubicacions
											</a>
										</Link>
									</li>
								</ul>
								<ul className="col-span-3 md:col-span-4 lg:col-span-3 list-none p-0 m-0 lg:flex lg:justify-end lg:items-center gap-x-4">
									<li>
										{/* Search input */}

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
												onClick={() =>
													handleSearchPanel()
												}
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
											<form className="search__form xl:max-w-md">
												<label
													htmlFor="search"
													className="search__label"
												>
													Cerca experiències i
													allotjaments
												</label>
												<fieldset className="search__fieldset">
													<input
														onKeyDown={
															handleKeyPress
														}
														type="text"
														name="search"
														id="search"
														ref={searchInputRef}
														placeholder="Cerca escapades..."
														className="search__input"
														autoComplete="off"
														onFocus={() =>
															handleCategoriesDropdownVisibility()
														}
													/>

													<button
														type="submit"
														className="search__submit button button__med button__primary"
														onClick={
															handleSearchSubmit
														}
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
												<ul className="list-none bg-white rounded-xl border border-primary-50 shadow-md m-0 w-full absolute top-12 left-0 p-5 flex flex-col gap-y-4 max-h-[50vh] overflow-y-auto">
													<span className="text-xs">
														Escapades per categories
													</span>
													<ContentBar />
												</ul>
											) : (
												""
											)}
										</div>
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
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
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
																{item.icon ? (
																	<picture>
																		<source
																			srcSet={
																				item.icon
																			}
																			type="image/webp"
																		/>
																		<img
																			src={
																				item.icon
																			}
																			alt={
																				item.text
																			}
																			className="w-9 h-auto lg:w-7"
																			width={
																				36
																			}
																			height={
																				36
																			}
																		/>
																	</picture>
																) : (
																	""
																)}
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
		</header>
	);
};

export default NavigationBar;
