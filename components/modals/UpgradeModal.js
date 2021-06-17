import { Modal } from "react-bootstrap";
import Link from "next/link";
import UserContext from "../../contexts/UserContext";
import { useContext } from "react";

const UpgradeModal = ({ visibility, hideModal }) => {
  const { user } = useContext(UserContext);

  return (
    <Modal
      show={visibility}
      onHide={hideModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="publicationModal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Millora el teu pla per seguir publicant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Has arribat al màxim de publicacions al teu compte d'empresa.
          <br /> Per publicar més escapades, millora el teu pla.
        </p>
        <Link href={"/empreses#plans"}>
          <a className="btn">Veure plans</a>
        </Link>
      </Modal.Body>
    </Modal>
  );
};

export default UpgradeModal;
