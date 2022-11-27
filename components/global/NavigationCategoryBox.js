import SVG from "react-inlinesvg";

const NavigationCategoryBox = ({ icon, slug, pluralName }) => {
	const upperName = pluralName.charAt(0).toUpperCase() + pluralName.slice(1);
	const svgIcon = <SVG src={icon} />;
	return (
		<a
			href={`/${slug}`}
			title="upperName"
			className="inline-flex whitespace-nowrap items-center p-2.5"
		>
			<span className="mr-1.5">{svgIcon}</span>
			<span className="text-sm">{upperName}</span>
		</a>
	);
};

export default NavigationCategoryBox;
