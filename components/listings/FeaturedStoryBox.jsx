import Link from "next/link";
import { cloudinaryUrl } from "../../utils/cloudinary";

const FeaturedStoryBox = ({ story, index }) => {
	const createdDate = new Date(story.createdAt).toLocaleDateString("ca-es", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	const coverImg = cloudinaryUrl(story.cover, "w_1729,h_973,c_fill");
	const coverImgWebp = cloudinaryUrl(story.cover, "f_webp,w_1729,h_973,c_fill");
	const coverImgWebpMobile = cloudinaryUrl(story.cover, "f_webp,w_450,h_337,c_fill");

	const avatarImg = cloudinaryUrl(story.owner.avatar, "w_24,h_24,c_fill");

	return (
		<Link href={"histories/" + story.slug} key={index}>
			<a className="relative">
				<picture className="block aspect-[4/3] md:aspect-[16/9] relative rounded-2xl overflow-hidden">
					{coverImgWebpMobile ? (
						<source
							srcSet={coverImgWebpMobile}
							media="(max-width: 767px)"
							type="image/webp"
						/>
					) : null}
					{coverImgWebp ? (
						<source
							srcSet={coverImgWebp}
							media="(min-width: 768px)"
							type="image/webp"
						/>
					) : null}
					<img
						src={coverImg}
						alt={story.title}
						className={"w-full h-full object-cover"}
						width={450}
						height={337}
						loading={index === 0 ? "eager" : "lazy"}
						fetchPriority={index === 0 ? "high" : "auto"}
					/>
				</picture>

				<div className="w-full md:w-fit pt-6 pb-5 md:pl-6 md:pr-8 relative md:absolute md:bottom-0 md:left-0 md:right-0 bg-white rounded-tr-2xl md:max-w-2xl md:min-w-[672px]">
					<div className="hidden md:inline-block absolute -top-4 left-0">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 10 10"
							transform="rotate(180)"
						>
							<path
								d="M0 0a9.994 9.994 0 0 1 10 10V0Z"
								fill="#fff"
							/>
						</svg>
					</div>
					<span className="inline-flex items-center text-primary-500 bg-white rounded-lg py-1 px-2 border border-gray-300 mb-2.5">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={18}
							height={18}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mr-1 text-yellow-500"
						>
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" />
						</svg>
						<span className="text-sm inline-block relative top-px">
							Destacada
						</span>
					</span>
					<h2 className="my-0 text-xl md:text-2xl font-medium font-body">
						{story.title}
					</h2>
					<div className="flex items-center mt-2">
						<div className="w-6 h-6 mr-2 rounded-full overflow-hidden">
							<picture>
								<img
									src={avatarImg}
									alt={story.owner.fullName}
									width={32}
									height={32}
									className={"w-full h-full object-cover"}
									loading={index === 0 ? "eager" : "lazy"}
									fetchPriority={
										index === 0 ? "high" : "auto"
									}
								/>
							</picture>
						</div>
						<div className="flex items-center justify-center gap-x-1.5">
							<span className="text-15 text-grey-400 inline-block">
								Per
							</span>
							<span className="text-15 text-grey-400 inline-block">
								{story.owner.fullName}
							</span>
							<span className="inline-block">–</span>
							<span className="text-15 text-grey-400 inline-block underline">
								Seguir llegint
							</span>
						</div>
					</div>
					<div className="hidden md:inline-block absolute bottom-0 -right-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 10 10"
							transform="rotate(180)"
						>
							<path
								d="M0 0a9.994 9.994 0 0 1 10 10V0Z"
								fill="#fff"
							/>
						</svg>
					</div>
				</div>
			</a>
		</Link>
	);
};

export default FeaturedStoryBox;
