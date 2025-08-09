import Link from "next/link";

const NavigationCategoryBox = ({ icon, slug, pluralName, illustration }) => {
	const upperName = pluralName.charAt(0).toUpperCase() + pluralName.slice(1);
	return (
		<Link href={`/${slug}`}>
			<a
				title={upperName}
				className="menu__link relative before:content-[''] before:absolute before:-inset-2 before:bg-gray-100 before:rounded-xl before:z-[-1] before:opacity-0 before:transition-all before:duration-300 before:ease-in-out hover:before:opacity-100"
			>
				<picture className="inline-block mr-2">
					<img
						src={illustration}
						alt={upperName}
						className="w-9 h-auto lg:w-9"
						width={36}
						height={36}
					/>
				</picture>
				<div className="flex flex-col">
					<span className="text-sm">{upperName}</span>
					<span className="text-xs text-gray-500">
						Veure escapades
					</span>
				</div>
			</a>
		</Link>
	);
};

export default NavigationCategoryBox;
