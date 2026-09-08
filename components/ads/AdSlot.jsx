import { useEffect, useRef, useState } from "react";
import AdBanner from "./AdBanner";

/**
 * AdSlot
 *
 * Embolcall dels blocs d'AdSense amb tres coses que `AdBanner` no fa sol:
 *
 *  1. Reserva alçada abans que carregui l'anunci, per no moure el contingut
 *     (Cumulative Layout Shift).
 *  2. Amaga el bloc sencer —etiqueta inclosa— quan AdSense no omple l'espai,
 *     mirant l'atribut `data-ad-status` que hi posa el propi script.
 *  3. Centralitza els slots i els formats en un sol lloc.
 *
 * NOTA: `slot` accepta el nom d'una col·locació (les claus de PLACEMENTS) o bé
 * un identificador d'AdSense directament. De moment reaprofitem els dos slots
 * que ja existien al compte; l'ideal és crear-ne un de dedicat per col·locació
 * per poder-ne llegir el rendiment per separat.
 */

const PLACEMENTS = {
	// Slot horitzontal existent.
	leaderboard: {
		slot: "9222117584",
		format: "auto",
		responsive: "true",
		minHeight: "min-h-[120px] md:min-h-[280px]",
	},
	inFeed: {
		slot: "9222117584",
		format: "auto",
		responsive: "true",
		minHeight: "min-h-[320px]",
	},
	// Slot lateral existent.
	sidebar: {
		slot: "4940975412",
		format: "auto",
		responsive: "true",
		minHeight: "min-h-[250px] lg:min-h-[600px]",
	},
	anchor: {
		slot: "9222117584",
		format: "horizontal",
		responsive: "true",
		minHeight: "min-h-[60px]",
	},
};

const AdSlot = ({
	placement = "leaderboard",
	slot,
	format,
	responsive,
	label = "Publicitat",
	className = "",
	containerClassName = "",
}) => {
	const config = PLACEMENTS[placement] || PLACEMENTS.leaderboard;
	const wrapperRef = useRef(null);
	const [isUnfilled, setIsUnfilled] = useState(false);

	useEffect(() => {
		const node = wrapperRef.current;
		if (!node) return undefined;

		const ins = node.querySelector("ins.adsbygoogle");
		if (!ins) return undefined;

		const readStatus = () => {
			if (ins.getAttribute("data-ad-status") === "unfilled") {
				setIsUnfilled(true);
			}
		};

		readStatus();

		const observer = new MutationObserver(readStatus);
		observer.observe(ins, {
			attributes: true,
			attributeFilter: ["data-ad-status"],
		});

		return () => observer.disconnect();
	}, []);

	if (isUnfilled) return null;

	return (
		<div
			ref={wrapperRef}
			className={`ad-slot ${config.minHeight} ${containerClassName}`}
		>
			{label ? (
				<span className="block text-10 uppercase tracking-widest text-grey-300 mb-1.5">
					{label}
				</span>
			) : null}
			<AdBanner
				customstyles={className}
				data-ad-slot={slot || config.slot}
				data-ad-format={format || config.format}
				data-full-width-responsive={responsive || config.responsive}
			/>
		</div>
	);
};

export default AdSlot;
