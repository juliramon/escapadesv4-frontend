import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import slugify from "slugify";
import ContentService from "../../services/contentService";

const CreateRegionModal = ({ visibility, hideModal, fetchData }) => {
  const service = new ContentService();

  const initialState = {
    name: "",
    pluralName: "",
    title: "",
    subtitle: "",
    image: "",
    blopImage: "",
    cloudImage: "",
    cloudImageUploaded: false,
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

  const [region, setRegion] = useState(initialState);

  const handleChange = (e) => {
    setRegion({ ...region, [e.target.name]: e.target.value });
  };

  const handleCheck = (e) => {
    if (e.target.name === "isFeatured") {
      e.target.checked
        ? setRegion({ ...region, isFeatured: true })
        : setRegion({ ...region, isFeatured: false });
    }
  };

  const saveFileToStatus = (e) => {
    const fileToUpload = e.target.files[0];
    if (e.target.name === "image") {
      setRegion({
        ...region,
        blopImage: URL.createObjectURL(fileToUpload),
        image: fileToUpload,
      });
    }
    if (e.target.name === "sponsorLogo") {
      setRegion({
        ...region,
        blopSponsorLogo: URL.createObjectURL(fileToUpload),
        sponsorLogo: fileToUpload,
      });
    }
  };

  const handleFileUpload = async (e) => {
    const image = region.image;
    let uploadedSponsorLogo;
    const uploadData = new FormData();
    uploadData.append("imageUrl", image);
    const uploadedImage = await service.uploadFile(uploadData);
    if (region.isSponsored && region.sponsorLogo !== "") {
      const sponsorLogo = region.sponsorLogo;
      const uploadData = new FormData();
      uploadData.append("imageUrl", sponsorLogo);
      uploadedSponsorLogo = await service.uploadFile(uploadData);
    }
    setRegion({
      ...region,
      cloudImage: uploadedImage.path,
      cloudImageUploaded: true,
      cloudSponsorLogo: uploadedSponsorLogo ? uploadedSponsorLogo.path : null,
      cloudSponsorLogoUploaded: true,
    });
  };

  const concatSlug = `escapades-${region.name}`;

  const submitRegion = async () => {
    const slug = await slugify(concatSlug, {
      remove: /[*+~.,()'"!:@]/g,
      lower: true,
    });
    const {
      isFeatured,
      isSponsored,
      name,
      pluralName,
      title,
      subtitle,
      cloudImage,
      seoText,
      sponsorURL,
      cloudSponsorLogo,
      sponsorClaim,
    } = region;
    service
      .createRegion(
        isFeatured,
        isSponsored,
        slug,
        name,
        pluralName,
        title,
        subtitle,
        cloudImage,
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
      region.cloudImageUploaded === true ||
      region.cloudSponsorLogoUploaded === true ||
      (region.cloudImageUploaded === true &&
        region.cloudSponsorLogoUploaded === true)
    ) {
      submitRegion();
    }
  }, [region]);

  useEffect(() => {
    if (!region.isSponsored) {
      if (
        region.sponsorURL !== "" ||
        region.sponsorLogo !== "" ||
        region.blopSponsorLogo !== "" ||
        region.sponsorClaim !== ""
      ) {
        setRegion({
          ...region,
          sponsorURL: "",
          sponsorLogo: "",
          blopSponsorLogo: "",
          sponsorClaim: "",
        });
      }
    }
  });

  let imagePreview, sponsorLogoPreview;
  if (region.blopImage) {
    imagePreview = (
      <div className="image">
        <img src={region.blopImage} />
      </div>
    );
  }

  if (region.blopSponsorLogo) {
    sponsorLogoPreview = (
      <div className="image">
        <img src={region.blopSponsorLogo} />
      </div>
    );
  }

  const sponsorBlock = region.isSponsored ? (
    <>
      {" "}
      <Form.Group controlId="regionSponsorURL">
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
      <Form.Group controlId="regionSponsorClaim">
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

  const regionPublicationForm = (
    <Form>
      <Form.Group controlId="regionName">
        <Form.Label>Nom de la regió</Form.Label>
        <Form.Control
          type="text"
          placeholder="Entra el nom de la regió"
          name="name"
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="regionName">
        <Form.Label>Nom en plural de la regió</Form.Label>
        <Form.Control
          type="text"
          placeholder="Entra el nom en plural de la regió"
          name="pluralName"
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="regionTitle">
        <Form.Label>Títol de la regió</Form.Label>
        <Form.Control
          type="text"
          placeholder="Entra el títol de la regió"
          name="title"
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="regionSubtitle">
        <Form.Label>Subtítol de la regió</Form.Label>
        <Form.Control
          type="text"
          placeholder="Entra el subtítol de la regió"
          name="subtitle"
          onChange={handleChange}
        />
      </Form.Group>
      <div className="image">
        <span>Imatge de la regió</span>
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
      <Form.Group controlId="regionSeoText">
        <Form.Label>Text SEO de la regió</Form.Label>
        <textarea
          rows="6"
          cols="30"
          placeholder="Entra el text SEO per a la regió"
          className="form-control"
          name="seoText"
          onChange={handleChange}
        ></textarea>
      </Form.Group>
      <Form.Group controlId="regionIsSponsored">
        <Form.Check
          type="checkbox"
          label="Regió patrocinada?"
          onClick={handleCheck}
        />
      </Form.Group>
      <Form.Group controlId="regionIsFeatured">
        <Form.Check
          type="checkbox"
          name="isFeatured"
          label="Regió destacada?"
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
      className="regionPublicationModal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Crea una nova regió</Modal.Title>
      </Modal.Header>
      <Modal.Body>{regionPublicationForm}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="none"
          className="btn btn-m btn-dark"
          onClick={handleSubmit}
        >
          Crear regió
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateRegionModal;
