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
      blopImages: [],
      cloudImages: [],
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
    setState({
      ...state,
      formData: {
        ...state.formData,
        blopImages: [
          ...state.formData.blopImages,
          URL.createObjectURL(fileToUpload),
        ],
        images: [...state.formData.images, fileToUpload],
      },
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

  const imagesList = state.formData.blopImages.map((el, idx) => (
    <div className="image" key={idx}>
      <img src={el} />
    </div>
  ));

  const [description, setDescription] = useState("");

  const submitStory = () => {
    console.log("submitted story");
    const { type, title, subtitle, cloudImages } = state.formData;
    service
      .story(type, title, subtitle, cloudImages, description)
      .then(() => {
        // setState({
        //   ...state,
        //   formData: {
        //     emptyForm: true,
        //     type: "story",
        //     title: "",
        //     subtitle: "",
        //     blopImages: [],
        //     isReadyToSubmit: false,
        //   },
        // });
        // setDescription("");
        router.push("/dashboard");
      })
      .catch((err) => console.log(err));
  };

  const handleFileUpload = (e) => {
    const imagesList = state.formData.images;
    imagesList.forEach((el) => {
      const uploadData = new FormData();
      uploadData.append("imageUrl", el);
      service.uploadFile(uploadData).then((res) => {
        console.log("image uploaded");
        setState({
          ...state,
          formData: {
            ...state.formData,
            cloudImages: [...state.formData.cloudImages, res.path],
          },
        });
      });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFileUpload();
  };

  useEffect(() => {
    console.log(state.formData.cloudImages);
    if (state.formData.cloudImages.length > 0) {
      console.log(state.formData.cloudImages.length);
      submitStory();
    }
  }, [state.formData]);

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
                  <div className="images-wrapper">
                    <div className="top-bar">
                      <Form.Group>
                        <div className="image-drop-zone">
                          <Form.Label>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon icon-tabler icon-tabler-camera-plus"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#0d1f44"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <circle cx="12" cy="13" r="3" />
                              <path d="M5 7h2a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h2m9 7v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                              <line x1="15" y1="6" x2="21" y2="6" />
                              <line x1="18" y1="3" x2="18" y2="9" />
                            </svg>
                            Afegir imatge
                            <Form.Control
                              type="file"
                              onChange={saveFileToStatus}
                            />
                          </Form.Label>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="images-list-wrapper">
                      <div className="image-wrapper">{imagesList}</div>
                    </div>
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
