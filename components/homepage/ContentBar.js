import React, { useEffect, useState } from "react";
import ContentService from "../../services/contentService";
import NavigationCategoryBox from "../global/NavigationCategoryBox";
import FetchingSpinnerInline from "../global/FetchingSpinnerInline";

const ContentBar = () => {
	const service = new ContentService();
	const initialState = {
		categories: [],
		hasCategories: false,
	};
	const [state, setState] = useState(initialState);
	useEffect(() => {
		const fetchData = async () => {
			const categories = await service.getCategories();
			let hasCategories;
			if (categories.length > 0) {
				hasCategories = true;
			} else {
				hasCategories = false;
			}
			setState({
				...state,
				categories: categories,
				hasCategories: hasCategories,
			});
		};
		fetchData();
	}, []);

	return (
		<>
			{state.hasCategories ? (
				state.categories.map((el) => (
					<NavigationCategoryBox
						key={el._id}
						icon={el.icon}
						slug={el.slug}
						pluralName={el.pluralName}
						illustration={el.illustration}
					/>
				))
			) : (
				<FetchingSpinnerInline />
			)}
		</>
	);
};

export default ContentBar;
