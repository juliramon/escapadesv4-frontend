import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import AuthService from "../../services/authService";

const ForgotPasswordModal = ({ visibility, hideModal }) => {
  const authService = new AuthService();
  const [serverMessage, setServerMessage] = useState(undefined);
  const [email, setEmail] = useState(undefined);
  const handleChange = (e) => setEmail(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === undefined) {
      setServerMessage("Escriu el teu correu electrònic");
    } else {
      authService.resetPassword(email).then((res) => console.log(res));
    }
  };
  let errorMessage;
  if (serverMessage !== undefined) {
    errorMessage = (
      <Alert variant="danger">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-shield-x"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#fff"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
          <path d="M10 10l4 4m0 -4l-4 4" />
        </svg>
        {serverMessage}
      </Alert>
    );
  }
  return (
    <Modal
      show={visibility}
      onHide={hideModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="forgotPasswordModal"
    >
      <Modal.Header closeButton>
        <div className="header-wrapper">
          <h1 className="modal-title">Recupera la teva contrassenya</h1>
          <p className="modal-subtitle">
            Escriu el correu electrònic associat al teu compte i t'enviarem
            l'enllaç per recuperar la teva contrassenya.
          </p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="body-wrapper">
          <Form>
            {errorMessage}
            <Form.Group>
              <Form.Label>Correu electrònic</Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Escriu el teu correu electrònic"
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Button
                type="submit"
                onClick={handleSubmit}
                variant="none"
                className="btn btn-m btn-dark"
              >
                Enviar
              </Button>
            </Form.Group>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ForgotPasswordModal;
