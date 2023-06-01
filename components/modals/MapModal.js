import GoogleMapReact from "google-map-react";

const MapModal = ({
  visibility,
  hideModal,
  center,
  getMapOptions,
  renderMarker,
}) => {
  return (
    <div className="modal__wrapper block w-full h-full fixed top-0 left-0 z-50">
      <div className="modal__overlay bg-black bg-opacity-50 absolute top-0 left-0 w-full h-full"></div>
      <div className="modal__container w-full h-full relative z-50 border-none rounded-md">
        <div className="modal__body map p-0 w-full h-full">
          <button
            className="modal__close absolute z-50 right-3 top-3"
            onClick={() => hideModal(!visibility)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-x"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              strokeWidth="3"
              stroke="#ffffff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
            }}
            defaultCenter={center}
            defaultZoom={8}
            options={getMapOptions}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => renderMarker(map, maps)}
          />
        </div>
      </div>
    </div>
  );
};

export default MapModal;
