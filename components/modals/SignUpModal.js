import { Modal } from "react-bootstrap";
import Link from "next/link";

const SignUpModal = ({ visibility, hideModal }) => {
  return (
    <Modal
      show={visibility}
      onHide={hideModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="signUpModal"
    >
      <Modal.Body>
        <div className="body-wrapper">
          <img src="../../sign-up-asset.svg" alt="Sign up to Getaways.guru" />
          <h1 className="modal-title">Registra't per guardar escapades!</h1>
          <p className="modal-subtitle">
            Crea el teu compte gratuït per guardar i planificar la teva propera
            escapada en parella ideal!
          </p>
          <Link href="/signup">
            <a className="btn btn-dark text-center">Crear el meu compte</a>
          </Link>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SignUpModal;
