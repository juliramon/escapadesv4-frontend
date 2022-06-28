import Link from "next/link";

const PublicSquareBox = ({
  type,
  slug,
  cover,
  placeType,
  title,
  duration,
  location,
  website,
  categoria,
  rating,
}) => {
  let secureWebsite, shortenedLocation, buttonLight;
  if (website.includes("https://") || website.includes("http://")) {
    secureWebsite = website;
  } else {
    secureWebsite = `https://${website}`;
  }
  if (location.props) {
    if (location.props.children.length > 35) {
      shortenedLocation = location.props.children.slice(0, 35) + "...";
    } else {
      shortenedLocation = location.props.children;
    }
  } else {
    if (location.length > 35) {
      shortenedLocation = location.slice(0, 35) + "...";
    } else {
      shortenedLocation = location;
    }
  }
  let linkPath, tipus, icon;
  if (type === "activity") {
    linkPath = "activitats";
    tipus = "Activitat";
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-route"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#00206B"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="5" r="2" />
        <path d="M12 19h4.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h3.5" />
      </svg>
    );
    buttonLight = undefined;
  } else if (type === "place") {
    linkPath = "allotjaments";
    tipus = "Allotjament";
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-bed"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#00206B"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M3 7v11m0 -4h18m0 4v-8a2 2 0 0 0 -2 -2h-8v6" />
        <circle cx="7" cy="10" r="1" />
      </svg>
    );
    buttonLight = (
      <a
        href={secureWebsite}
        title="Reservar"
        className="button button__secondary button__med w-full justify-center"
        target="_blank"
        rel="nofollow"
      >
        Reservar
      </a>
    );
  }

  let categoryModified;
  if (categoria) {
    if (categoria[0].includes("romantica")) {
      categoryModified = "romàntica";
    } else if (categoria[0].includes("gastronomica")) {
      categoryModified = "gastronòmica";
    } else if (categoria[0].includes("aventura")) {
      categoryModified = `d'aventura`;
    } else if (categoria[0].includes("relax")) {
      categoryModified = "de relax";
    } else {
      categoryModified = categoria;
    }
  }

  let placeTypeModified;
  if (placeType) {
    if (placeType[0].includes("hotel")) {
      placeTypeModified = "Hotel";
    } else if (placeType[0].includes("casarural")) {
      placeTypeModified = "Casa rural";
    } else if (placeType[0].includes("apartament")) {
      placeTypeModified = "Apartament";
    } else if (placeType[0].includes("carabana")) {
      placeTypeModified = "Carabana";
    } else if (placeType[0].includes("casaarbre")) {
      placeTypeModified = "Casa arbre";
    } else if (placeType[0].includes("refugi")) {
      placeTypeModified = "Refugi";
    }
  }

  let additionalInfoRef, additionalInfoSVG;
  if (duration) {
    additionalInfoRef = `${duration} hores`;
    additionalInfoSVG = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-route"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z"></path>
        <circle cx="6" cy="19" r="2"></circle>
        <circle cx="18" cy="5" r="2"></circle>
        <path d="M12 19h4.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h3.5"></path>
      </svg>
    );
  } else {
    additionalInfoSVG = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-tent"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M11 14l4 6h6l-9 -16l-9 16h6l4 -6" />
      </svg>
    );
    additionalInfoRef = placeTypeModified;
  }
  let modRating;
  if (rating && Number.isInteger(rating)) {
    modRating = `${rating.toString()}.0`;
  }

  const coverPath = cover.substring(0, 51);
  const imageId = cover.substring(63);
  const coverImg = `${coverPath}w_246,h_180,c_fill/${imageId}`;

  return (
    <div className="w-full md:w-1/2 lg:w-1/4 px-2 py-4 product__item">
      <div className="overflow-hidden">
        <Link href={`/${linkPath}/${slug}`}>
          <a className="relative block">
            <div className="aspect-w-4 aspect-h-3 relative rounded overflow-hidden">
              <picture className="w-full h-full">
                <source srcSet={coverImg} />
                <img
                  src={coverImg}
                  data-src={coverImg}
                  alt={title}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  width="400"
                  height="300"
                />
              </picture>
            </div>
            <div className="absolute top-3 right-3 bg-white inline-block w-auto h-auto rounded-md text-primary-500 px-2 py-1 text-sm">
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-tabler icon-tabler-star mr-1"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#fbbf24"
                  fill="#fbbf24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                </svg>
                {modRating || rating}
              </div>
            </div>
            <div className="pt-4 flex flex-col justify-between">
              <div className="mb-1 flex items-center text-xs tracking-wider text-secondary-500">
                <div className="mr-1">{additionalInfoSVG}</div>
                <span className="uppercase">{tipus}</span>
                <span className="mx-1">·</span>
                <span className="uppercase">{additionalInfoRef}</span>
              </div>
              <h3 className="mt-0 mb-0 text-primary-600">{title}</h3>
              <p className="text-base my-0 text-primary-500">
                Escapada {categoryModified} a {shortenedLocation}
              </p>
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default PublicSquareBox;
