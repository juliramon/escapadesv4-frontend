import Link from "next/link";

/**
 * Bastida de les pàgines d'autenticació.
 *
 * Login i registre eren dues columnes fixes (`w-3/12` i `w-9/12`) a totes les
 * mides: al mòbil quedava una franja de color de tres dits amb el formulari
 * espremut al costat. A més, cadascuna pintava el seu panell d'un color
 * diferent (`bg-primary-50` a l'una, `bg-primary-300` a l'altra), l'enllaç de
 * "ja tens compte?" surava amb `absolute` fora de tot contenidor i la
 * il·lustració es demanava amb una ruta relativa (`../../signup-graphic.svg`)
 * que es trencava segons la profunditat de la pàgina.
 *
 * Aquí queda una sola bastida: al mòbil, capçalera compacta i formulari a tota
 * l'amplada; a partir de `lg`, panell de marca a l'esquerra i formulari a la
 * dreta, amb la tipografia i els colors de la resta del web.
 */

const LOGO =
	"https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg";

const CheckIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={18}
		height={18}
		viewBox="0 0 24 24"
		strokeWidth="2.5"
		stroke="currentColor"
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
		className="text-secondary-500 shrink-0 mt-0.5"
		aria-hidden="true"
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<path d="M5 12l5 5l10 -10" />
	</svg>
);

/** El que s'hi guanya creant un compte. Surt al panell de marca. */
const DEFAULT_BENEFITS = [
	"Guarda les escapades que t'agraden i recupera-les quan vulguis",
	"Planifica el proper cap de setmana en parella sense perdre res de vista",
	"Rep les novetats i els descomptes per viatjar abans que ningú",
];

const AuthLayout = ({
	title,
	subtitle,
	/** Enllaç a l'altre camí del flux: de login a registre i a l'inrevés. */
	altAction = null,
	benefits = DEFAULT_BENEFITS,
	children,
	footer = null,
}) => (
	<div className="min-h-screen flex flex-col lg:flex-row bg-white">
		<aside className="relative overflow-hidden bg-primary-500 text-white px-6 py-6 lg:px-10 lg:py-10 lg:w-5/12 xl:w-4/12 lg:min-h-screen flex flex-col justify-between">
			{/* Taca de color de la marca, per no deixar el panell pla. */}
			<span
				className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-secondary-500 opacity-20 blur-3xl"
				aria-hidden="true"
			/>
			<span
				className="pointer-events-none absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-tertiary-500 opacity-10 blur-3xl"
				aria-hidden="true"
			/>

			<div className="relative">
				<Link href="/">
					<a className="inline-block">
						<img
							src={LOGO}
							className="w-32 lg:w-36 brightness-0 invert"
							alt="Escapadesenparella.cat"
						/>
					</a>
				</Link>
				<h2 className="hidden lg:block font-headings text-3xl xl:text-4xl leading-tight mt-10 text-white">
					Descobreix les millors escapades en parella a Catalunya.
				</h2>
				<ul className="hidden lg:flex list-none flex-col gap-y-3 mt-8 p-0 m-0">
					{benefits.map((benefit) => (
						<li key={benefit} className="flex items-start gap-x-2.5">
							<CheckIcon />
							<span className="text-15 text-white/80 leading-snug">
								{benefit}
							</span>
						</li>
					))}
				</ul>
			</div>

			<div className="relative hidden lg:block mt-10">
				<img
					src="/signup-graphic.svg"
					alt=""
					className="w-full max-w-xs"
					loading="eager"
				/>
			</div>
		</aside>

		<main className="flex-1 flex flex-col">
			{altAction ? (
				<div className="flex justify-end px-6 py-5 lg:px-10">
					<p className="m-0 text-15 text-primary-400">
						{altAction.label}{" "}
						<Link href={altAction.href}>
							<a className="text-primary-500 font-medium underline underline-offset-2 hover:text-secondary-600">
								{altAction.cta}
							</a>
						</Link>
					</p>
				</div>
			) : null}

			<div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-10">
				<div className="w-full max-w-md">
					<h1 className="font-headings text-3xl lg:text-4xl leading-tight m-0">
						{title}
					</h1>
					{subtitle ? (
						<p className="text-base text-primary-400 mt-3 mb-0">
							{subtitle}
						</p>
					) : null}
					<div className="mt-8">{children}</div>
					{footer ? <div className="mt-6">{footer}</div> : null}
				</div>
			</div>
		</main>
	</div>
);

export default AuthLayout;
