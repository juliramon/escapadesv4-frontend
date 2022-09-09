import React from "react";

const FeaturedRegionBox = ({ image, name, slug }) => {
  return (
    <div className="w-full md:w-1/3 lg:w-1/5 px-2 py-4">
      <a href={slug} className="rounded-md overflow-hidden block">
        <picture>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            width=""
            height=""
            loading="lazy"
          />
        </picture>
      </a>
    </div>
  );
};

export default FeaturedRegionBox;
