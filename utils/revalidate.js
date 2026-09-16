/**
 * Demana el refresc de les pàgines públiques que toca un desat del panell.
 *
 * No bloqueja mai el desat ni ensenya cap error: si la crida falla, la pàgina
 * es refresca igualment pel seu compte, com a molt dos minuts després.
 */
const revalidatePaths = async (paths) => {
	if (typeof window === "undefined") return;
	const list = (Array.isArray(paths) ? paths : [paths]).filter(Boolean);
	if (!list.length) return;
	try {
		await fetch("/api/revalidate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ paths: list }),
		});
	} catch (error) {
		console.warn(
			"[revalidate] no s'han pogut refrescar les pàgines:",
			error.message,
		);
	}
};

export { revalidatePaths };
