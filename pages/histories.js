import { useEffect, useCallback, useState } from "react";
import ContentService from "../services/contentService";
import PublicContentBox from "../components/listings/PublicContentBox";
import NavigationBar from "../components/global/NavigationBar";
import { Container, Row, Form } from "react-bootstrap";

const StoriesList = ({ user }) => {
  const initialState = {
    loggedUser: user,
    stories: [],
    hasStories: false,
  };
  const [state, setState] = useState(initialState);
  const service = new ContentService();
  const getAllStories = useCallback(() => {
    service.getAllStories("/stories").then((res) => {
      let hasStories;
      if (res.length > 0) {
        hasStories = true;
      }
      setState({ ...state, stories: res, hasStories: hasStories });
    });
  }, [state, service]);
  useEffect(getAllStories, []);
  let storiesList;
  if (state.hasStories === true) {
    storiesList = state.stories.map((el) => (
      <PublicContentBox
        key={el._id}
        type={el.type}
        id={el._id}
        image={el.images[0]}
        title={el.title}
        subtitle={el.subtitle}
      />
    ));
  }

  return (
    <div id="contentList" className="place">
      <NavigationBar
        logo_url={
          "https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
        }
        user={user}
      />
      <Container fluid className="mw-1600">
        <Row>
          <div className="box d-flex">
            <div className="col left"></div>
            <div className="col center">
              <div className="top-nav-wrapper">
                <h1 className="top-nav-title">Històries en parella</h1>
                <p className="top-nav-subtitle"></p>
              </div>
              <div className="listings-wrapper">
                <div className="listings-list">{storiesList}</div>
              </div>
            </div>
            <div className="col right"></div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default StoriesList;
