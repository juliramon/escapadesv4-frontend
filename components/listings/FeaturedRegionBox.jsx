import React from "react";

const FeaturedRegionBox = ({ image, name, slug }) => {
  return (
    <div className="w-full p-2 border-none">
      <a
        href={`escapades-catalunya/${slug}`}
        className="block w-full h-full overflow-hidden rounded-md"
        title={name}
      >
        <div className="relative w-full h-full aspect-w-3 aspect-h-4">
          <picture>
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              width="300"
              height="400"
              loading="lazy"
            />
          </picture>
        </div>
      </a>
    </div>
  );
};

export default FeaturedRegionBox;
