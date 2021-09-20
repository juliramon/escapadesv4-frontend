import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import EditorNavbar from "../components/editor/EditorNavbar";
import StarterKit from "@tiptap/starter-kit";
import UserContext from "../contexts/UserContext";
import { useRouter } from "next/router";
import NavigationBar from "../components/global/NavigationBar";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Image from "@tiptap/extension-image";
import ContentService from "../services/contentService";

const ListForm = () => {
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
    if (
      router.pathname.includes("editar") ||
      router.pathname.includes("nova-activitat") ||
      router.pathname.includes("nou-allotjament") ||
      router.pathname.includes("nova-historia") ||
      router.pathname.includes("nova-llista")
    ) {
      document.querySelector("body").classList.add("composer");
    } else {
      document.querySelector("body").classList.remove("composer");
    }
  }, [user, router]);

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
      type: "list",
      title: "",
      subtitle: "",
      cover: "",
      blopCover: "",
      coverCloudImage: "",
      isReadyToSubmit: false,
      cloudImagesUploaded: false,
      coverCloudImageUploaded: false,
      metaTitle: "",
      metaDescription: "",
      slug: "",
    },
  };

  const [state, setState] = useState(initialState);
  const [editorData, setEditorData] = useState({});
  const [queryId, setQueryId] = useState(null);
  const [activeTab, setActiveTab] = useState("main");

  useEffect(() => {
    if (router && router.route) {
      setQueryId(router.route);
    }
  }, [router]);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "",
    onUpdate: (props) => {
      const data = {
        html: props.editor.getHTML(),
        text: props.editor.state.doc.textContent,
      };
      setEditorData(data);
    },
    autofocus: false,
    parseOptions: {
      preserveWhitespace: true,
    },
  });

  const service = new ContentService();

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

  let coverImage;
  if (state.formData.blopCover) {
    coverImage = (
      <div className="image">
        <img src={state.formData.blopCover} />
      </div>
    );
  }

  const handleFileUpload = async (e) => {
    const cover = state.formData.cover;
    const uploadData = new FormData();
    uploadData.append("imageUrl", cover);
    const uploadedCover = await service.uploadFile(uploadData);
    setState({
      ...state,
      formData: {
        ...state.formData,
        coverCloudImage: uploadedCover.path,
        coverCloudImageUploaded: true,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFileUpload();
  };

  useEffect(() => {
    if (state.formData.coverCloudImageUploaded === true) {
      submitList();
    }
  }, [state.formData]);

  const submitList = async () => {
    const {
      type,
      title,
      subtitle,
      coverCloudImage,
      metaTitle,
      metaDescription,
      slug,
    } = state.formData;
    service
      .list(
        type,
        title,
        subtitle,
        coverCloudImage,
        metaTitle,
        metaDescription,
        slug,
        editorData
      )
      .then(() => {
        Router.push("/dashboard");
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Head>
        <title>Crea una nova llista - Escapadesenparella.cat</title>
      </Head>
      <div id="storyForm">
        <NavigationBar
          logo_url={
            "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
          }
          user={user}
          path={queryId}
        />
        <Container className="mw-1600">
          <Row>
            <Col lg={12}>
              <div className="form-composer">
                <div className="form-composer__header">
                  <div className="form-composer__header-left">
                    <h1>Crea una llista</h1>
                    <p className="sub-h1">
                      Crea una nova llista per inspirar a altres parelles
                    </p>
                  </div>
                  <div className="form-composer__header-right">
                    <Button type="submit" variant="none" onClick={handleSubmit}>
                      Publicar
                    </Button>
                  </div>
                </div>
                <div className="form-composer__body">
                  <div className="form-composer__tab-bar">
                    <button
                      className={
                        activeTab === "main"
                          ? "form-composer__tab active"
                          : "form-composer__tab"
                      }
                      onClick={() => setActiveTab("main")}
                    >
                      Contingut principal
                    </button>
                    <button
                      className={
                        activeTab === "seo"
                          ? "form-composer__tab active"
                          : "form-composer__tab"
                      }
                      onClick={() => setActiveTab("seo")}
                    >
                      SEO
                    </button>
                  </div>
                  {activeTab === "main" ? (
                    <div className="form-composer__post-content">
                      <Form>
                        <Form.Group>
                          <Form.Label>Títol</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            placeholder="Títol de la llista"
                            onChange={handleChange}
                            value={state.formData.title}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Subtítol</Form.Label>
                          <Form.Control
                            type="text"
                            name="subtitle"
                            placeholder="Subtítol de la llista"
                            onChange={handleChange}
                            value={state.formData.subtitle}
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
                                      max="1"
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
                      </Form>
                      <EditorNavbar editor={editor} />
                      <EditorContent
                        editor={editor}
                        className="form-composer__editor"
                      />
                    </div>
                  ) : (
                    <div className="form-composer__seo">
                      <Form onSubmit={handleSubmit}>
                        <Form.Group>
                          <Form.Label>
                            Meta títol{" "}
                            <span className="form-composer__label-description">
                              Cada publicació hauria de tenir un meta títol
                              únic, idealment de menys de 60 caràcters de
                              llargada
                            </span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="metaTitle"
                            placeholder="Meta títol"
                            value={state.formData.metaTitle}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>
                            Meta descripció{" "}
                            <span className="form-composer__label-description">
                              Cada publicació hauria de tenir una meta
                              descripció única, idealment de menys de 160
                              caràcters de llargada
                            </span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="metaDescription"
                            placeholder="Meta descripció"
                            value={state.formData.metaDescription}
                            onChange={handleChange}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Slug</Form.Label>
                          <Form.Control
                            type="text"
                            name="slug"
                            placeholder="Slug de la llista"
                            onChange={handleChange}
                            value={state.formData.slug}
                          />
                        </Form.Group>
                      </Form>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ListForm;
