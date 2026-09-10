import { useEffect, useState } from "react";

/**
 * Estat de l'autoguardat, sempre a la vista dins de la barra de desar.
 *
 * Diu tres coses que abans no es podien saber: si hi ha canvis sense desar al
 * servidor, si l'esborrany local és fresc i de quan és.
 */

const relativeTime = (timestamp) => {
	const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
	if (seconds < 10) return "ara mateix";
	if (seconds < 60) return `fa ${seconds} s`;
	const minutes = Math.round(seconds / 60);
	if (minutes < 60) return `fa ${minutes} min`;
	const hours = Math.round(minutes / 60);
	return `fa ${hours} h`;
};

const DOT_COLORS = {
	saving: "bg-blue-500 animate-pulse",
	dirty: "bg-amber-500",
	saved: "bg-emerald-500",
	error: "bg-red-500",
	clean: "bg-gray-300",
};

const AutosaveIndicator = ({
	status = "idle",
	savedAt = null,
	isDirty = false,
	isSaving = false,
}) => {
	// El text diu "fa X"; sense aquest comptador es quedaria congelat.
	const [, setTick] = useState(0);

	useEffect(() => {
		if (!savedAt) return undefined;
		const timer = setInterval(() => setTick((value) => value + 1), 15000);
		return () => clearInterval(timer);
	}, [savedAt]);

	let tone = "clean";
	let label = "Sense canvis per desar";

	if (isSaving) {
		tone = "saving";
		label = "Desant al servidor…";
	} else if (status === "error") {
		tone = "error";
		label = "No s'ha pogut desar l'esborrany al navegador";
	} else if (status === "pending" && isDirty) {
		tone = "dirty";
		label = "Desant l'esborrany…";
	} else if (isDirty && savedAt) {
		tone = "dirty";
		label = `Canvis sense publicar · esborrany desat ${relativeTime(savedAt)}`;
	} else if (isDirty) {
		tone = "dirty";
		label = "Canvis sense desar";
	}

	return (
		<span
			className="inline-flex items-center gap-2 text-xs text-primary-400 whitespace-nowrap"
			aria-live="polite"
		>
			<span
				className={`w-2 h-2 rounded-full shrink-0 ${DOT_COLORS[tone]}`}
				aria-hidden="true"
			/>
			{label}
		</span>
	);
};

export default AutosaveIndicator;
export { relativeTime };
