import React from "react";
import Link from "next/link";

const FeaturedStoryBox = ({ slug, cover, title, avatar, owner }) => {
  return (
    <div className="w-full p-2 border-none">
      <Link href={`/histories/${slug}`}>
        <a
          title={title}
          className="block w-full h-full overflow-hidden rounded-md"
        >
          <div className="relative w-full h-full aspect-w-3 aspect-h-4">
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-30"></div>
            <picture className="w-full h-full absolute top-0 left-0">
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
            <div className="absolute top-0 left-0 w-full h-full z-40">
              <div className="absolute bottom-0 px-5 pb-10">
                <div className="author-details text-white text-center">
                  <div className="w-14 h-14 mb-3 rounded-full border-2 border-white p-1 overflow-hidden mx-auto">
                    <picture>
                      <source srcSet={avatar} />
                      <img
                        src={avatar}
                        data-src={avatar}
                        alt={owner}
                        className="w-full h-full object-cover object-center rounded-full"
                        width="60"
                        height="60"
                        loading="lazy"
                      />
                    </picture>
                  </div>
                </div>
                <h3 className="text-white text-center text-xl h-24">{title}</h3>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default FeaturedStoryBox;
