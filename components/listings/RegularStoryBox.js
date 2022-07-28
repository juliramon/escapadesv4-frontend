import Link from "next/link";
import React from "react";

const RegularStoryBox = ({
  slug,
  cover,
  title,
  subtitle,
  avatar,
  owner,
  date,
}) => {
  let shortenedSubtitle = subtitle.slice(0, 105);
  let publicationDate = new Date(date).toLocaleDateString("ca-es", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <article className="py-6 md:px-10 stories__item">
      <Link href={`/histories/${slug}`}>
        <a title={title} className="flex flex-wrap md:flex-nowrap items-center">
          <div className="w-full md:w-1/2 md:py-4 pr-8">
            <div className="mb-4">
              <h3 className="text-xl md:text-2xl">{title}</h3>
              <p className="text-lg mt-2">{shortenedSubtitle}...</p>
            </div>
            <div className="flex items-center border-t border-primary-200 pt-4">
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
              <div className="flex items-center">
                <span className="text-sm inline-block">{owner}</span>
                <span className="mx-2 opacity-40 inline-block">–</span>
                <span className="text-sm inline-block opacity-40">
                  {publicationDate}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-md w-full md:w-1/2 h-auto overflow-hidden order-first md:order-none mb-6 md:mb-0">
            <div className="aspect-w-3 aspect-h-2">
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
          </div>
        </a>
      </Link>
    </article>
  );
};

export default RegularStoryBox;
