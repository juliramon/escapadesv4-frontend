import React from "react";
import Link from "next/link";

const FeaturedListBox = ({
  slug,
  cover,
  title,
  subtitle,
  avatar,
  owner,
  date,
}) => {
  let shortenedSubtitle = subtitle.slice(0, 120);
  let publicationDate = new Date(date).toLocaleDateString("ca-es", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <div className="featured-list">
      <Link href={`/llistes/${slug}`}>
        <a title={title}>
          <div className="listing-cover">
            <div className="overlay"></div>
            <img src={cover} alt={title} />
          </div>
          <div className="listing-content">
            <h3 className="listing-title">{title}</h3>
            <p className="listing-subtitle">{shortenedSubtitle}...</p>
            <div className="author-details">
              <div className="author-avatar">
                <img src={avatar} alt={owner} />
              </div>
              <div className="author-name">
                <span>{owner}</span>
                <span className="timestamp">{`${publicationDate}`}</span>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default FeaturedListBox;
