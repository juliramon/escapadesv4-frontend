import Link from "next/link";
import React from "react";

const RegularStoryBox = ({ slug, cover, title, subtitle, avatar, owner }) => {
  let shortenedSubtitle = subtitle.slice(0, 105);
  return (
    <div
      id="listing"
      className="d-flex align-items-center justify-content-between"
    >
      <Link href={`/histories/${slug}`}>
        <a title={title} className="listing-wrapper d-flex align-items-center">
          <div className="listing-cover">
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
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default RegularStoryBox;
