import Link from "next/link";
import React from "react";

const RegularStoryBox = ({ slug, cover, title, subtitle, avatar, owner }) => {
  let shortenedSubtitle = subtitle.slice(0, 105);
  return (
    <article className="py-6 md:px-10">
      <Link href={`/histories/${slug}`}>
        <a title={title} className="flex flex-wrap md:flex-nowrap items-center">
          <div className="w-full md:w-1/2 md:px-10 md:py-4">
            <div className="mb-5 pr-8">
              <h3 className="text-xl md:text-2xl">{title}</h3>
              <p className="text-lg mt-2">{shortenedSubtitle}...</p>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 mr-2 rounded-full overflow-hidden">
                <picture>
                  <img
                    src={avatar}
                    alt={owner}
                    width="32"
                    height="32"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </picture>
              </div>
              <span class="text-sm">{owner}</span>
            </div>
          </div>
          <div className="rounded w-full md:w-1/2 h-auto overflow-hidden order-first md:order-none mb-6 md:mb-0">
            <picture>
              <img
                src={cover}
                alt={title}
                width="240"
                height="240"
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

export default RegularStoryBox;
