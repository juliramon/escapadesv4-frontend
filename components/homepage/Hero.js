import SearchBar from "../homepage/SearchBar";

const Hero = ({ background_url, title, subtitle }) => {
  return (
    <>
      <section id="hero" className="relative pt-8 lg:pt-20">
        <div className="absolute top-0 left-0 w-full h-full hero__bg opacity-40"></div>
        <div className="container relative z-40">
          <div className="w-full lg:w-10/12 xl:w-8/12 lg:mx-auto">
            <div className="header-col left">
              <h1 className="text-2xl leading-tight md:leading-1.1 md:text-5xl">
                <span className="text-secondary-500 ">
                  Escapadesenparella.cat.{" "}
                </span>
                {title}
              </h1>
              <SearchBar />
            </div>
          </div>
        </div>
        <div className="bg-white absolute bottom-0 w-full h-20 z-30 hero__gradient"></div>
        <div
          id="animate-area"
          style={{ backgroundImage: `url(${background_url})` }}
        ></div>
      </section>
    </>
  );
};

export default Hero;
