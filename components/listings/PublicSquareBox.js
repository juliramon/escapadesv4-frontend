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
    additionalInfoRef = `Activitat de ${duration} hores`;
    additionalInfoSVG = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-alarm"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <circle cx="12" cy="13" r="7" />
        <polyline points="12 10 12 13 14 13" />
        <line x1="7" y1="4" x2="4.25" y2="6" />
        <line x1="17" y1="4" x2="19.75" y2="6" />
      </svg>
    );
  } else {
    additionalInfoSVG = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-bed"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M3 7v11m0 -4h18m0 4v-8a2 2 0 0 0 -2 -2h-8v6" />
        <circle cx="7" cy="10" r="1" />
      </svg>
    );
    additionalInfoRef = placeTypeModified + " " + "amb encant";
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
          <a className="relative">
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
            <div className="absolute top-2 right-2 bg-white inline-block w-auto h-auto rounded-md text-primary-900 px-2 py-1 text-sm">
              {modRating || rating}
            </div>
            <div className="pt-3 flex flex-col justify-between">
              <h3 className="mt-0 mb-0 text-primary-600">{title}</h3>
              <p className="text-sm my-0 text-primary-500">
                Escapada {categoryModified} a {shortenedLocation}
              </p>
              <p className="mt-4 mb-1 flex items-center text-sm text-primary-500">
                <span className="mr-1.5">{additionalInfoSVG}</span>
                {additionalInfoRef}
              </p>
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default PublicSquareBox;
