const NavigationCategoryBox = ({ icon, slug, pluralName }) => {
	const upperName = pluralName.charAt(0).toUpperCase() + pluralName.slice(1);
	return (
		<a
			href={`/${slug}`}
			title="upperName"
			className="inline-flex whitespace-nowrap items-center p-2.5"
		>
			<span className="text-sm">{upperName}</span>
		</a>
	);
};

export default NavigationCategoryBox;
