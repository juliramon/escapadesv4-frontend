import Link from "next/link";

const PublicContentBox = ({ type, slug, cover, title, subtitle, location }) => {
  let shortenedSubtitle = subtitle.slice(0, 105);
  let path;
  if (type === "activity") {
    path = "activitats";
  } else if (type === "place") {
    path = "allotjaments";
  } else if (type === "story") {
    path = "histories";
  }
  return (
    <article className="flex flex-wrap items-center product__item">
      <Link href={`/${path}/${slug}`}>
        <a
          title={title}
          className="p-2 rounded-xl border border-primary-200 flex flex-wrap items-center mb-3 flex-1"
        >
          <div className="w-full md:w-1/3">
            <div className="rounded-xl aspect-w-3 aspect-h-2 overflow-hidden">
              <picture>
                <img
                  src={cover}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </picture>
            </div>
          </div>
          <div className="w-full md:w-2/3 pt-4 md:pt-0 md:pl-5 lg:pl-10">
            <h3 className="my-0 text-primary-600">{title}</h3>
            <p className="text-15 my-0 text-primary-400 font-light">
              {shortenedSubtitle}...
            </p>
            <div
              className="mt-3 flex items-center text-xs tracking-wider
            text-secondary-500"
            >
              <span className="bg-primary-200 text-primary-400 rounded-md px-2 py-1 mr-1">
                {location}
              </span>
            </div>
          </div>
        </a>
      </Link>
    </article>
  );
};

export default PublicContentBox;
