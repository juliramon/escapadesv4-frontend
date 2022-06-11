import React from "react";
import Link from "next/link";

const PopularStoryBox = ({ slug, title, avatar, owner, cover, idx }) => {
  return (
    <article className="w-full md:w-1/2 lg:w-1/3 px-6 pb-6">
      <Link href={`/histories/${slug}`}>
        <a title={title} className="flex items-start">
          <span className="text-3xl text-primary-400 text-opacity-30 inline-block mr-4">
            {idx}
          </span>
          <div className="w-3/4">
            <div className="flex items-center">
              <div className="rounded-full overflow-hidden w-6 h-6 mr-2">
                <picture>
                  <img
                    src={avatar}
                    alt={owner}
                    className="w-full h-full object-cover"
                    width={24}
                    height={24}
                    loading="lazy"
                  />
                </picture>
              </div>
              <span className="text-sm">{owner}</span>
            </div>
            <h3 className="mt-3 pr-5">{title}</h3>
          </div>

          <div className="w-20 h-20 rounded-full overflow-hidden">
            <picture>
              <img
                src={cover}
                alt={title}
                width={96}
                height={96}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </picture>
          </div>
        </a>
      </Link>
    </article>
  );
};

export default PopularStoryBox;
