import { useContext, useEffect, useState } from "react";
import NavigationBar from "../components/global/NavigationBar";
import { Container, Row, Spinner } from "react-bootstrap";
import ContentService from "../services/contentService";
import PublicContentBox from "../components/listings/PublicContentBox";
import UserContext from "../contexts/UserContext";
import { useRouter } from "next/router";
import Head from "next/head";

const BookmarksList = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || user === "null" || user === undefined) {
      router.push("/login");
    } else {
      if (user) {
        if (user.accountCompleted === false) {
          router.push("/signup/complete-account");
        }
        if (user.hasConfirmedEmail === false) {
          router.push("/signup/confirmacio-correu");
        }
        if (user.userType !== "admin" || !user.userType) {
          router.push("/feed");
        }
      }
    }
  }, [user]);

  if (!user) {
    return (
      <Head>
        <title>Carregant...</title>
      </Head>
    );
  }

  const initialState = {
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
            slug={el.bookmarkActivityRef.slug}
            id={el.bookmarkActivityRef._id}
            title={el.bookmarkActivityRef.title}
            subtitle={el.bookmarkActivityRef.subtitle}
            cover={el.bookmarkActivityRef.cover}
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
            slug={el.bookmarkPlaceRef.slug}
            id={el.bookmarkPlaceRef._id}
            title={el.bookmarkPlaceRef.title}
            subtitle={el.bookmarkPlaceRef.subtitle}
            cover={el.bookmarkPlaceRef.cover}
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
            Vaja, sembla que encara no has desat cap escapada.
            <br />
            Cerca i desa activitats o escapades per revisar-les quan estiguis
            llest.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Elements desats - Escapadesenparella.cat</title>
      </Head>
      <div id="bookmarksList">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
        />
        <Container fluid className="mw-1600">
          <Row>
            <div className="box d-flex">
              <div className="col left">
                <div className="box bordered">
                  <div className="page-meta">
                    <div className="page-header d-flex">
                      <h1 className="page-title">Desat</h1>
                    </div>
                    <ul>
                      <li className="page-bookmarks">
                        <span>{state.bookmarks.length}</span>{" "}
                        {state.bookmarks.length > 1 ? "elements" : "element"}
                      </li>
                      <hr />
                      <li className="page-description">
                        Aquí trobaràs totes les activitats i allotjaments que
                        has marcat com a desats.
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
    </>
  );
};

export default BookmarksList;
