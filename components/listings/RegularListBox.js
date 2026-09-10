import Link from "next/link";
import { cloudinaryUrl } from "../../utils/cloudinary";

const RegularListBox = ({
	index,
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
	const coverImg = cloudinaryUrl(cover, "w_475,h_318,c_fill");

	const avatarImg = cloudinaryUrl(avatar, "w_32,h_32,c_fill");
	return (
		<article className="w-full group">
			<Link href={`/llistes/${slug}`}>
				<a
					title={title}
					className="relative"
				>
					<picture className="block aspect-w-4 aspect-h-3 relative after:block after:w-full after:h-full after:z-20 after:content after:absolute after:inset-0 after:bg-primary-500 after:bg-opacity-0 rounded-2xl overflow-hidden">
						<img src={coverImg} alt={title} className={'w-full h-full object-cover'} width={400} height={300} loading={index === 0 || index === 1 || index === 2 ? 'eager' : 'lazy'} fetchpriority={index === 0 || index === 1 || index === 2 ? 'high' : 'low'} />
					</picture>

					<div className="w-full pt-3 pb-4">
						<h3 className="text-block font-normal my-0 pr-10">
							{title}
						</h3>
						<div className="flex items-center mt-2 md:mt-3">
							<div className="w-6 h-6 mr-2 rounded-full overflow-hidden">
								<picture>
									<img src={avatarImg} alt={owner} className={'w-full h-full object-cover'} width={32} height={32} loading={index === 0 || index === 1 || index === 2 ? 'eager' : 'lazy'} fetchpriority={index === 0 || index === 1 || index === 2 ? 'high' : 'low'} />
								</picture>
							</div>
							<div className="flex items-center justify-center">
								<span className="text-15 font-light inline-block text-grey-700">
									{owner}
								</span>
								<span className="mx-1.5 text-15 font-light inline-block text-grey-700">
									–
								</span>
								<span className="text-15 font-light inline-block text-grey-700">
									{publicationDate}
								</span>
							</div>
						</div>
					</div>
				</a>
			</Link>
		</article>
	);
};

export default RegularListBox;
