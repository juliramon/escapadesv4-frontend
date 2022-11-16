import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import slugify from "slugify";
import ContentService from "../../services/contentService";

const CreateCategoryModal = ({ visibility, hideModal, fetchData }) => {
  const service = new ContentService();

  const initialState = {
    name: "",
    pluralName: "",
    isPlace: false,
    title: "",
    subtitle: "",
    image: "",
    blopImage: "",
    cloudImage: "",
    cloudImageUploaded: false,
    icon: "",
    seoText: "",
    isFeatured: false,
    isSponsored: false,
    sponsorURL: "",
    sponsorLogo: "",
    blopSponsorLogo: "",
    cloudSponsorLogo: "",
    cloudSponsorLogoUploaded: false,
    sponsorClaim: "",
  };

  const [category, setCategory] = useState(initialState);

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleCheck = (e) => {
    if (e.target.name === "isPlace") {
      e.target.checked
        ? setCategory({ ...category, isPlace: true })
        : setCategory({ ...category, isPlace: false });
    } else {
      e.target.checked
        ? setCategory({ ...category, isSponsored: true })
        : setCategory({ ...category, isSponsored: false });
    }
    if (e.target.name === "isFeatured") {
      e.target.checked
        ? setCategory({ ...category, isFeatured: true })
        : setCategory({ ...category, isFeatured: false });
    }
  };

  const saveFileToStatus = (e) => {
    const fileToUpload = e.target.files[0];
    if (e.target.name === "image") {
      setCategory({
        ...category,
        blopImage: URL.createObjectURL(fileToUpload),
        image: fileToUpload,
      });
    }
    if (e.target.name === "sponsorLogo") {
      setCategory({
        ...category,
        blopSponsorLogo: URL.createObjectURL(fileToUpload),
        sponsorLogo: fileToUpload,
      });
    }
  };

  const handleFileUpload = async (e) => {
    const image = category.image;
    let uploadedSponsorLogo;
    const uploadData = new FormData();
    uploadData.append("imageUrl", image);
    const uploadedImage = await service.uploadFile(uploadData);
    if (category.isSponsored && category.sponsorLogo !== "") {
      const sponsorLogo = category.sponsorLogo;
      const uploadData = new FormData();
      uploadData.append("imageUrl", sponsorLogo);
      uploadedSponsorLogo = await service.uploadFile(uploadData);
    }
    setCategory({
      ...category,
      cloudImage: uploadedImage.path,
      cloudImageUploaded: true,
      cloudSponsorLogo: uploadedSponsorLogo ? uploadedSponsorLogo.path : null,
      cloudSponsorLogoUploaded: true,
    });
  };

  const submitCategory = async () => {
    const slug = await slugify(category.title, {
      remove: /[*+~.,()'"!:@]/g,
      lower: true,
    });
    const {
      isFeatured,
      isSponsored,
      name,
      pluralName,
      isPlace,
      title,
      subtitle,
      cloudImage,
      icon,
      seoText,
      sponsorURL,
      cloudSponsorLogo,
      sponsorClaim,
    } = category;
    service
      .createCategory(
        isFeatured,
        isSponsored,
        slug,
        name,
        pluralName,
        isPlace,
        title,
        subtitle,
        cloudImage,
        icon,
        seoText,
        sponsorURL,
        cloudSponsorLogo,
        sponsorClaim
      )
      .then(() => {
        hideModal();
        fetchData();
      })
      .catch((err) => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFileUpload();
  };

  useEffect(() => {
    if (
      category.cloudImageUploaded === true ||
      category.cloudSponsorLogoUploaded === true ||
      (category.cloudImageUploaded === true &&
        category.cloudSponsorLogoUploaded === true)
    ) {
      submitCategory();
    }
  }, [category]);

  useEffect(() => {
    if (!category.isSponsored) {
      if (
        category.sponsorURL !== "" ||
        category.sponsorLogo !== "" ||
        category.blopSponsorLogo !== "" ||
        category.sponsorClaim !== ""
      ) {
        setCategory({
          ...category,
          sponsorURL: "",
          sponsorLogo: "",
          blopSponsorLogo: "",
          sponsorClaim: "",
        });
      }
    }
  });

  let imagePreview, sponsorLogoPreview;
  if (category.blopImage) {
    imagePreview = (
      <div className="image">
        <img src={category.blopImage} />
      </div>
    );
  }

  if (category.blopSponsorLogo) {
    sponsorLogoPreview = (
      <div className="image">
        <img src={category.blopSponsorLogo} />
      </div>
    );
  }

  const sponsorBlock = category.isSponsored ? (
    <>
      {" "}
      <Form.Group controlId="categorySponsorURL">
        <Form.Label>URL del patrocinador</Form.Label>
        <Form.Control
          type="url"
          placeholder="Entra la URL del patrocinador"
          name="sponsorURL"
          onChange={handleChange}
        />
      </Form.Group>
      <div className="image">
        <span>Logo del patrocinador</span>
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
                  Afegir logo
                  <Form.Control
                    type="file"
                    name="sponsorLogo"
                    onChange={saveFileToStatus}
                    max="1"
                  />
                </Form.Label>
              </div>
            </Form.Group>
          </div>
          <div className="images-list-wrapper">
            <div className="image-wrapper">{sponsorLogoPreview}</div>
          </div>
        </div>
      </div>
      <Form.Group controlId="categorySponsorClaim">
        <Form.Label>Claim del patrocinador</Form.Label>
        <Form.Control
          type="text"
          placeholder="Entra el claim del patrocinador"
          name="sponsorClaim"
          onChange={handleChange}
        />
      </Form.Group>{" "}
    </>
  ) : null;

  const categoryPublicationForm = (
    <Form>
      <Form.Group controlId="categoryName">
        <Form.Label>Nom de la categoria</Form.Label>
        <Form.Control
          type="text"
          placeholder="Entra el nom de la categoria"
          name="name"
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="categoryName">
        <Form.Label>Nom en plural de la categoria</Form.Label>
        <Form.Control
          type="text"
          placeholder="Entra el nom en plural de la categoria"
          name="pluralName"
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="categoryIsSponsored">
        <Form.Check
          type="checkbox"
          label="És categoria d'allotjament?"
          onClick={handleCheck}
          name="isPlace"
        />
      </Form.Group>
      <Form.Group controlId="categoryTitle">
        <Form.Label>Títol de la categoria</Form.Label>
        <Form.Control
          type="text"
          placeholder="Entra el títol de la categoria"
          name="title"
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="categorySubtitle">
        <Form.Label>Subtítol de la categoria</Form.Label>
        <Form.Control
          type="text"
          placeholder="Entra el subtítol de la categoria"
          name="subtitle"
          onChange={handleChange}
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
        ></textarea>
      </Form.Group>
      <Form.Group controlId="categoryIsSponsored">
        <Form.Check
          type="checkbox"
          label="Categoria patrocinada?"
          onClick={handleCheck}
        />
      </Form.Group>
      <Form.Group controlId="categoryIsFeatured">
        <Form.Check
          type="checkbox"
          name="isFeatured"
          label="Categoria destacada?"
          onClick={handleCheck}
        />
      </Form.Group>
      {sponsorBlock}
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
        <Modal.Title>Crea una nova categoria</Modal.Title>
      </Modal.Header>
      <Modal.Body>{categoryPublicationForm}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="none"
          className="btn btn-m btn-dark"
          onClick={handleSubmit}
        >
          Crear categoria
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateCategoryModal;
