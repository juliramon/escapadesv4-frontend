import Head from "next/head";
import Router, { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import NavigationBar from "../../../components/global/NavigationBar";
import UserContext from "../../../contexts/UserContext";
import ContentService from "../../../services/contentService";
import dynamic from "next/dynamic";
import slugify from "slugify";

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
    story: {},
    formData: {
      _id: "",
      type: "story",
      title: "",
      subtitle: "",
      cover: "",
      blopCover: "",
      updatedCover: false,
      images: [],
      blopImages: [],
      updatedImages: false,
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
    if (router.query.slug !== undefined) {
      const fetchData = async () => {
        let storyDetails = await service.getStoryDetails(router.query.slug);
        setState({
          ...state,
          story: storyDetails,
          formData: {
            _id: storyDetails._id,
            type: storyDetails.type,
            title: storyDetails.title,
            subtitle: storyDetails.subtitle,
            cover: storyDetails.cover,
            blopCover: "",
            updatedCover: false,
            images: [],
            blopImages: [],
            updatedImages: false,
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryId, router.query.slug]);

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
          updatedCover: true,
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
          updatedImages: true,
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

  if (
    state.story.images ||
    state.formData.blopImages ||
    state.formData.images
  ) {
    let stateImages;
    state.formData.blopImages.length > 0
      ? (stateImages = state.formData.blopImages)
      : (stateImages = state.story.images);
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
        <button></button>
      </div>
    );
  }

  const submitStory = async () => {
    const slug = await slugify(state.story.title);
    const {
      _id,
      title,
      subtitle,
      coverCloudImage,
      cloudImages,
    } = state.formData;
    const { cover, images } = state.story;
    let storyCover, storyImages;
    coverCloudImage !== ""
      ? (storyCover = coverCloudImage)
      : (storyCover = cover);
    cloudImages.length > 0
      ? (storyImages = cloudImages)
      : (storyImages = images);
    service
      .editStory(
        _id,
        slug,
        title,
        subtitle,
        storyCover,
        storyImages,
        description
      )
      .then(() => router.push("/dashboard"))
      .catch((err) => console.log(err));
  };

  const handleFileUpload = (e) => {
    const cover = state.formData.cover;
    let uploadedCover = "";
    const uploadData = new FormData();
    if (state.formData.updatedCover) {
      uploadData.append("imageUrl", cover);
      service.uploadFile(uploadData).then((res) => {
        setState({
          ...state,
          formData: {
            ...state.formData,
            coverCloudImage: res.path,
            coverCloudImageUploaded: true,
          },
        });
      });
    }
    if (state.formData.updatedImages) {
      const imagesList = state.formData.images;
      let uploadedImages = [];
      imagesList.forEach((el) => {
        const uploadData = new FormData();
        uploadData.append("imageUrl", el);
        service.uploadFile(uploadData).then((res) => {
          uploadedImages.push(res.path);
          if (uploadedImages.length === state.formData.images.length) {
            setState({
              ...state,
              formData: {
                ...state.formData,
                cloudImages: uploadedImages,
                cloudImagesUploaded: true,
              },
            });
          }
        });
      });
    }
    if (state.formData.updatedImages && state.formData.updatedCover) {
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
          uploadedImages.push(res.path);
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
    }
  };

  useEffect(() => {
    if (
      state.formData.cloudImagesUploaded === true ||
      state.formData.coverCloudImageUploaded === true
    ) {
      submitStory();
    }
  }, [state.formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.formData.updatedImages || state.formData.updatedCover) {
      handleFileUpload();
    } else {
      submitStory();
    }
  };

  if (!state.isStoryLoaded) {
    return (
      <Container className="spinner d-flex justify-space-between">
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only">Carregant...</span>
        </Spinner>
      </Container>
    );
  }

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
                            {state.formData.cover
                              ? "Canviar imatge"
                              : "Seleccionar imatge"}

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
                            Seleccionar imatges
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
