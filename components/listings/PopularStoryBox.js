import React from "react";
import Link from "next/link";

const PopularStoryBox = ({ slug, title, avatar, owner, cover, idx }) => {
  return (
    <div className="popular-listing">
      <Link href={`/histories/${slug}`}>
        <a
          title={title}
          className="listing-wrapper d-flex flex-column align-items-center"
        >
          <div className="listing-wrapper">
            <div className="left">
              <span className="index-ref">{idx}</span>
            </div>
            <div className="center">
              <div className="author-details">
                <div className="avatar-wrapper">
                  <img className="author-avatar" src={avatar} alt={owner} />
                </div>
                <span className="author-name">{owner}</span>
              </div>
              <div className="listing-title">
                <h3>{title}</h3>
              </div>
            </div>
            <div className="right">
              <div className="listing-cover">
                <img src={cover} alt={title} />
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default PopularStoryBox;
