import React, { useEffect, useState } from "react";
import NavigationBar from "../global/NavigationBar";
import { Container, Row, Spinner } from "react-bootstrap";
import ContentService from "../../services/contentService";
import PublicContentBox from "../listings/PublicContentBox";

const BookmarksList = (props) => {
  const initialState = {
    loggedUser: props.user,
    bookmarks: [],
    isFetching: false,
    hasBookmarks: false,
  };
  const [state, setState] = useState(initialState);
  const service = new ContentService();
  useEffect(() => {
    const fetchData = async () => {
      setState({ ...state, isFetching: true });
      const userBookmarks = await service.getUserActiveBookmarks();
      let allBookmarks = [];
      userBookmarks.map((el) => allBookmarks.push(el));
      let hasBookmarks;
      allBookmarks.length > 0 ? (hasBookmarks = true) : (hasBookmarks = false);
      setState({
        ...state,
        bookmarks: allBookmarks,
        hasBookmarks: hasBookmarks,
        isFetching: false,
      });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.isFetching) {
    return (
      <Container className="spinner d-flex justify-space-between">
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  const bookmarks = state.bookmarks;
  let bookmarksList;
  if (state.hasBookmarks === true) {
    bookmarksList = bookmarks.map((el) => {
      if (el.bookmarkActivityRef) {
        return (
          <PublicContentBox
            key={el._id}
            type={el.bookmarkActivityRef.type}
            id={el.bookmarkActivityRef._id}
            title={el.bookmarkActivityRef.title}
            subtitle={el.bookmarkActivityRef.subtitle}
            image={el.bookmarkActivityRef.images[0]}
            location={`${
              el.bookmarkActivityRef.activity_locality === undefined
                ? ""
                : el.bookmarkActivityRef.activity_locality
            } ${
              el.bookmarkActivityRef.activity_locality === undefined ? "" : ","
            } ${
              el.bookmarkActivityRef.activity_province ||
              el.bookmarkActivityRef.activity_state
            }, ${el.bookmarkActivityRef.activity_country}`}
          />
        );
      } else {
        return (
          <PublicContentBox
            key={el._id}
            type={el.bookmarkPlaceRef.type}
            id={el.bookmarkPlaceRef._id}
            title={el.bookmarkPlaceRef.title}
            subtitle={el.bookmarkPlaceRef.subtitle}
            image={el.bookmarkPlaceRef.images[0]}
            location={`${
              el.bookmarkPlaceRef.place_locality === undefined
                ? ""
                : el.bookmarkPlaceRef.place_locality
            }${el.bookmarkPlaceRef.place_locality === undefined ? "" : ","} ${
              el.bookmarkPlaceRef.place_province ||
              el.bookmarkPlaceRef.place_state
            }, ${el.bookmarkPlaceRef.place_country}`}
          />
        );
      }
    });
  } else {
    bookmarksList = (
      <div className="box empty d-flex">
        <div className="media">
          <img src="../../no-bookmarks.svg" alt="Graphic no bookmarks" />
        </div>
        <div className="text">
          <p>
            Oh no, this looks so empty.
            <br />
            Search and bookmark listings to read them
            <br /> when you are ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="bookmarksList">
      <NavigationBar
        logo_url={
          "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
        }
        user={props.user}
      />
      <Container fluid className="mw-1600">
        <Row>
          <div className="box d-flex">
            <div className="col left">
              <div className="box bordered">
                <div className="page-meta">
                  <div className="page-header d-flex">
                    <h1 className="page-title">Bookmarks</h1>
                  </div>
                  <ul>
                    <li className="page-bookmarks">
                      <span>{state.bookmarks.length}</span>{" "}
                      {state.bookmarks.length > 1 ? "bookmarks" : "bookmark"}
                    </li>
                    <hr />
                    <li className="page-description">
                      Find here your bookmarked activities, places and stories.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col center">
              <div className="content-bar">{bookmarksList}</div>
            </div>
            <div className="col right"></div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default BookmarksList;
