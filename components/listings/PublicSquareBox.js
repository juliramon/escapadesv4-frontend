import Link from "next/link";

const PublicSquareBox = ({
  type,
  slug,
  cover,
  placeType,
  title,
  subtitle,
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
        className="icon icon-tabler icon-tabler-route"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
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
        className="icon icon-tabler icon-tabler-tent"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
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
  const coverImg = `${coverPath}w_400,h_300,c_fill/${imageId}`;

  return (
    <div className="w-full md:w-1/2 lg:w-1/4 px-2 py-4 product__item">
      <div className="overflow-hidden">
        <Link href={`/${linkPath}/${slug}`}>
          <a title={title} className="relative block">
            <div className="aspect-w-4 aspect-h-3 relative rounded-md overflow-hidden">
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
                  className="icon icon-tabler icon-tabler-star mr-1"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#fbbf24"
                  fill="#fbbf24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                </svg>
                {modRating || rating}
              </div>
            </div>
            <div className="pt-3 flex flex-col justify-between">
              <span className="flex items-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-brand-safari text-secondary-500 mr-1.5"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <polyline points="8 16 10 10 16 8 14 14 8 16"></polyline>
                  <circle cx={12} cy={12} r={9}></circle>
                </svg>
                <span className="text-primary-400 opacity-80">
                  {shortenedLocation}
                </span>
              </span>
              <h3 className="mt-2 mb-1 text-primary-600">{title}</h3>
              <p className="text-15 my-0 text-primary-400 font-light leading-normal line-clamp-1">
                {subtitle}
              </p>
              <div className="mt-3 flex items-center text-xs tracking-wider text-secondary-500">
                <span className="bg-primary-200 text-primary-400 rounded-md px-2 py-1 mr-1 capitalize">
                  {categoryModified}
                </span>
                <span className="bg-primary-200 text-primary-400 rounded-md px-2 py-1 mr-1 capitalize">
                  {tipus}
                </span>
                <span className="bg-primary-200 text-primary-400 rounded-md px-2 py-1 capitalize">
                  {additionalInfoRef}
                </span>
              </div>
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default PublicSquareBox;
