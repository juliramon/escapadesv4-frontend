import { lengthState } from "../../utils/seo";

/**
 * Barra de llargada d'un camp de SEO.
 *
 * Ensenya d'un cop d'ull si el meta títol o la meta descripció es queden
 * curts, són a la franja bona o els tallarà Google. La franja recomanada surt
 * marcada damunt de la barra.
 */

const STATE_STYLES = {
	empty: { bar: "bg-gray-300", text: "text-primary-400" },
	short: { bar: "bg-amber-500", text: "text-amber-700" },
	ok: { bar: "bg-emerald-500", text: "text-emerald-700" },
	long: { bar: "bg-red-500", text: "text-red-700" },
};

const STATE_LABELS = {
	empty: "buit",
	short: "curt",
	ok: "correcte",
	long: "massa llarg",
};

const LengthMeter = ({ value, limits }) => {
	const length = String(value || "").length;
	const state = lengthState(value, limits);
	const styles = STATE_STYLES[state];
	// L'escala arriba una mica més enllà del màxim per veure quant se n'ha passat.
	const scale = limits.max * 1.25;
	const filled = Math.min(100, (length / scale) * 100);
	const minMark = (limits.min / scale) * 100;
	const maxMark = (limits.max / scale) * 100;

	return (
		<div className="mt-1.5">
			<div className="relative h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
				<div
					className={`h-full rounded-full transition-all duration-300 ${styles.bar}`}
					style={{ width: `${filled}%` }}
				/>
				<span
					className="absolute top-0 h-full w-px bg-white/80"
					style={{ left: `${minMark}%` }}
					aria-hidden="true"
				/>
				<span
					className="absolute top-0 h-full w-px bg-white/80"
					style={{ left: `${maxMark}%` }}
					aria-hidden="true"
				/>
			</div>
			<p className={`m-0 mt-1 text-xs ${styles.text}`}>
				{length} caràcters · {STATE_LABELS[state]} · recomanat entre{" "}
				{limits.min} i {limits.max}
			</p>
		</div>
	);
};

export default LengthMeter;
