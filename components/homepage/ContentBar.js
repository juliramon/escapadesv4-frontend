import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import ContentService from "../../services/contentService";
import NavigationCategoryBox from "../global/NavigationCategoryBox";

const ContentBar = (props) => {
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

	let categoriesList = [];
	if (state.hasCategories) {
		categoriesList = state.categories.map((el) => (
			<NavigationCategoryBox
				key={el._id}
				icon={el.icon}
				slug={el.slug}
				pluralName={el.pluralName}
			/>
		));
	}

	if (state.hasCategories === false) {
		return (
			<>
				<Container className="spinner d-flex justify-space-between">
					<Spinner animation="border" role="status" variant="primary">
						<span className="sr-only">Carregant...</span>
					</Spinner>
				</Container>
			</>
		);
	}

	const handleScroll = (e) => {
		e.currentTarget.scrollLeft += e.deltaX || e.deltaY;
	};

	let contentBar;
	contentBar = (
		<div className="content-bar hidden lg:block">
			<div className="w-full px-6">
				<div className="content-bar---wrapper flex items-center">
					<div
						className="content-bar---inner flex items-center"
						onWheel={(e) => handleScroll(e)}
					>
						{categoriesList}
					</div>
					<div className="content-bar---overlay"></div>
				</div>
			</div>
		</div>
	);

	return <>{contentBar}</>;
};

export default ContentBar;
