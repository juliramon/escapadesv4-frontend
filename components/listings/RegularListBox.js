import Link from "next/link";
import React from "react";

const RegularListBox = ({
  slug,
  cover,
  title,
  subtitle,
  avatar,
  owner,
  date,
}) => {
  let shortenedSubtitle = subtitle.slice(0, 105);
  let publicationDate = new Date(date).toLocaleDateString("ca-es", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <Link href={`/llistes/${slug}`}>
      <a title={title} className="listing-wrapper">
        <div className="listing-cover">
          <img src={cover} alt={title} />
        </div>
        <div className="listing-content">
          <h3 className="listing-title">{title}</h3>
          <p className="listing-subtitle">{shortenedSubtitle}...</p>
          <div className="author-details">
            <div className="author-name">
              <span>{owner}</span>
              <span className="timestamp">{`${publicationDate}`}</span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default RegularListBox;
