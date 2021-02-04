import React from "react";
import Link from "next/link";

const FeaturedStoryBox = ({ slug, cover, title, avatar, owner }) => {
  return (
    <div
      id="listing"
      className="d-flex align-items-center justify-content-between featured"
    >
      <Link href={`/histories/${slug}`}>
        <a
          title={title}
          className="listing-wrapper d-flex flex-column align-items-center"
        >
          <div className="listing-cover">
            <div className="overlay"></div>
            <img src={cover} alt={title} />
            <div className="listing-content">
              <h3 className="listing-title">{title}</h3>
              <div className="author-details">
                <div className="avatar">
                  <img src={avatar} alt={owner} />
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default FeaturedStoryBox;
