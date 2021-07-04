import { useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import UserContext from "../../contexts/UserContext";

const ForgotPasswordModal = ({ visibility, hideModal }) => {
  const { user } = useContext(UserContext);
  const handleChange = (e) =>
    setState({ ...StaticRange, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    //submit
  };
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
          <h1 className="modal-title">Recupera la contrassenya</h1>
          <Form>
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
