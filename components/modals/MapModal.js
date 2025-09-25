import GoogleMapReact from "google-map-react";

const MapModal = ({
	visibility,
	hideModal,
	center,
	getMapOptions,
	renderMarker,
}) => {
	return (
		<div className={`modal ${visibility == true ? "active" : ""}`}>
			<div className="modal__wrapper modal--xl">
				<div className="modal__header">
					<span>Activitats al mapa</span>
					<button
						onClick={() => hideModal()}
						className="modal__close"
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
					<GoogleMapReact
						bootstrapURLKeys={{
							key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
						}}
						defaultCenter={center}
						defaultZoom={5}
						options={getMapOptions}
						yesIWantToUseGoogleMapApiInternals
						onGoogleApiLoaded={({ map, maps }) =>
							renderMarker(map, maps)
						}
					/>
				</div>
			</div>
		</div>
	);
};

export default MapModal;
