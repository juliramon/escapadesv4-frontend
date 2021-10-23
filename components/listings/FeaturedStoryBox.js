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
            <picture>
              <source srcset={cover} />
              <img
                src={cover}
                data-src={cover}
                width="400"
                height="300"
                loading="lazy"
                alt={title}
              />
            </picture>
            <div className="listing-content">
              <h3 className="listing-title">{title}</h3>
              <div className="author-details">
                <div className="avatar">
                  <picture>
                    <source srcset={avatar} />
                    <img
                      src={avatar}
                      data-src={avatar}
                      alt={owner}
                      width="60"
                      height="60"
                      loading="lazy"
                    />
                  </picture>
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
