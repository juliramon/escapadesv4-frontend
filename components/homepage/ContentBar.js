import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
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

  let contentBar;
  contentBar = (
    <div className="content-bar">
      <Container fluid>
        <div className="content-bar---wrapper d-flex align-items-center">
          {categoriesList}
        </div>
      </Container>
    </div>
  );

  return <>{contentBar}</>;
};

export default ContentBar;
