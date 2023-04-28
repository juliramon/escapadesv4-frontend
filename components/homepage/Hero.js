import { useEffect } from "react";
import Glide from "@glidejs/glide";
import Link from "next/link";

const Hero = ({ mostRecentStories }) => {
  useEffect(() => {
    if (window !== undefined) {
      const underlinedElement = document.querySelector(".underlined-element");
      if (!underlinedElement) return;

      underlinedElement.classList.add("active");

      const sliderSelector = ".js-slider-cover";
      const sliderElement = document.querySelector(sliderSelector);

      if (!sliderElement) return;

      new Glide(sliderSelector, {
        type: "carousel",
        perView: 3,
        gap: 18,
        breakpoints: {
          1024: {
            perView: 2,
          },
          640: {
            perView: 1,
          },
        },
      }).mount();
    }
  });

  return (
    <>
      <section id="hero" className="flex flex-wrap items-stretch">
        <div className="w-full bg-primary-900 flex items-center justify-center verflow-hidden relative pt-20 pb-44 px-6 xl:px-20">
          <picture className="absolute inset-0 w-full h-full z-0 opacity-30">
            <img src="/shape.svg" className="w-full h-full object-cover" />
          </picture>
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

        <div className="w-full h-full xl:w-9/12 mx-auto -mt-24 rounded-md overflow-hidden px-6 xl:px-0">
          <div className="glide js-slider-cover">
            <div className="glide__track" data-glide-el="track">
              <div className="glide__slides">
                {mostRecentStories.length > 0
                  ? mostRecentStories.map((story) => {
                      const createdDate = new Date(
                        story.createdAt
                      ).toLocaleDateString("ca-es", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      });

                      const coverPath = story.cover.substring(0, 51);
                      const imageId = story.cover.substring(63);
                      const coverImg = `${coverPath}w_468,h_263,c_fill/${imageId}`;

                      const avatarPath = story.owner.avatar.substring(0, 51);
                      const ownerImageId = story.owner.avatar.substring(63);
                      const avatarImg = `${avatarPath}w_24,h_24,c_fill/${ownerImageId}`;

                      return (
                        <Link href={"histories/" + story.slug}>
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
                      );
                    })
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
