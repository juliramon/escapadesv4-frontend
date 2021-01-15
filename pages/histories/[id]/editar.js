import Head from "next/head";
import Router, { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import NavigationBar from "../../../components/global/NavigationBar";
import UserContext from "../../../contexts/UserContext";
import ContentService from "../../../services/contentService";
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

const StoryEditionForm = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
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
      type: "story",
      title: "",
      subtitle: "",
      cover: "",
      blopCover: "",
      images: [],
      blopImages: [],
      cloudImages: [],
      coverCloudImage: "",
      isReadyToSubmit: false,
      cloudImagesUploaded: false,
      coverCloudImageUploaded: false,
    },
    isStoryLoaded: false,
  };
  const [state, setState] = useState(initialState);
  const [queryId, setQueryId] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (router && router.query) {
      setQueryId(router.query.id);
    }
  }, [router]);

  const service = new ContentService();

  useEffect(() => {
    const fetchData = async () => {
      let storyDetails = await service.getStoryDetails(queryId);
      console.log(storyDetails);
      setState({
        ...state,
        formData: {
          type: storyDetails.type,
          title: storyDetails.title,
          subtitle: storyDetails.subtitle,
          cover: storyDetails.cover,
          blopCover: "",
          images: storyDetails.images,
          blopImages: [],
          cloudImages: [],
          coverCloudImage: "",
          isReadyToSubmit: false,
          cloudImagesUploaded: false,
          coverCloudImageUploaded: false,
        },
        isStoryLoaded: true,
      });
      setDescription(storyDetails.description);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryId]);

  const { title, subtitle } = state.formData;

  const saveFileToStatus = (e) => {
    const fileToUpload = e.target.files[0];
    if (e.target.name === "cover") {
      setState({
        ...state,
        formData: {
          ...state.formData,
          blopCover: URL.createObjectURL(fileToUpload),
          cover: fileToUpload,
        },
      });
    } else {
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
    }
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

  let imagesList, coverImage;

  if (state.formData.blopImages || state.formData.images) {
    let stateImages;
    state.formData.blopImages.length > 0
      ? (stateImages = state.formData.blopImages)
      : (stateImages = state.formData.images);
    if (stateImages) {
      imagesList = stateImages.map((el, idx) => (
        <div className="image" key={idx}>
          <img src={el} />
        </div>
      ));
    }
  }

  if (state.formData.blopCover || state.formData.cover) {
    coverImage = (
      <div className="image">
        <img src={state.formData.blopCover || state.formData.cover} />
      </div>
    );
  }

  const submitStory = () => {
    const {
      _id,
      title,
      subtitle,
      coverCloudImage,
      cloudImages,
    } = state.formData;
    service
      .editStory(
        _id,
        title,
        subtitle,
        coverCloudImage,
        cloudImages,
        description
      )
      .then(() => router.push("/dashboard"))
      .catch((err) => console.log(err));
  };

  const handleFileUpload = (e) => {
    const imagesList = state.formData.images;
    const cover = state.formData.cover;
    let uploadedImages = [];
    let uploadedCover = "";
    const uploadData = new FormData();
    uploadData.append("imageUrl", cover);
    service.uploadFile(uploadData).then((res) => {
      uploadedCover = res.path;
    });

    imagesList.forEach((el) => {
      const uploadData = new FormData();
      uploadData.append("imageUrl", el);
      service.uploadFile(uploadData).then((res) => {
        console.log(res.path);
        uploadedImages.push(res.path);
        console.log(uploadedImages.length);
        if (uploadedImages.length === state.formData.images.length) {
          setState({
            ...state,
            formData: {
              ...state.formData,
              cloudImages: uploadedImages,
              coverCloudImage: uploadedCover,
              cloudImagesUploaded: true,
              coverCloudImageUploaded: true,
            },
          });
        }
      });
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFileUpload();
  };

  return (
    <>
      <Head>
        <title>Edita la història - Escapadesenparella.cat</title>
      </Head>

      <div id="editStory" className="composer">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/c_scale,q_100,w_135/v1600008855/getaways-guru/static-files/logo-getaways-guru_vvbikk.svg"
          }
          user={user}
          path={queryId}
        />
        <Container className="mw-1600">
          <Row>
            <Col lg={12} className="sided-shadow">
              <div className="form-composer">
                <h1>Editar la història</h1>
                <p className="sub-h1">
                  Edit and submit your story so others start enjoying it.
                </p>
              </div>
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Títol</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Story title"
                    value={title}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Subtitle</Form.Label>
                  <Form.Control
                    type="text"
                    name="subtitle"
                    placeholder="Story subtitle"
                    value={subtitle}
                    onChange={handleChange}
                  />
                </Form.Group>
                <div className="cover">
                  <span>Imatge de portada</span>
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
                              name="cover"
                              onChange={saveFileToStatus}
                            />
                          </Form.Label>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="images-list-wrapper">
                      <div className="image-wrapper">{coverImage}</div>
                    </div>
                  </div>
                </div>
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
                <Button type="submit" variant="none" onClick={handleSubmit}>
                  Save changes
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default StoryEditionForm;
