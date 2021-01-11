import Head from "next/head";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import NavigationBar from "../components/global/NavigationBar";
import UserContext from "../contexts/UserContext";
import ContentService from "../services/contentService";
import dynamic from "next/dynamic";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
];

const StoryForm = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      user.push("/login");
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
    formData: {
      emptyForm: true,
      type: "story",
      title: "",
      subtitle: "",
      images: [],
      isReadyToSubmit: false,
    },
  };
  const [state, setState] = useState(initialState);
  const [queryId, setQueryId] = useState(null);
  useEffect(() => {
    if (router && router.route) {
      setQueryId(router.route);
    }
  }, [router]);

  const service = new ContentService();

  const saveFileToStatus = (e) => {
    const fileToUpload = e.target.files[0];
    // setState({
    //   ...state,
    //   formData: {
    //     ...state.formData,
    //     images: [...state.formData.images, fileToUpload],
    //   },
    // });
    console.log(fileToUpload);
  };

  const handleFileUpload = (e) => {
    const fileToUpload = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append("imageUrl", fileToUpload);
    service.uploadFile(uploadData).then((res) => {
      setState({
        ...state,
        formData: {
          ...state.formData,
          images: [...state.formData.images, res.path],
        },
      });
    });
  };

  const handleChange = (e) => {
    setState({
      ...state,
      formData: {
        ...state.formData,
        [e.target.name]: e.target.value,
        emptyForm: false,
      },
    });
  };

  const imagesList = state.formData.images.map((el, idx) => (
    <img key={idx} src={el} />
  ));

  const [description, setDescription] = useState("");

  const submitStory = () => {
    const { type, title, subtitle, images } = state.formData;
    service
      .story(type, title, subtitle, images, description)
      .then(() => {
        setState({
          ...state,
          formData: {
            emptyForm: true,
            type: "story",
            title: "",
            subtitle: "",
            images: [],
            isReadyToSubmit: false,
          },
        });
        setDescription("");
        Router.push("/dashboard");
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitStory();
  };

  useEffect(() => {
    const { title, subtitle, images } = state.formData;

    if (title && subtitle && images && description) {
      setState((state) => ({ ...state, isReadyToSubmit: true }));
    }
  }, [state.formData, description]);

  return (
    <>
      <Head>
        <title>Comparteix una nova història - Escapadesenparella.cat</title>
      </Head>
      <div id="story" className="composer">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
          }
          user={user}
          path={queryId}
        />
        <Container className="mw-1600" fluid>
          <Row>
            <Col lg={7} className="sided-shadow">
              <div className="form-composer">
                <h1>Comparteix una història</h1>
                <p className="sub-h1">
                  Escriu una nova història per inspirar a altres parelles.
                </p>
              </div>
              <Form>
                <Form.Group>
                  <Form.Label>Títol</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Títol de la història"
                    onChange={handleChange}
                    value={state.formData.title}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Subtítol</Form.Label>
                  <Form.Control
                    type="text"
                    name="subtitle"
                    placeholder="Subtítol de la història"
                    onChange={handleChange}
                    value={state.formData.subtitle}
                  />
                </Form.Group>
                <div className="images">
                  <span>Imatges d'aquesta història</span>
                  <div className="images-wrapper">{imagesList}</div>
                  <div className="images-wrapper">
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={saveFileToStatus}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                    <Form.Group>
                      <div className="image-drop-zone">
                        <Form.Label>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-photo"
                            width="44"
                            height="44"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <line x1="15" y1="8" x2="15.01" y2="8" />
                            <rect x="4" y="4" width="16" height="16" rx="3" />
                            <path d="M4 15l4 -4a3 5 0 0 1 3 0l 5 5" />
                            <path d="M14 14l1 -1a3 5 0 0 1 3 0l 2 2" />
                          </svg>
                          <Form.Control
                            type="file"
                            onChange={handleFileUpload}
                          />
                        </Form.Label>
                      </div>
                    </Form.Group>
                  </div>
                </div>
                <Form.Group>
                  <Form.Label>Descripció</Form.Label>
                  <QuillNoSSRWrapper
                    className="form-control"
                    modules={modules}
                    formats={formats}
                    theme="bubble"
                    placeholder={"Comença a descriure la teva historia..."}
                    value={description}
                    onChange={setDescription}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Container>
        <div className="progress-bar-outter">
          <Container className="d-flex align-items-center">
            <div className="col left">{/* <span>Section 1 of 7 </span> */}</div>
            <div className="col center">
              {/* <div className="progress">
							<div
								className="progress-bar"
								role="progressbar"
								style={{width: "33%"}}
								aria-valuenow="25"
								aria-valuemin="0"
								aria-valuemax="100"
							></div>
						</div> */}
            </div>
            <div className="col right">
              <div className="buttons d-flex justify-space-between justify-content-end">
                {state.isReadyToSubmit ? (
                  <Button type="submit" variant="none" onClick={handleSubmit}>
                    Publicar
                  </Button>
                ) : (
                  <Button type="submit" variant="none" disabled>
                    Publicar
                  </Button>
                )}
              </div>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default StoryForm;
