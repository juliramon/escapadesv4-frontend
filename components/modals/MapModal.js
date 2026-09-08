import ListingsMap from "../maps/ListingsMap";

/**
 * Modal amb el mapa del llistat.
 *
 * El mapa només es munta quan el modal està obert: abans es renderitzava
 * sempre, de manera que totes les pàgines de llistat carregaven l'API de
 * Google Maps encara que ningú obrís el mapa.
 */
const MapModal = ({ visibility, hideModal, items = [] }) => {
	const count = items.filter(
		(item) => item && item.lat !== null && item.lng !== null
	).length;

	return (
		<div className={`modal ${visibility == true ? "active" : ""}`}>
			<div className="modal__wrapper modal--xl">
				<div className="modal__header">
					<span>
						Mapa d&apos;escapades
						{count ? (
							<span className="text-15 text-grey-400 ml-2">
								{count}{" "}
								{count === 1 ? "resultat" : "resultats"}
							</span>
						) : null}
					</span>
					<button
						onClick={() => hideModal()}
						className="modal__close"
						aria-label="Tancar el mapa"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="icon icon-tabler icon-tabler-x"
							width={24}
							height={24}
							viewBox="0 0 24 24"
							strokeWidth="2"
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
							<line x1={18} y1={6} x2={6} y2={18}></line>
							<line x1={6} y1={6} x2={18} y2={18}></line>
						</svg>
					</button>
				</div>
				<div className="modal__body h-full p-0 overflow-hidden">
					{visibility ? <ListingsMap items={items} /> : null}
				</div>
			</div>
		</div>
	);
};

export default MapModal;
