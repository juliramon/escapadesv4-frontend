import Link from "next/link";
import styles from "../../styles/PublicSquareBox.module.scss";

const PublicSquareBox = ({
  type,
  slug,
  cover,
  title,
  subtitle,
  location,
  website,
}) => {
  let shortenedSubtitle = subtitle.slice(0, 70);
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
        className="btn btn-m btn-light"
        target="_blank"
        rel="nofollow"
      >
        Reservar
      </a>
    );
  }
  return (
    <div id="listingSquareBox" className={styles.listingSquareBox}>
      <Link href={`/${linkPath}/${slug}`}>
        <a className={styles.listingBoxWrapper}>
          <div
            className={styles.listingCover}
            style={{ backgroundImage: `url('${cover}')` }}
          ></div>
          <h3 className={styles.listingTitle}>{title}</h3>
          <p className={styles.listingSubtitle}>{shortenedSubtitle}...</p>
          <p className={styles.listingLocation}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-map-pin"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#00206B"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="12" cy="11" r="3" />
              <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
            </svg>
            {shortenedLocation}
          </p>
        </a>
      </Link>
      <div className={styles.buttons}>
        <a
          href={`/${linkPath}/${slug}`}
          title="Detalls"
          className="btn btn-m btn-dark"
        >
          Llegir-ne més
        </a>
        {buttonLight}
      </div>
    </div>
  );
};

export default PublicSquareBox;
