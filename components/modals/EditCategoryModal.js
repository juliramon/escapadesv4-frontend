import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import slugify from "slugify";
import ContentService from "../../services/contentService";

const EditCategoryModal = ({
  visibility,
  hideModal,
  id,
  name,
  title,
  subtitle,
  image,
  icon,
  seoText,
  fetchData,
}) => {
  const service = new ContentService();
  const initialState = {
    id: id,
    name: name,
    title: title,
    subtitle: subtitle,
    image: image,
    blopImage: "",
    cloudImage: "",
    cloudImageUploaded: false,
    icon: icon,
    seoText: seoText,
    updatedImage: false,
  };

  const [category, setCategory] = useState(initialState);

  const handleChange = (e) =>
    setCategory({ ...category, [e.target.name]: e.target.value });

  const saveFileToStatus = (e) => {
    const fileToUpload = e.target.files[0];
    setCategory({
      ...category,
      blopImage: URL.createObjectURL(fileToUpload),
      image: fileToUpload,
      updatedImage: true,
    });
  };

  const handleFileUpload = async (e) => {
    const image = category.image;
    const uploadData = new FormData();
    if (category.updatedImage) {
      uploadData.append("imageUrl", image);
      service.uploadFile(uploadData).then((res) => {
        setCategory({
          ...category,
          cloudImage: res.path,
          cloudImageUploaded: true,
        });
      });
    }
  };

  const submitCategory = async () => {
    const slug = await slugify(category.title, {
      remove: /[*+~.,()'"!:@]/g,
      lower: true,
    });
    const {
      id,
      name,
      title,
      subtitle,
      image,
      cloudImage,
      icon,
      seoText,
    } = category;
    let categoryImage;
    cloudImage !== "" ? (categoryImage = cloudImage) : (categoryImage = image);
    service
      .editCategory(
        id,
        slug,
        name,
        title,
        subtitle,
        categoryImage,
        icon,
        seoText
      )
      .then(() => {
        hideModal();
        fetchData();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (category.cloudImageUploaded === true) {
      submitCategory();
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (category.updatedImage) {
      handleFileUpload();
    } else {
      submitCategory();
    }
    console.log("category created");
  };

  useEffect(() => {
    if (category.cloudImageUploaded === true) {
      submitCategory();
    }
  }, [category]);

  let imagePreview;
  if (category.blopImage) {
    imagePreview = (
      <div className="image">
        <img src={category.blopImage} />
      </div>
    );
  } else {
    imagePreview = (
      <div className="image">
        <img src={category.image} />
      </div>
    );
  }

  const categoryPublicationForm = (
    <Form>
      <Form.Group controlId="categoryName">
        <Form.Label>Nom de la categoria</Form.Label>
        <Form.Control
          type="text"
          placeholder="Entra el nom de la categoria"
          name="name"
          onChange={handleChange}
          value={category.name}
        />
      </Form.Group>
      <Form.Group controlId="categoryTitle">
        <Form.Label>Títol de la categoria</Form.Label>
        <Form.Control
          type="text"
          placeholder="Entra el títol de la categoria"
          name="title"
          onChange={handleChange}
          value={category.title}
        />
      </Form.Group>
      <Form.Group controlId="categorySubtitle">
        <Form.Label>Subtítol de la categoria</Form.Label>
        <Form.Control
          type="text"
          placeholder="Entra el subtítol de la categoria"
          name="subtitle"
          onChange={handleChange}
          value={category.subtitle}
        />
      </Form.Group>
      <div className="image">
        <span>Imatge de la categoria</span>
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
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <circle cx="12" cy="13" r="3" />
                    <path d="M5 7h2a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h2m9 7v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                    <line x1="15" y1="6" x2="21" y2="6" />
                    <line x1="18" y1="3" x2="18" y2="9" />
                  </svg>
                  Afegir imatge
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={saveFileToStatus}
                    max="1"
                  />
                </Form.Label>
              </div>
            </Form.Group>
          </div>
          <div className="images-list-wrapper">
            <div className="image-wrapper">{imagePreview}</div>
          </div>
        </div>
      </div>
      <Form.Group controlId="categoryIcon">
        <Form.Label>Icona de la categoria</Form.Label>
        <textarea
          rows="3"
          cols="3"
          placeholder="Entra text svg de l'icona de la categoria"
          className="form-control"
          name="icon"
          onChange={handleChange}
          value={category.icon}
        ></textarea>
      </Form.Group>
      <Form.Group controlId="categorySeoText">
        <Form.Label>Text SEO de la categoria</Form.Label>
        <textarea
          rows="6"
          cols="30"
          placeholder="Entra el text SEO per a la categoria"
          className="form-control"
          name="seoText"
          onChange={handleChange}
          value={category.seoText}
        ></textarea>
      </Form.Group>
    </Form>
  );
  return (
    <Modal
      show={visibility}
      onHide={hideModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="categoryPublicationModal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edita la categoria</Modal.Title>
      </Modal.Header>
      <Modal.Body>{categoryPublicationForm}</Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Editar categoria</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCategoryModal;
