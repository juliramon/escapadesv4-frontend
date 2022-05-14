import React from "react";
import Link from "next/link";

const FeaturedStoryBox = ({ slug, cover, title, avatar, owner }) => {
  return (
    <div id="listing" className="featured">
      <Link href={`/histories/${slug}`}>
        <a title={title} className="">
          <div className="listing-cover">
            <div className="overlay"></div>
            <picture className="w-full h-full">
              <source srcSet={cover} />
              <img
                src={cover}
                data-src={cover}
                className="w-full h-full object-cover object-center"
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
                    <source srcSet={avatar} />
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
