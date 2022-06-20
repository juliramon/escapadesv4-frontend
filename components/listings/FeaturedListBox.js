import React from "react";
import Link from "next/link";

const FeaturedListBox = ({
  slug,
  cover,
  title,
  subtitle,
  avatar,
  owner,
  date,
}) => {
  let shortenedSubtitle = subtitle.slice(0, 120);
  let publicationDate = new Date(date).toLocaleDateString("ca-es", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <Link href={`/llistes/${slug}`}>
      <a
        title={title}
        className="block relative rounded overflow-hidden px-8 pt-24 lg:pt-48 pb-8 text-white"
      >
        <div className="bg-primary-500 bg-opacity-40 absolute top-0 left-0 w-full h-full z-40"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <picture>
            <img
              src={cover}
              alt={title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </picture>
        </div>

        <div className="relative z-40 w-full md:w-9/12 md:py-4 pr-8">
          <div className="mb-4">
            <h3 className="text-xl md:text-2xl text-white">{title}</h3>
            <p className="text-lg mt-2 text-white">{shortenedSubtitle}...</p>
          </div>
          <div className="flex items-center border-t border-primary-200 pt-4">
            <div className="w-12 h-12 mr-4 border-2 border-white p-1 rounded-full overflow-hidden">
              <picture>
                <img
                  src={avatar}
                  alt={owner}
                  width="48"
                  height="48"
                  className="w-full h-full object-cover object-center rounded-full"
                  loading="lazy"
                />
              </picture>
            </div>
            <div className="flex flex-wrap items-center">
              <span class="text-sm inline-block">{owner}</span>
              <span className="mx-2 inline-block">–</span>
              <span className="text-sm inline-block">{publicationDate}</span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default FeaturedListBox;
