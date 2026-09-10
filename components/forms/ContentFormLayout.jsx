import { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import NavigationBar from "../global/NavigationBar";
import AutosaveIndicator from "./AutosaveIndicator";
import DraftRestoreNotice from "./DraftRestoreNotice";

/**
 * Bastida de les pàgines de composició de contingut.
 *
 * La capçalera, el títol, el botó de publicar i les pestanyes eren idèntics a
 * les deu pàgines de crear i editar publicacions.
 *
 * Respecte de la primera versió unificada:
 *  - La barra amb el botó de desar i les pestanyes és enganxosa: en una fitxa
 *    llarga calia pujar fins a dalt de tot per desar, i no hi havia cap manera
 *    de saber en quina pestanya s'era sense fer el mateix viatge.
 *  - Hi ha l'estat de l'autoguardat i l'avís per recuperar un esborrany.
 *  - Es demana confirmació abans de sortir amb canvis sense desar, tant si es
 *    tanca la pestanya com si es navega dins del web.
 *  - Ctrl/Cmd + S desa sense sortir.
 *  - El contingut es reparteix en dues columnes a l'estil dels gestors de
 *    contingut habituals: al mig el text de la publicació i a la barra lateral
 *    la portada, els adjunts i la classificació. Abans les imatges vivien en
 *    una pestanya a part i calia saltar-hi per veure què s'havia pujat.
 */

const ADMIN_PANEL_PATH = "/2i8ZXlkM4cFKUPBrm3-admin-panel";

const ContentFormLayout = ({
	documentTitle,
	title,
	description,
	submitLabel,
	onSubmit,
	onSaveAndStay,
	isSaving,
	errorMessage,
	successMessage,
	isDirty = false,
	dirtyRef = null,
	autosave = null,
	draftNotice = null,
	previewUrl = null,
	user,
	path,
	tabs,
	activeTab,
	onTabChange,
	/** Blocs de la columna lateral. Sense res, el contingut va a tota l'amplada. */
	sidebar = null,
	children,
}) => {
	const router = useRouter();
	const rootRef = useRef(null);
	const toolbarRef = useRef(null);
	const [navHeight, setNavHeight] = useState(0);
	const [toolbarHeight, setToolbarHeight] = useState(0);

	// La barra del navegador principal ja és enganxosa, i la de l'editor de
	// text ric també: si no se sap què fa alta cadascuna, se saluden entre
	// elles a mitja pantalla.
	//
	// La capçalera es mesura buscant-la dins de la pàgina i no embolicant-la:
	// una capa pel mig li limita el `sticky` a l'alçada d'aquesta capa i el
	// menú del web deixa de quedar-se a dalt.
	useEffect(() => {
		const header = rootRef.current
			? rootRef.current.querySelector("header")
			: null;

		const measure = () => {
			setNavHeight(header ? header.offsetHeight : 0);
			setToolbarHeight(
				toolbarRef.current ? toolbarRef.current.offsetHeight : 0,
			);
		};
		measure();
		window.addEventListener("resize", measure);

		let observer = null;
		if (typeof ResizeObserver !== "undefined") {
			observer = new ResizeObserver(measure);
			if (header) observer.observe(header);
			if (toolbarRef.current) observer.observe(toolbarRef.current);
		}

		return () => {
			window.removeEventListener("resize", measure);
			if (observer) observer.disconnect();
		};
	}, []);

	// Ctrl/Cmd + S només desa quan es pot desar sense sortir, o sigui en
	// editar. En crear no s'hi lliga res: una drecera que publiqués una fitxa
	// a mig fer és pitjor que no tenir-la.
	const saveWithoutLeaving = useCallback(() => {
		if (isSaving || !onSaveAndStay) return;
		onSaveAndStay();
	}, [isSaving, onSaveAndStay]);

	useEffect(() => {
		if (!onSaveAndStay) return undefined;
		const handleKeyDown = (event) => {
			if (!(event.metaKey || event.ctrlKey) || event.key !== "s") return;
			event.preventDefault();
			saveWithoutLeaving();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [saveWithoutLeaving, onSaveAndStay]);

	// L'avís de sortida es consulta en el moment de sortir i no quan es
	// registra: en desar, el formulari deixa d'estar brut a l'instant i el
	// redirigit posterior no ha de fer aparèixer cap confirmació.
	const dirtyStateRef = useRef(isDirty);
	useEffect(() => {
		dirtyStateRef.current = isDirty;
	}, [isDirty]);

	useEffect(() => {
		const isBlocking = () =>
			dirtyRef ? dirtyRef.current : dirtyStateRef.current;

		const warnOnUnload = (event) => {
			if (!isBlocking()) return undefined;
			event.preventDefault();
			event.returnValue = "";
			return "";
		};

		const warnOnRouteChange = (url) => {
			if (!isBlocking()) return;
			if (url === router.asPath) return;
			const confirmed = window.confirm(
				"Hi ha canvis sense desar. Segur que vols sortir del formulari?",
			);
			if (confirmed) return;
			router.events.emit("routeChangeError");
			// Next no ofereix cap altra manera d'aturar una navegació.
			// eslint-disable-next-line no-throw-literal
			throw "Navegació cancel·lada: hi ha canvis sense desar.";
		};

		window.addEventListener("beforeunload", warnOnUnload);
		router.events.on("routeChangeStart", warnOnRouteChange);

		return () => {
			window.removeEventListener("beforeunload", warnOnUnload);
			router.events.off("routeChangeStart", warnOnRouteChange);
		};
	}, [router, dirtyRef]);

	return (
		<>
			<Head>
				<title>{documentTitle}</title>
			</Head>
			<div
				id="storyForm"
				ref={rootRef}
				style={{
					// La barra de l'editor s'enganxa just per sota d'aquestes dues.
					"--composer-toolbar-offset": `${navHeight + toolbarHeight + 8}px`,
				}}
			>
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
					user={user}
					path={path}
				/>

				<div
					ref={toolbarRef}
					className="sticky z-50 bg-white/95 backdrop-blur border-b border-primary-50"
					style={{ top: `${navHeight}px` }}
				>
					<div className="container">
						<div className="flex items-center justify-between gap-3 py-2">
							<div className="min-w-0 flex items-center gap-3">
								<Link href={ADMIN_PANEL_PATH}>
									<a
										className="hidden sm:inline-flex items-center gap-1 text-sm text-primary-400 hover:text-primary-500 whitespace-nowrap"
										title="Tornar al panell d'administració"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width={18}
											height={18}
											viewBox="0 0 24 24"
											strokeWidth="2"
											stroke="currentColor"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
											aria-hidden="true"
										>
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											/>
											<path d="M15 6l-6 6l6 6" />
										</svg>
										Panell
									</a>
								</Link>
								<span className="hidden md:block h-5 w-px bg-gray-200" />
								<p className="m-0 truncate text-sm font-medium text-primary-500">
									{title}
								</p>
							</div>

							<div className="flex items-center gap-3 shrink-0">
								{autosave ? (
									<span className="hidden lg:inline-flex">
										<AutosaveIndicator
											status={autosave.status}
											savedAt={autosave.savedAt}
											isDirty={isDirty}
											isSaving={isSaving}
										/>
									</span>
								) : null}
								{previewUrl ? (
									<a
										href={previewUrl}
										target="_blank"
										rel="noreferrer"
										className="hidden md:inline-flex text-sm text-primary-400 hover:text-primary-500 underline whitespace-nowrap"
									>
										Veure-ho al web
									</a>
								) : null}
								{onSaveAndStay ? (
									<button
										className="button button__secondary button__xs md:py-2.5 md:px-5 w-auto whitespace-nowrap"
										type="button"
										onClick={onSaveAndStay}
										disabled={isSaving}
										title="Desar sense sortir del formulari (Ctrl+S)"
									>
										{isSaving ? "Desant…" : "Desar"}
									</button>
								) : null}
								<button
									className="button button__primary button__xs md:py-2.5 md:px-5 w-auto whitespace-nowrap"
									type="button"
									onClick={onSubmit}
									disabled={isSaving}
								>
									{isSaving ? "Desant…" : submitLabel}
								</button>
							</div>
						</div>

						{errorMessage || successMessage ? (
							<p
								className={`m-0 pb-2 text-15 ${
									errorMessage
										? "text-red-600"
										: "text-emerald-700"
								}`}
								role={errorMessage ? "alert" : "status"}
							>
								{errorMessage || successMessage}
							</p>
						) : null}

						<div className="flex items-stretch gap-1 overflow-x-auto">
							{tabs.map((tab) => (
								<button
									key={tab.key}
									type="button"
									aria-current={
										activeTab === tab.key ? "page" : undefined
									}
									className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors ${
										activeTab === tab.key
											? "border-primary-500 text-primary-500 font-medium"
											: "border-transparent text-primary-400 hover:text-primary-500"
									}`}
									onClick={() => onTabChange(tab.key)}
								>
									{tab.label}
									{tab.badge ? tab.badge : null}
								</button>
							))}
						</div>
					</div>
				</div>

				<section>
					<div className="container">
						<div className="pt-6 pb-12">
							<h1 className="text-2xl mb-1">{title}</h1>
							{description ? (
								<p className="text-base text-primary-400 mb-4">
									{description}
								</p>
							) : null}

							{draftNotice ? (
								<DraftRestoreNotice
									savedAt={draftNotice.savedAt}
									onRestore={draftNotice.onRestore}
									onDiscard={draftNotice.onDiscard}
								/>
							) : null}

							{autosave ? (
								<div className="lg:hidden mb-3">
									<AutosaveIndicator
										status={autosave.status}
										savedAt={autosave.savedAt}
										isDirty={isDirty}
										isSaving={isSaving}
									/>
								</div>
							) : null}

							{/*
							 * Amb barra lateral, l'editor es reparteix com el de
							 * WordPress: al mig el que es llegeix (encapçalament i
							 * cos) i al costat el que acompanya la publicació
							 * (portada, adjunts i classificació). Sense barra
							 * lateral —la pestanya de SEO— el contingut ocupa tota
							 * l'amplada, que ja té la seva pròpia distribució.
							 */}
							{sidebar ? (
								<div className="form-composer__body grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
									<div className="lg:col-span-8">
										{children}
									</div>
									<aside
										className="lg:col-span-4 lg:sticky space-y-4"
										style={{
											top: "var(--composer-toolbar-offset, 8rem)",
										}}
									>
										{sidebar}
									</aside>
								</div>
							) : (
								<div className="form-composer__body">
									{children}
								</div>
							)}
						</div>
					</div>
				</section>
			</div>
		</>
	);
};

export default ContentFormLayout;
export { ADMIN_PANEL_PATH };
