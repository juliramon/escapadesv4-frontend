import React, { useEffect, useState } from "react";
import FetchingSpinner from "../global/FetchingSpinner";
import ContentService from "../../services/contentService";
import NavigationCategoryBox from "../global/NavigationCategoryBox";

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

	if (state.hasCategories === false) {
		return <FetchingSpinner />;
	}

	return (
		<div className="content-bar min-h-[40px]">
			<div className="w-full px-6">
				<div className="flex items-center -mx-2.5 overflow-x-auto h-10">
					{state.hasCategories
						? state.categories.map((el) => (
								<NavigationCategoryBox
									key={el._id}
									icon={el.icon}
									slug={el.slug}
									pluralName={el.pluralName}
								/>
						  ))
						: ""}
				</div>
			</div>
		</div>
	);
};

export default ContentBar;
