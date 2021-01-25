import Link from "next/link";

const PublicContentBox = ({
  id,
  slug,
  image,
  title,
  subtitle,
  location,
  type,
}) => {
  let shortenedSubtitle = subtitle.slice(0, 105);
  let path;
  if (type === "activity") {
    path = "activitats";
  } else if (type === "place") {
    path = "allotjaments";
  } else if (type === "story") {
    path = "histories";
  }
  return (
    <div
      id="listing"
      className="d-flex align-items-center justify-content-between"
    >
      <Link href={`/${path}/${slug}`}>
        <a title={title} className="listing-wrapper d-flex align-items-center">
          <div className="listing-cover">
            <img src={image} alt={title} />
          </div>
          <div className="listing-content">
            <h3 className="listing-title">{title}</h3>
            <p className="listing-subtitle">{shortenedSubtitle}...</p>
            <p className="listing-location">{location}</p>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default PublicContentBox;
