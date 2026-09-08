import { useEffect, useState } from "react";
import AdSlot from "./AdSlot";

const STORAGE_KEY = "eep:anchor-ad-dismissed";

/**
 * Anunci ancorat a la part inferior en mòbil.
 *
 * Es pot tancar i el tancament es recorda durant la sessió, perquè no sigui
 * intrusiu. Només es munta per sota de 1024px: si el bloc existeix però està
 * amagat per CSS, AdSense el registra amb amplada 0 i falla amb
 * "No slot size for availableWidth=0".
 */
const MobileAnchorAd = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		let dismissed = false;
		try {
			dismissed = window.sessionStorage.getItem(STORAGE_KEY) === "1";
		} catch (err) {
			dismissed = false;
		}
		if (dismissed) return undefined;

		const query = window.matchMedia("(max-width: 1023px)");
		const sync = () => setIsVisible(query.matches);
		sync();

		if (query.addEventListener) {
			query.addEventListener("change", sync);
			return () => query.removeEventListener("change", sync);
		}
		query.addListener(sync);
		return () => query.removeListener(sync);
	}, []);

	const handleDismiss = () => {
		setIsVisible(false);
		try {
			window.sessionStorage.setItem(STORAGE_KEY, "1");
		} catch (err) {
			/* mode privat: no passa res, es tornarà a mostrar */
		}
	};

	if (!isVisible) return null;

	return (
		<>
			{/* Reserva l'espai que ocupa la barra fixa perquè no tapi el final
			    de la pàgina. */}
			<div className="h-[76px]" aria-hidden="true" />
			<div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-neutral-100 px-3 pt-1.5 pb-2 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
				<button
					type="button"
					onClick={handleDismiss}
					aria-label="Tancar anunci"
					className="absolute -top-3.5 right-3 w-7 h-7 rounded-full bg-white border border-neutral-200 shadow-sm inline-flex items-center justify-center text-grey-500"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={16}
						height={16}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M18 6l-12 12" />
						<path d="M6 6l12 12" />
					</svg>
				</button>
				<AdSlot placement="anchor" label="" />
			</div>
		</>
	);
};

export default MobileAnchorAd;
