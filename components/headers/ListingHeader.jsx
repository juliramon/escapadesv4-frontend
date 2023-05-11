import Fancybox from "../../utils/FancyboxUtils";

const ListingHeader = ({ title, subtitle, figCaption, image, sponsorData }) => {
  const coverPath = image.substring(0, 51);
  const imageId = image.substring(63);
  const coverImg = `${coverPath}w_400,h_300,c_fill/${imageId}`;
  return (
    <section className="pt-2">
      <div className="container relative">
        <div className="flex flex-wrap items-center justify-between bg-primary-50 rounded-md overflow-hidden">
          <div className="w-full md:w-8/12 xl:w-7/12 p-8 md:py-8 md:px-16">
            <div className="max-w-xl">
              <h1
                className="my-0 font-display"
                dangerouslySetInnerHTML={{ __html: title }}
              ></h1>
              <div
                className="mt-5 listing-header__description"
                dangerouslySetInnerHTML={{ __html: subtitle }}
              ></div>
              {figCaption ? (
                <figcaption className="text-sm mt-4 block">
                  📍 {figCaption}
                </figcaption>
              ) : null}
              {sponsorData ? sponsorData : null}
            </div>
          </div>
          <div className="w-full md:w-4/12 xl:w-4/12 overflow-hidden">
            {coverImg ? (
              <Fancybox
                options={{
                  infinite: true,
                }}
              >
                <div
                  className="cursor-pointer relative group overflow-hidden"
                  data-fancybox="gallery"
                  data-src={coverImg}
                  data-caption={figCaption}
                >
                  <div className="aspect-w-4 aspect-h-3 h-full w-full ">
                    <picture>
                      <img
                        src={coverImg}
                        alt={figCaption}
                        className="w-full h-full object-cover object-center scale-100 transition-all duration-300 ease-in-out group-hover:scale-105"
                        width={400}
                        height={300}
                        loading="eager"
                      />
                    </picture>
                  </div>
                  <span className="absolute bottom-4 right-4 bg-white rounded-md text-xs px-2.5 py-1.5 flex items-center hover:bg-primary-100 transition-all duration-300 ease-in-out">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1.5"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <line x1={3} y1={12} x2={6} y2={12}></line>
                      <line x1={12} y1={3} x2={12} y2={6}></line>
                      <line x1="7.8" y1="7.8" x2="5.6" y2="5.6"></line>
                      <line x1="16.2" y1="7.8" x2="18.4" y2="5.6"></line>
                      <line x1="7.8" y1="16.2" x2="5.6" y2="18.4"></line>
                      <path d="M12 12l9 3l-4 2l-2 4l-3 -9"></path>
                    </svg>
                    Click per ampliar
                  </span>
                </div>
              </Fancybox>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListingHeader;
