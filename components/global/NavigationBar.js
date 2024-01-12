import Router from "next/router";
import { useContext, useRef, useState } from "react";
import Link from "next/link";
import UserContext from "../../contexts/UserContext";

const NavigationBar = ({ logo_url, path }) => {
	const { user } = useContext(UserContext);
	const searchInputRef = useRef(null);

	const initialState = {
		searchQuery: "",
		isResponsiveMenuOpen: false,
		isSearchPanelOpen: false,
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
	}

	const handleResponsiveMenu = () => !state.isResponsiveMenuOpen ? setState({ ...state, isResponsiveMenuOpen: true }) : setState({ ...state, isResponsiveMenuOpen: false });
	const handleSearchPanel = () => !state.isSearchPanelOpen ? setState({ ...state, isSearchPanelOpen: true }) : setState({ ...state, isSearchPanelOpen: false });

	let logoLink =
		user === "null" || !user || user === undefined
			? "/"
			: "/2i8ZXlkM4cFKUPBrm3-admin-panel";

	return (
		<header className="z-50 bg-white w-full sticky top-0">
			<nav className="px-6 py-3 menu">
				<div className="w-full flex items-center justify-between lg:justify-start">

					<Link href={logoLink}>
						<a title="Escapadesenparella.cat">
							<svg viewBox="0 0 638 173" xmlns="http://www.w3.org/2000/svg" className="w-36 lg:w-44 h-auto"><g fill="none"><path d="M269.56 85.96c6.08 0 11.28-2 14.96-5.68.88-.96.72-2.56-.48-3.28l-2.4-1.52c-.8-.56-1.84-.48-2.56.16-2.4 2.16-5.84 3.44-9.52 3.44-8 0-12.88-4.56-14.08-11.2h29.68c1.52 0 2.8-1.28 2.8-2.8.4-13.44-9.36-21.6-19.68-21.6-11.92 0-20.48 9.52-20.48 21.28 0 11.68 8.32 21.2 21.76 21.2Zm10.8-24.4h-24.88c1.12-6.72 5.84-11.2 12.8-11.2 6.88 0 11.12 4.4 12.08 11.2Zm26.88 24.4c10.72 0 15.92-6 15.92-13.12 0-6.16-3.36-9.28-13.28-11.36a72.88 72.88 0 0 0-1.514-.293l-1.02-.188-.507-.096c-3.711-.715-7.119-1.68-7.119-5.263 0-3.36 2.88-5.68 6.88-5.68 3.68 0 6 1.6 7.12 3.36.48.8 1.44 1.12 2.32.88l2.88-.8c1.28-.32 1.92-1.84 1.28-3.04-2.24-4.4-7.28-6.88-12.88-6.88-8.88 0-15.04 5.28-15.04 12.72 0 5.92 3.36 9.6 10.88 11.36.916.206 1.861.378 2.803.54l.564.096c4.69.796 9.113 1.493 9.113 5.364 0 3.6-2.96 5.76-8.24 5.76-5.12 0-7.6-1.76-8.72-3.52-.56-.8-1.52-1.2-2.48-.88l-3.2 1.12c-1.2.4-1.84 1.84-1.2 3.04 2.56 4.48 8.48 6.88 15.44 6.88Zm40.72 0c6.96 0 12.8-3.12 16.56-7.92.8-1.04.48-2.56-.64-3.2l-2.48-1.36c-.88-.48-2.08-.24-2.72.56-2.4 3.12-6.24 5.04-10.72 5.04-8 0-13.76-6.08-13.76-14.32 0-8.32 5.76-14.4 13.76-14.4 4.48 0 8.32 1.92 10.72 5.04.64.8 1.84 1.04 2.72.56l2.48-1.36c1.12-.64 1.44-2.16.64-3.2-3.76-4.8-9.6-7.92-16.56-7.92-12.24 0-21.28 9.52-21.28 21.28 0 11.68 9.04 21.2 21.28 21.2Zm40.16 0c7.04 0 11.76-2.88 14.72-6.64v3.52c0 1.2.96 2.16 2.16 2.16h3.04c1.2 0 2.16-.96 2.16-2.16V46.6c0-1.2-.96-2.16-2.16-2.16H405c-1.2 0-2.16.96-2.16 2.16v3.52c-2.96-3.76-7.68-6.64-14.72-6.64-12.64 0-20.16 10.64-20.16 21.28 0 10.56 7.52 21.2 20.16 21.2Zm.72-6.88c-8.4 0-13.44-6.16-13.44-14.32 0-8.24 5.04-14.4 13.44-14.4 8.96 0 14 6.32 14 14.4 0 8-5.04 14.32-14 14.32Zm35.28 21.36c1.2 0 2.16-.96 2.16-2.16V79.32c3.04 3.76 7.68 6.64 14.72 6.64 12.64 0 20.24-10.64 20.24-21.2 0-10.64-7.6-21.28-20.24-21.28-7.04 0-11.68 2.88-14.72 6.64V46.6c0-1.2-.96-2.16-2.16-2.16h-3.04c-1.12 0-2.08.96-2.08 2.16v51.68c0 1.2.96 2.16 2.08 2.16h3.04Zm16.16-21.36c-8.88 0-14-6.32-14-14.32 0-8.08 5.12-14.4 14-14.4 8.4 0 13.44 6.16 13.44 14.4 0 8.16-5.04 14.32-13.44 14.32Zm45.12 6.88c7.04 0 11.76-2.88 14.72-6.64v3.52c0 1.2.96 2.16 2.16 2.16h3.04c1.2 0 2.16-.96 2.16-2.16V46.6c0-1.2-.96-2.16-2.16-2.16h-3.04c-1.2 0-2.16.96-2.16 2.16v3.52c-2.96-3.76-7.68-6.64-14.72-6.64-12.64 0-20.16 10.64-20.16 21.28 0 10.56 7.52 21.2 20.16 21.2Zm.72-6.88c-8.4 0-13.44-6.16-13.44-14.32 0-8.24 5.04-14.4 13.44-14.4 8.96 0 14 6.32 14 14.4 0 8-5.04 14.32-14 14.32Zm47.92 6.88c7.04 0 11.76-2.88 14.8-6.64v3.52c0 1.2.96 2.16 2.08 2.16h3.04c1.2 0 2.16-.96 2.16-2.16V31.16c0-1.2-.96-2.16-2.16-2.16h-3.04c-1.12 0-2.08.96-2.08 2.16v18.96c-3.04-3.76-7.76-6.64-14.8-6.64-12.64 0-20.16 10.64-20.16 21.28 0 10.56 7.52 21.2 20.16 21.2Zm.72-6.88c-8.32 0-13.44-6.16-13.44-14.32 0-8.24 5.12-14.4 13.44-14.4 8.96 0 14.08 6.32 14.08 14.4 0 8-5.12 14.32-14.08 14.32Zm49.52 6.88c6.08 0 11.28-2 14.96-5.68.88-.96.72-2.56-.48-3.28l-2.4-1.52c-.8-.56-1.84-.48-2.56.16-2.4 2.16-5.84 3.44-9.52 3.44-8 0-12.88-4.56-14.08-11.2h29.68c1.52 0 2.8-1.28 2.8-2.8.4-13.44-9.36-21.6-19.68-21.6-11.92 0-20.48 9.52-20.48 21.28 0 11.68 8.32 21.2 21.76 21.2Zm10.8-24.4H570.2c1.12-6.72 5.84-11.2 12.8-11.2 6.88 0 11.12 4.4 12.08 11.2Zm26.88 24.4c10.72 0 15.92-6 15.92-13.12 0-6.16-3.36-9.28-13.28-11.36a72.88 72.88 0 0 0-1.514-.293l-1.02-.188-.507-.096-.504-.1c-3.51-.708-6.615-1.743-6.615-5.163 0-3.36 2.88-5.68 6.88-5.68 3.68 0 6 1.6 7.12 3.36.48.8 1.44 1.12 2.32.88l2.88-.8c1.28-.32 1.92-1.84 1.28-3.04-2.24-4.4-7.28-6.88-12.88-6.88-8.88 0-15.04 5.28-15.04 12.72 0 5.92 3.36 9.6 10.88 11.36.916.206 1.861.378 2.803.54l.564.096c4.69.796 9.113 1.493 9.113 5.364 0 3.6-2.96 5.76-8.24 5.76-5.12 0-7.6-1.76-8.72-3.52-.56-.8-1.52-1.2-2.48-.88l-3.2 1.12c-1.2.4-1.84 1.84-1.2 3.04 2.56 4.48 8.48 6.88 15.44 6.88Zm-352.4 72c6.08 0 11.28-2 14.96-5.68.88-.96.72-2.56-.48-3.28l-2.4-1.52c-.8-.56-1.84-.48-2.56.16-2.4 2.16-5.84 3.44-9.52 3.44-8 0-12.88-4.56-14.08-11.2h29.68c1.52 0 2.8-1.28 2.8-2.8.4-13.44-9.36-21.6-19.68-21.6-11.92 0-20.48 9.52-20.48 21.28 0 11.68 8.32 21.2 21.76 21.2Zm10.8-24.4h-24.88c1.12-6.72 5.84-11.2 12.8-11.2 6.88 0 11.12 4.4 12.08 11.2Zm19.2 23.44c1.2 0 2.16-.96 2.16-2.16v-21.12c0-4.72 3.04-11.36 10.72-11.36 7.6 0 10.08 5.68 10.08 11.36v21.12c0 1.2.96 2.16 2.08 2.16h3.04c1.2 0 2.16-.96 2.16-2.16v-23.2c0-8.64-6.48-16.16-15.6-16.16-6.16 0-10.08 3.04-12.48 6.64v-3.52c0-1.2-.96-2.16-2.16-2.16h-3.04c-1.2 0-2.08.96-2.08 2.16v36.24c0 1.2.88 2.16 2.08 2.16h3.04Zm44.16 15.44c1.2 0 2.16-.96 2.16-2.16v-18.96c3.04 3.76 7.68 6.64 14.72 6.64 12.64 0 20.24-10.64 20.24-21.2 0-10.64-7.6-21.28-20.24-21.28-7.04 0-11.68 2.88-14.72 6.64v-3.52c0-1.2-.96-2.16-2.16-2.16h-3.04c-1.12 0-2.08.96-2.08 2.16v51.68c0 1.2.96 2.16 2.08 2.16h3.04Zm16.16-21.36c-8.88 0-14-6.32-14-14.32 0-8.08 5.12-14.4 14-14.4 8.4 0 13.44 6.16 13.44 14.4 0 8.16-5.04 14.32-13.44 14.32Zm45.12 6.88c7.04 0 11.76-2.88 14.72-6.64v3.52c0 1.2.96 2.16 2.16 2.16h3.04c1.2 0 2.16-.96 2.16-2.16V118.6c0-1.2-.96-2.16-2.16-2.16h-3.04c-1.2 0-2.16.96-2.16 2.16v3.52c-2.96-3.76-7.68-6.64-14.72-6.64-12.64 0-20.16 10.64-20.16 21.28 0 10.56 7.52 21.2 20.16 21.2Zm.72-6.88c-8.4 0-13.44-6.16-13.44-14.32 0-8.24 5.04-14.4 13.44-14.4 8.96 0 14 6.32 14 14.4 0 8-5.04 14.32-14 14.32Zm35.36 5.92c1.12 0 2.08-.96 2.08-2.16v-16c0-7.2 1.44-15.84 12.08-15.28.8 0 1.52-.64 1.52-1.44v-5.2c0-.8-.72-1.44-1.6-1.36-4.72.4-9.52 2.96-12 7.92v-4.88c0-1.2-.96-2.16-2.08-2.16h-3.04c-1.2 0-2.16.96-2.16 2.16v36.24c0 1.2.96 2.16 2.16 2.16h3.04Zm39.76.96c6.08 0 11.28-2 14.96-5.68.88-.96.72-2.56-.48-3.28l-2.4-1.52c-.8-.56-1.84-.48-2.56.16-2.4 2.16-5.84 3.44-9.52 3.44-8 0-12.88-4.56-14.08-11.2h29.68c1.52 0 2.8-1.28 2.8-2.8.4-13.44-9.36-21.6-19.68-21.6-11.92 0-20.48 9.52-20.48 21.28 0 11.68 8.32 21.2 21.76 21.2Zm10.8-24.4h-24.88c1.12-6.72 5.84-11.2 12.8-11.2 6.88 0 11.12 4.4 12.08 11.2ZM510.92 157c1.2 0 2.08-.96 2.08-2.16v-51.68c0-1.2-.88-2.16-2.08-2.16h-3.04c-1.2 0-2.16.96-2.16 2.16v51.68c0 1.2.96 2.16 2.16 2.16h3.04Zm16.08 0c1.2 0 2.08-.96 2.08-2.16v-51.68c0-1.2-.88-2.16-2.08-2.16h-3.04c-1.2 0-2.16.96-2.16 2.16v51.68c0 1.2.96 2.16 2.16 2.16H527Zm28.64.96c7.04 0 11.76-2.88 14.72-6.64v3.52c0 1.2.96 2.16 2.16 2.16h3.04c1.2 0 2.16-.96 2.16-2.16V118.6c0-1.2-.96-2.16-2.16-2.16h-3.04c-1.2 0-2.16.96-2.16 2.16v3.52c-2.96-3.76-7.68-6.64-14.72-6.64-12.64 0-20.16 10.64-20.16 21.28 0 10.56 7.52 21.2 20.16 21.2Zm.72-6.88c-8.4 0-13.44-6.16-13.44-14.32 0-8.24 5.04-14.4 13.44-14.4 8.96 0 14 6.32 14 14.4 0 8-5.04 14.32-14 14.32Z" fill="#001233" /><path d="M135.345 25.354a8 8 0 0 1 2.582 2.5l.174.282 70.638 119.581a8 8 0 0 1-6.558 12.062l-.33.007H8a8 8 0 0 1-6.893-12.06l58.125-98.668a8 8 0 0 1 13.786 0l60.517 102.728h68.316l-27.863-47.167c-11.209.55-22.182-2.142-32.846-8.034-5.161-2.852-9.618-7.103-14.145-12.92l-.569-.74-.399-.536-.815-1.12-1.58-2.213-4.045-5.717-1.115-1.55-.498-.671-.21-.268c-1.963-2.42-4.443-3.56-7.777-3.457L102.83 79.26a4 4 0 0 1-6.956-3.947l.105-.185 28.383-47.055a8 8 0 0 1 10.982-2.719ZM66.125 53.12 8 151.786h41.898c.075-.247.174-.49.3-.726l.105-.185 25.989-43.109a4 4 0 0 1 6.956 3.946l-.105.184-24.048 39.89h65.155L66.125 53.12Zm65.088-20.914L114.544 59.84c3.7.835 6.887 2.83 9.435 5.97l.345.444.592.797 1.234 1.712 5.18 7.305.968 1.342.599.805c4.072 5.32 7.918 9.049 12.114 11.368 7.992 4.415 16.067 6.764 24.272 7.071l-38.07-64.45ZM187.015 0c13.255 0 24 10.745 24 24s-10.745 24-24 24-24-10.745-24-24 10.745-24 24-24Zm0 8c-8.836 0-16 7.163-16 16s7.164 16 16 16c8.837 0 16-7.163 16-16s-7.163-16-16-16Z" fill="#E5654B" /></g></svg>
						</a>
					</Link>
					<div className={`menu ${state.isResponsiveMenuOpen ? 'open' : ''}`}>
						{/* Search input */}
						<div className="lg:flex-1 flex lg:mx-8">
							<button className="search__open" onClick={() => handleSearchPanel()} aria-label="Obrir panell de cerca">
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
							<div className={`search__panel ${state.isSearchPanelOpen ? 'open' : ''}`}>
								{/* Button close */}
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
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<line x1="18" y1="6" x2="6" y2="18" />
										<line x1="6" y1="6" x2="18" y2="18" />
									</svg>
								</button>
								<form className="search__form">
									<fieldset className="search__fieldset">
										<label htmlFor="search" className="search__label">Cerca experiències i allotjaments</label>

										<input
											onKeyDown={handleKeyPress}
											type="text"
											name="search"
											id="search"
											ref={searchInputRef}
											placeholder="Cerca escapades..."
											className="search__input"
										/>

										<button type="submit" className="search__submit button button__med button__primary" onClick={handleSearchSubmit}>
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
												<path stroke="none" d="M0 0h24v24H0z" />
												<circle cx="10" cy="10" r="7" />
												<line x1="21" y1="21" x2="15" y2="15" />
											</svg></button>
									</fieldset>
								</form>
							</div>
						</div>

						{/* Button open */}
						<button
							className="menu__open"
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
								<line x1="4" y1="6" x2="20" y2="6" />
								<line x1="4" y1="12" x2="20" y2="12" />
								<line x1="4" y1="18" x2="20" y2="18" />
							</svg>
						</button>

						{/* Menu list */}
						<ul className="menu__list">
							{/* Button close */}
							<li>
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
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<line x1="18" y1="6" x2="6" y2="18" />
										<line x1="6" y1="6" x2="18" y2="18" />
									</svg>
								</button>
							</li>
							<li className="menu__item">
								<Link href="/activitats">
									<a className="menu__link" title="Experiències en parella a Catalunya">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-route text-primary-500 mr-1"
											width="22"
											height="22"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="currentColor"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path stroke="none" d="M0 0h24v24H0z" />
											<circle cx="6" cy="19" r="2" />
											<circle cx="18" cy="5" r="2" />
											<path d="M12 19h4.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h3.5" />
										</svg>
										Experiències
									</a>
								</Link>
							</li>
							<li className="menu__item">
								<Link href="/allotjaments">
									<a className="menu__link">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-tent mr-1"
											width="22"
											height="22"
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
											<path d="M11 14l4 6h6l-9 -16l-9 16h6l4 -6" />
										</svg>
										Allotjaments
									</a>
								</Link>
							</li>
							<li className="menu__item">
								<Link href="/histories">
									<a className="menu__link">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-notebook text-primary-500 mr-1"
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
												fill="none"
											/>
											<path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18" />
											<line x1="13" y1="8" x2="15" y2="8" />
											<line x1="13" y1="12" x2="15" y2="12" />
										</svg>
										Històries
									</a>
								</Link>
							</li>
							<li className="menu__item">
								<Link href="/llistes">
									<a className="menu__link">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-layout-list text-primary-500 mr-1"
											width="22"
											height="22"
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
											<rect
												x="4"
												y="4"
												width="16"
												height="6"
												rx="2"
											/>
											<rect
												x="4"
												y="14"
												width="16"
												height="6"
												rx="2"
											/>
										</svg>
										Llistes
									</a>
								</Link>
							</li>
							<li className="menu__item">
								<Link href="/viatges">
									<a className="menu__link">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-globe text-primary-500 mr-1"
											width={22}
											height={22}
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
											></path>
											<path d="M7 9a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
											<path d="M5.75 15a8.015 8.015 0 1 0 9.25 -13"></path>
											<path d="M11 17v4"></path>
											<path d="M7 21h8"></path>
										</svg>
										Viatges
									</a>
								</Link>
							</li>
							<li className="menu__item">
								<Link href="/contacte">
									<a className="button button__primary button__med menu__link">
										Contacta'ns
									</a>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default NavigationBar;
