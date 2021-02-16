import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import NavigationBar from "../components/global/NavigationBar";
import UserContext from "../contexts/UserContext";
import ContentService from "../services/contentService";

const AdminPanel = () => {
  const user = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  useEffect(() => {
    if (!user.userType === "admin") {
      router.push("/feed");
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
    categories: [],
    activities: [],
    places: [],
    users: [],
    stories: [],
    hasCategories: false,
    hasActivities: false,
    hasUsers: false,
    hasStories: false,
    isFetching: false,
  };

  const [state, setState] = useState(initialState);

  const service = new ContentService();

  useEffect(() => {
    const fetchData = async () => {
      setState({ ...state, isFetching: true });
      const categories = [];
      const activities = service.activities();
      const places = service.getAllPlaces();
      const stories = service.getAllStories();
      const users = service.getAllUsers();
      setState({
        ...state,
        categories: categories,
        activities: activities,
        places: places,
        stories: stories,
        users: users,
      });
    };
    fetchData();
  }, []);

  if (state.isFetching === true) {
    return (
      <>
        <Head>
          <title>Carregant...</title>
        </Head>
        <Container className="spinner d-flex justify-space-between">
          <Spinner animation="border" role="status" variant="primary">
            <span className="sr-only">Carregant...</span>
          </Spinner>
        </Container>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Panell d'Administració – Escapadesenparella.cat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="adminPanel">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
          }
          user={user}
        />
        <Container fluid className="top-nav">
          <div className="top-nav-wrapper">
            <h1 className="top-nav-title db mw-1600">Panell d'Administració</h1>
          </div>
        </Container>
      </div>
    </>
  );
};

export default AdminPanel;
