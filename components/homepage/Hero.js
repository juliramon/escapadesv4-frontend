import { useEffect } from "react";
import Link from "next/link";

const Hero = ({ mostRecentStories }) => {
  useEffect(() => {
    const underlinedElement = document.querySelector(".underlined-element");
    if (!underlinedElement) return;

    underlinedElement.classList.add("active");
  });

  return (
    <>
      <section id="hero" className="flex flex-wrap items-stretch">
        <div className="w-full bg-primary-900 flex items-center justify-center verflow-hidden relative pt-20 pb-44 px-6 xl:px-20 bg-geo">
          <div className="max-w-sm text-center relative z-10">
            <span className="uppercase text-sm text-white tracking-wider">
              escapadesenparella.cat
            </span>
            <h1 className="text-white mt-3 font-normal">
              La vostra propera escapada en parella{" "}
              <span className="underlined-element">comença aquí</span>
            </h1>
          </div>
        </div>

        <div className="w-full max-w-[1600px] mx-auto -mt-24 rounded-md overflow-hidden px-6">
          <div className="flex flex-wrap items-stretch -mx-2">
            {mostRecentStories.length > 0
              ? mostRecentStories.map((story, idx) => {
                  const createdDate = new Date(
                    story.createdAt
                  ).toLocaleDateString("ca-es", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  const coverPath = story.cover.substring(0, 51);
                  const imageId = story.cover.substring(63);
                  const coverImg = `${coverPath}w_507,h_285,c_fill/${imageId}`;

                  const avatarPath = story.owner.avatar.substring(0, 51);
                  const ownerImageId = story.owner.avatar.substring(63);
                  const avatarImg = `${avatarPath}w_24,h_24,c_fill/${ownerImageId}`;

                  return (
                    <article
                      key={idx}
                      className="w-full md:w-1/2 lg:w-1/3 px-2 mb-6 lg:mb-0"
                    >
                      <Link href={"histories/" + story.slug} key={idx}>
                        <a className="glide__slide relative ">
                          <picture className="block aspect-w-16 aspect-h-9 relative after:block after:w-full after:h-full after:z-20 after:content after:absolute after:inset-0 after:bg-primary-500 after:bg-opacity-0 shadow-md shadow-primary-100 rounded-md overflow-hidden">
                            <img
                              src={coverImg}
                              alt=""
                              className="w-full h-full object-cover rounded-md overflow-hidden"
                              loading="eager"
                            />
                          </picture>

                          <div className="w-full pl-4 pr-8 mx-auto mt-4">
                            <h2 className="text-primary-900 text-base my-0 leading-snug">
                              {story.title}
                            </h2>
                            <div className="flex items-center mt-3">
                              <div className="w-6 h-6 mr-2 rounded-full overflow-hidden">
                                <picture>
                                  <img
                                    src={avatarImg}
                                    alt={story.owner.fullName}
                                    width="24"
                                    height="24"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </picture>
                              </div>
                              <div className="flex items-center justify-center">
                                <span className="text-xs inline-block text-primary-900">
                                  {story.owner.fullName}
                                </span>
                                <span className="mx-1.5 text-primary-900 inline-block">
                                  –
                                </span>
                                <span className="text-xs inline-block text-primary-900">
                                  {createdDate}
                                </span>
                              </div>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </article>
                  );
                })
              : ""}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
