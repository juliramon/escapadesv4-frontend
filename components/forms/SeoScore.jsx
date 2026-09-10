/**
 * Indicadors visuals de l'anàlisi SEO.
 *
 * La puntuació surt a dos llocs: petita, dins de la pestanya de SEO, perquè es
 * vegi des de qualsevol punt del formulari, i gran, dins de la pestanya, amb
 * la llista de comprovacions que l'expliquen.
 */

const LEVEL_TONES = {
	good: {
		text: "text-emerald-700",
		bg: "bg-emerald-50",
		border: "border-emerald-200",
		stroke: "#059669",
		label: "Bé",
	},
	ok: {
		text: "text-amber-700",
		bg: "bg-amber-50",
		border: "border-amber-200",
		stroke: "#d97706",
		label: "Millorable",
	},
	poor: {
		text: "text-red-700",
		bg: "bg-red-50",
		border: "border-red-200",
		stroke: "#dc2626",
		label: "Fluix",
	},
};

const STATUS_ICONS = {
	ok: {
		className: "text-emerald-600",
		path: "M5 12l5 5l10 -10",
	},
	warn: {
		className: "text-amber-600",
		path: "M12 9v4M12 17h.01M10.24 4.76l-8.1 13.5A2 2 0 0 0 3.9 21h16.2a2 2 0 0 0 1.76 -2.74l-8.1 -13.5a2 2 0 0 0 -3.52 0z",
	},
	error: {
		className: "text-red-600",
		path: "M18 6l-12 12M6 6l12 12",
	},
};

const CheckIcon = ({ status }) => {
	const icon = STATUS_ICONS[status] || STATUS_ICONS.warn;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={16}
			height={16}
			viewBox="0 0 24 24"
			strokeWidth="2"
			stroke="currentColor"
			fill="none"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={`${icon.className} shrink-0 mt-0.5`}
			aria-hidden="true"
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d={icon.path} />
		</svg>
	);
};

/** Pastilla petita, pensada per anar dins de l'etiqueta de la pestanya. */
const SeoScoreBadge = ({ score, level, className = "" }) => {
	const tone = LEVEL_TONES[level] || LEVEL_TONES.poor;
	return (
		<span
			className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border ${tone.bg} ${tone.text} ${tone.border} ${className}`}
			title={`Puntuació SEO: ${score} sobre 100 (${tone.label})`}
		>
			{score}
		</span>
	);
};

/**
 * Rodona compacta amb el percentatge a dins, per a les files dels llistats.
 *
 * És la mateixa lectura que el dial gran de la pestanya de SEO, però a mida de
 * fila: prou petita per conviure amb el títol i la data, i prou clara per
 * distingir d'una passada quines fitxes necessiten feina.
 */
const SeoScoreRing = ({ score, level, size = 42, label = "SEO" }) => {
	const tone = LEVEL_TONES[level] || LEVEL_TONES.poor;
	const stroke = 4;
	const radius = (size - stroke) / 2;
	const circumference = 2 * Math.PI * radius;
	const progress = Math.max(0, Math.min(100, score));

	return (
		<span
			className="relative inline-flex items-center justify-center shrink-0"
			style={{ width: size, height: size }}
			title={`${label}: ${score} % · ${tone.label}`}
			aria-label={`${label}: ${score} per cent, ${tone.label}`}
			role="img"
		>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="-rotate-90"
				aria-hidden="true"
			>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="#e5e7eb"
					strokeWidth={stroke}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke={tone.stroke}
					strokeWidth={stroke}
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={
						circumference - (progress / 100) * circumference
					}
					style={{ transition: "stroke-dashoffset 300ms ease" }}
				/>
			</svg>
			<span
				className={`absolute inset-0 flex items-center justify-center text-[10px] font-medium leading-none ${tone.text}`}
			>
				{score}%
			</span>
		</span>
	);
};

/** Rodona amb la puntuació, per encapçalar el panell de SEO. */
const SeoScoreDial = ({ score, level }) => {
	const tone = LEVEL_TONES[level] || LEVEL_TONES.poor;
	const radius = 26;
	const circumference = 2 * Math.PI * radius;
	const progress = Math.max(0, Math.min(100, score));

	return (
		<div className="flex items-center gap-3">
			<div className="relative w-16 h-16 shrink-0">
				<svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
					<circle
						cx="32"
						cy="32"
						r={radius}
						fill="none"
						stroke="#e5e7eb"
						strokeWidth="6"
					/>
					<circle
						cx="32"
						cy="32"
						r={radius}
						fill="none"
						stroke={tone.stroke}
						strokeWidth="6"
						strokeLinecap="round"
						strokeDasharray={circumference}
						strokeDashoffset={
							circumference - (progress / 100) * circumference
						}
					/>
				</svg>
				<span
					className={`absolute inset-0 flex items-center justify-center text-lg font-semibold ${tone.text}`}
				>
					{score}
				</span>
			</div>
			<div>
				<p className="m-0 text-sm font-medium text-primary-500">
					Puntuació SEO
				</p>
				<p className={`m-0 text-xs ${tone.text}`}>{tone.label}</p>
			</div>
		</div>
	);
};

/** Llista de comprovacions, ordenada pels problemes primer. */
const SeoCheckList = ({ checks }) => {
	const order = { error: 0, warn: 1, ok: 2 };
	const sorted = [...checks].sort(
		(a, b) => order[a.status] - order[b.status],
	);

	return (
		<ul className="m-0 p-0 list-none space-y-2.5">
			{sorted.map((check) => (
				<li key={check.id} className="flex items-start gap-2">
					<CheckIcon status={check.status} />
					<span className="text-xs leading-snug">
						<span className="block text-primary-500 font-medium">
							{check.label}
						</span>
						{check.hint ? (
							<span className="block text-primary-400">
								{check.hint}
							</span>
						) : null}
					</span>
				</li>
			))}
		</ul>
	);
};

export {
	SeoScoreBadge,
	SeoScoreRing,
	SeoScoreDial,
	SeoCheckList,
	LEVEL_TONES,
};
