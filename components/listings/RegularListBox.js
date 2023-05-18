import Link from "next/link";
import React from "react";

const RegularListBox = ({
  slug,
  cover,
  title,
  subtitle,
  avatar,
  owner,
  date,
}) => {
  let publicationDate = new Date(date).toLocaleDateString("ca-es", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const coverPath = cover.substring(0, 51);
  const imageId = cover.substring(63);
  const coverImg = `${coverPath}w_475,h_318,c_fill/${imageId}`;

  const avatarPath = avatar.substring(0, 51);
  const avatarId = avatar.substring(63);
  const avatarImg = `${avatarPath}w_32,h_32,c_fill/${avatarId}`;
  return (
    <article className="lists__item">
      <Link href={`/llistes/${slug}`}>
        <a
          title={title}
          className="flex flex-wrap md:flex-nowrap items-stretch"
        >
          <div className="w-full md:w-2/3 p-6 md:py-6 md:px-8">
            <div className="mb-4">
              <h3 className="text-xl">{title}</h3>
              <div className="mt-2 text-primary-400 font-light line-clamp-2">
                {subtitle}
              </div>
            </div>
            <div className="flex items-center border-t border-primary-200 pt-4">
              <div className="w-8 h-8 mr-2 rounded-full overflow-hidden">
                <picture>
                  <img
                    src={avatarImg}
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
          <div className="w-full md:w-1/3 overflow-hidden order-first md:order-none md:mb-0 rounded-md">
            <picture>
              <img
                src={coverImg}
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

export default RegularListBox;
