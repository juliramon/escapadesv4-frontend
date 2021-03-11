import React, { useEffect, useCallback, useState } from "react";
import NavigationBar from "../global/NavigationBar";
import { Container, Row } from "react-bootstrap";
import ContentService from "../../services/contentService";
import PublicUserBox from "./PublicUserBox";

const UsersList = ({ user }) => {
  const initialState = {
    loggedUser: user,
    users: [],
  };
  const [state, setState] = useState(initialState);
  const service = new ContentService();
  const getAllUsers = useCallback(() => {
    service
      .getAllUsers("/users")
      .then((res) => setState({ ...state, users: res }));
  }, [state, service]);
  useEffect(getAllUsers, []);
  const usersList = state.users.map((el) => (
    <PublicUserBox
      key={el._id}
      id={el._id}
      avatar={el.avatar}
      fullname={el.fullName}
      username={el.username}
    />
  ));
  return (
    <div id="usersList">
      <NavigationBar
        logo_url={
          "https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
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
                    <h1 className="page-title">Community</h1>
                  </div>
                  <ul>
                    <li className="page-bookmarks">
                      <span>{state.users.length}</span>{" "}
                      {state.users.length > 1 ? "users" : "user"}
                    </li>
                    <hr />
                    <li className="page-description">
                      Find here the members of the Getaways.guru community
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col right">
              <div className="box wrapper d-flex">{usersList}</div>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default UsersList;
