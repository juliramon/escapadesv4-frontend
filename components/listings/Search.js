import React, { useEffect, useState } from "react";
import { Container, Row, Spinner } from "react-bootstrap";
import NavigationBar from "../global/NavigationBar";
import ContentService from "../../services/contentService";
import PublicContentBox from "./PublicContentBox";
import { Link } from "react-router-dom";

const Search = (props) => {
  const initialState = {
    loggedUser: props.user,
    searchQuery: props.location.search,
    isFetching: false,
    hasResults: false,
    searchResults: [],
    activitiesFound: [],
    placesFound: [],
    updatedSearch: false,
  };
  const [state, setState] = useState(initialState);

  const service = new ContentService();

  useEffect(() => {
    const fetchData = async () => {
      setState({ ...state, isFetching: true });
      const searchQueryResults = await service.searchBarQuery(
        state.searchQuery
      );
      if (searchQueryResults instanceof Array) {
        let hasResults;
        searchQueryResults.length > 0
          ? (hasResults = true)
          : (hasResults = false);
        setState({
          ...state,
          isFetching: false,
          hasResults: hasResults,
          searchResults: searchQueryResults,
        });
      } else if (searchQueryResults instanceof Object) {
        let hasResults;
        searchQueryResults.places.length > 0 ||
        searchQueryResults.activities.length > 0
          ? (hasResults = true)
          : (hasResults = false);
        setState({
          ...state,
          isFetching: false,
          hasResults: hasResults,
          activitiesFound: searchQueryResults.activities,
          placesFound: searchQueryResults.places,
        });
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.searchQuery !== props.location.search) {
      const fetchData = async () => {
        const searchQueryResults = await service.searchBarQuery(
          props.location.search
        );
        let hasResults;
        searchQueryResults.places.length > 0 ||
        searchQueryResults.activities.length > 0
          ? (hasResults = true)
          : (hasResults = false);
        setState({
          ...state,
          isFetching: false,
          hasResults: hasResults,
          activitiesFound: searchQueryResults.activities,
          placesFound: searchQueryResults.places,
        });
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.searchQuery, props.location.search]);

  if (state.isFetching) {
    return (
      <Container className="spinner d-flex justify-space-between">
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  let searchResultsList;
  let searchResultsLength;

  if (state.searchResults.length > 0) {
    searchResultsLength = state.searchResults.length;
  } else {
    searchResultsLength =
      state.activitiesFound.length + state.placesFound.length;
  }

  if (state.activitiesFound.length > 0 || state.placesFound.length > 0) {
    let searchResults = [];
    state.activitiesFound.map((el) => searchResults.push(el));
    state.placesFound.map((el) => searchResults.push(el));
    searchResultsList = searchResults.map((el) => {
      let location;
      if (el.type === "activity") {
        location = `${
          el.activity_locality === undefined ? "" : el.activity_locality
        } ${el.activity_locality === undefined ? "" : ","} ${
          el.activity_province || el.activity_state
        }, ${el.activity_country}`;
      } else {
        location = `${
          el.place_locality === undefined ? "" : el.place_locality
        }${el.place_locality === undefined ? "" : ","} ${
          el.place_province || el.place_state
        }, ${el.place_country}`;
      }

      return (
        <PublicContentBox
          key={el._id}
          type={el.type}
          slug={el.slug}
          cover={el.cover}
          id={el._id}
          title={el.title}
          subtitle={el.subtitle}
          location={location}
        />
      );
    });
  } else {
    if (
      searchResultsLength === 0 &&
      state.activitiesFound.length === 0 &&
      state.placesFound.length === 0
    ) {
      searchResultsList = (
        <div className="box empty d-flex">
          <div className="media">
            <img
              src="../../empty-search-results.svg"
              alt="Graphic no results"
            />
          </div>
          <div className="text">
            <p>
              Damn, this looks so empty.
              <br />
              Refine your search to get better results.
            </p>
            <Link to={"/"} className="btn btn-primary text-center">
              Search again
            </Link>
          </div>
        </div>
      );
    } else {
      searchResultsList = state.searchResults.map((el) => {
        let location;
        if (el.type === "activity") {
          location = `${
            el.activity_locality === undefined ? "" : el.activity_locality
          } ${el.activity_locality === undefined ? "" : ","} ${
            el.activity_province || el.activity_state
          }, ${el.activity_country}`;
        } else {
          location = `${
            el.place_locality === undefined ? "" : el.place_locality
          }${el.place_locality === undefined ? "" : ","} ${
            el.place_province || el.place_state
          }, ${el.place_country}`;
        }

        return (
          <PublicContentBox
            key={el._id}
            type={el.type}
            slug={el.slug}
            cover={el.cover}
            id={el._id}
            title={el.title}
            subtitle={el.subtitle}
            location={location}
          />
        );
      });
    }
  }

  return (
    <div id="searchPage">
      <NavigationBar
        logo_url={
          "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
        }
        user={props.user}
      />
      <Container fluid className="mw-1600">
        <Row>
          <div className="box d-flex">
            <div className="col left"></div>
            <div className="col center">
              <div className="top-nav-wrapper">
                <h1 className="top-nav-title">Search results</h1>
                <p className="top-nav-subtitle">
                  We have found <span>{searchResultsLength} results</span> based
                  on your search query
                </p>
              </div>
              {searchResultsList}
            </div>
            <div className="col left"></div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default Search;
