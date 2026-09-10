import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import NavigationBar from "../../components/global/NavigationBar";
import ChoiceGroup from "../../components/forms/ChoiceGroup";
import AuthAlert from "../../components/auth/AuthAlert";
import AuthService from "../../services/authService";
import ContentService from "../../services/contentService";
import UserContext from "../../contexts/UserContext";

/**
 * Últim pas del registre: triar els temes d'interès.
 *
 * Respecte de la versió anterior:
 *  - Cridava `useState` i dos `useEffect` **després** d'un `return` condicional;
 *    quan la sessió es resolia, React avortava el render amb "Rendered more
 *    hooks than during the previous render".
 *  - `handleCheck` eren quatre branques quasi idèntiques de trenta línies que,
 *    a més, feien `push` i `splice` damunt dels arrays de l'estat: React no
 *    veia el canvi i la selecció es podia quedar sense pintar.
 *  - Un `useEffect` que vigilava tot l'objecte `state` cridava
 *    `refreshUserData` a cada clic en una casella, o sigui una petició de
 *    perfil per cada tema marcat.
 *  - Estava muntat amb `Container`, `Row` i `Form.Check` de react-bootstrap
 *    sense el CSS de Bootstrap: les caselles sortien despentinades i el botó
 *    de continuar no deia mai per què estava desactivat.
 */

const INTEREST_GROUPS = [
	{
		key: "regionsToFollow",
		field: "region",
		label: "Destinacions que t'interessen",
		options: [
			{ value: "barcelona", label: "Barcelona" },
			{ value: "girona", label: "Girona" },
			{ value: "lleida", label: "Lleida" },
			{ value: "tarragona", label: "Tarragona" },
			{ value: "costaBrava", label: "Costa Brava" },
			{ value: "costaDaurada", label: "Costa Daurada" },
			{ value: "pirineus", label: "Pirineus" },
		],
	},
	{
		key: "categoriesToFollow",
		field: "category",
		label: "Tipus d'escapada",
		options: [
			{ value: "romantica", label: "Romàntiques" },
			{ value: "aventura", label: "Aventura" },
			{ value: "gastronomica", label: "Gastronòmiques" },
			{ value: "cultural", label: "Culturals" },
			{ value: "relax", label: "Relax" },
		],
	},
	{
		key: "seasonsToFollow",
		field: "season",
		label: "Èpoques de l'any",
		options: [
			{ value: "hivern", label: "A la neu" },
			{ value: "primavera", label: "Primavera" },
			{ value: "estiu", label: "Estiu" },
			// Deia "Tardo" a la pantalla; el valor que es desa sempre ha estat "tardor".
			{ value: "tardor", label: "Tardor" },
		],
	},
	{
		key: "typesToFollow",
		field: "type",
		label: "On us agrada allotjar-vos",
		options: [
			{ value: "hotel", label: "Hotels" },
			{ value: "apartament", label: "Apartaments" },
			{ value: "casarural", label: "Cases rurals" },
			{ value: "casaarbre", label: "Cases-arbre" },
			{ value: "refugi", label: "Refugis" },
			{ value: "carabana", label: "Carabanes" },
		],
	},
];

const CompleteAccount = () => {
	const { user, refreshUserData } = useContext(UserContext);
	const router = useRouter();

	const [selection, setSelection] = useState({
		regionsToFollow: [],
		categoriesToFollow: [],
		seasonsToFollow: [],
		typesToFollow: [],
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const hasConfirmedEmail = useRef(false);

	const authService = useMemo(() => new AuthService(), []);
	const service = useMemo(() => new ContentService(), []);

	useEffect(() => {
		if (!user || user === "null" || user === undefined) {
			router.push("/login");
			return;
		}
		if (user.accountCompleted) {
			router.push("/2i8ZXlkM4cFKUPBrm3-admin-panel");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	// Arribar fins aquí és el que confirma el correu. Es fa un sol cop: abans
	// depenia de tot l'objecte d'estat i es repetia a cada canvi.
	useEffect(() => {
		if (!user || !user._id || hasConfirmedEmail.current) return;
		hasConfirmedEmail.current = true;

		const confirmEmail = async () => {
			try {
				const response = await authService.confirmEmail(user._id, true);
				if (response && response.updateUser) {
					refreshUserData(response.updateUser);
				}
			} catch (error) {
				console.error(error);
			}
		};
		confirmEmail();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const missingGroups = INTEREST_GROUPS.filter(
		(group) => selection[group.key].length === 0,
	);
	const isReadyToSubmit = missingGroups.length === 0;

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!isReadyToSubmit || isSubmitting) return;

		setIsSubmitting(true);
		setErrorMessage("");

		try {
			await authService.completeAccount(
				true,
				selection.typesToFollow,
				selection.categoriesToFollow,
				selection.regionsToFollow,
				selection.seasonsToFollow,
			);

			const profile = await service.getUserProfile(user._id);
			refreshUserData(profile);
			Router.push("/2i8ZXlkM4cFKUPBrm3-admin-panel");
		} catch (error) {
			console.error(error);
			setErrorMessage(
				"No s'ha pogut desar la selecció. Torna-ho a provar.",
			);
			setIsSubmitting(false);
		}
	};

	if (!user) {
		return (
			<Head>
				<title>Carregant… - Escapadesenparella.cat</title>
			</Head>
		);
	}

	return (
		<>
			<Head>
				<title>Completa el teu compte - Escapadesenparella.cat</title>
				<meta name="robots" content="noindex, nofollow" />
			</Head>

			<div className="bg-gray-50 min-h-screen">
				<NavigationBar
					logo_url={
						"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
					}
					user={user}
					path={router.route}
				/>

				<section className="container py-10 lg:py-14">
					<div className="max-w-3xl mx-auto">
						<header className="text-center mb-8">
							<span className="inline-block text-xs font-medium tracking-wide uppercase text-secondary-600 mb-2">
								Últim pas
							</span>
							<h1 className="font-headings text-3xl lg:text-4xl leading-tight m-0">
								Què us ve de gust?
							</h1>
							<p className="text-base text-primary-400 mt-3 mb-0">
								Tria el que més us interessi i us proposarem
								escapades a mida. Ho pots canviar quan vulguis
								des del teu compte.
							</p>
						</header>

						<form
							onSubmit={handleSubmit}
							className="form bg-white rounded-2xl border border-primary-50 shadow-sm p-6 lg:p-8"
						>
							<AuthAlert>{errorMessage}</AuthAlert>

							{INTEREST_GROUPS.map((group) => (
								<ChoiceGroup
									key={group.key}
									name={group.field}
									label={group.label}
									options={group.options}
									value={selection[group.key]}
									onChange={(value) =>
										setSelection((previous) => ({
											...previous,
											[group.key]: value,
										}))
									}
									multiple
									className="mb-4"
								/>
							))}

							<div className="border-t border-primary-50 pt-5 mt-2 flex flex-wrap items-center justify-between gap-3">
								<p className="m-0 text-sm text-primary-400">
									{isReadyToSubmit
										? "Ja ho tens tot: som-hi!"
										: `Tria almenys una opció de: ${missingGroups
												.map((group) =>
													group.label.toLowerCase(),
												)
												.join(", ")}.`}
								</p>
								<button
									type="submit"
									className="button button__primary button__med w-auto"
									disabled={!isReadyToSubmit || isSubmitting}
								>
									{isSubmitting ? "Desant…" : "Continuar"}
								</button>
							</div>
						</form>
					</div>
				</section>
			</div>
		</>
	);
};

export default CompleteAccount;
