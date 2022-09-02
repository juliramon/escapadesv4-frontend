import Link from "next/link";
import SearchBar from "../homepage/SearchBar";

const Hero = ({ background_url, background_url_mob, title, subtitle }) => {
  return (
    <>
      <section
        id="hero"
        className="relative flex items-center justify-center pt-8 pb-8 lg:pt-20 lg:pb-24"
      >
        <div className="container relative z-40">
          <div className="w-full lg:w-10/12 xl:w-8/12 lg:mx-auto">
            <div className="header-col left">
              <h1 className="text-2xl leading-tight md:leading-1.1 md:text-5xl">
                {title}
              </h1>
              <SearchBar />
            </div>
          </div>
        </div>
      </section>
      <div className="opacity-25" id="animate-area"></div>
    </>
  );
};

export default Hero;
