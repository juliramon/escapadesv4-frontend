import Link from "next/link";

const StoryListing = ({ story, index }) => {
	const createdDate = new Date(story.createdAt).toLocaleDateString("ca-es", {
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
		<Link href={"histories/" + story.slug} key={index}>
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
};

export default StoryListing;
