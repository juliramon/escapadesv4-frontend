import { Modal } from "react-bootstrap";
import Link from "next/link";

const ShareModal = ({ visibility, hideModal, url }) => {
  return (
    <Modal
      show={visibility}
      onHide={hideModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="shareModal"
    >
      <Modal.Body>
        <div className="body-wrapper">
          <img
            src="../../share-modal-graphic.svg"
            alt="Comparteix l'escapada"
          />
          <h1 className="modal-title">Comparteix l'escapada</h1>
          <div className="share-buttons">
            <a
              href={`http://www.facebook.com/sharer.php?u=${url}`}
              target="_blank"
              rel="nofollow"
            >
              <a className="btn btn-dark text-center">Facebook</a>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${url}`}
              target="_blank"
              rel="nofollow"
            >
              <a className="btn btn-dark text-center">Twitter</a>
            </a>
            <a
              href={`mailto:?subject=Mira%20aquesta%20escapada%20a%20Escapadesenparella.cat&body=${url}`}
              target="_blank"
              rel="nofollow"
            >
              <a className="btn btn-dark text-center">Correu</a>
            </a>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ShareModal;
