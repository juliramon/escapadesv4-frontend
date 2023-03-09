import { useState } from "react";
import { Alert, Button, Form, Modal, Toast } from "react-bootstrap";
import EmailService from "../../services/emailService";

const ForgotPasswordModal = ({ visibility, hideModal }) => {
	const emailService = new EmailService();
	const [serverMessage, setServerMessage] = useState(undefined);
	const [email, setEmail] = useState("");
	const [showToast, setShowToast] = useState(false);
	const [toastText, setToastText] = useState(undefined);
	const handleChange = (e) => {
		if (email !== "") {
			setServerMessage(undefined);
		}
		setEmail(e.target.value);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (email === "") {
			setServerMessage("Escriu el teu correu electrònic");
		} else {
			emailService.sendResetPasswordEmail(email).then((res) => {
				setToastText(res.message);
				hideModal();
				setShowToast(true);
				setEmail("");
			});
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
		<>
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
									value={email}
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
			<Toast
				onClose={() => setShowToast(false)}
				show={showToast}
				delay={5000}
				autohide
			>
				<Toast.Header>
					<img
						src="holder.js/20x20?text=%20"
						className="rounded-md me-2"
						alt=""
					/>
					<strong className="me-auto">Escapadesenparella.cat</strong>
				</Toast.Header>
				<Toast.Body>{toastText}</Toast.Body>
			</Toast>
		</>
	);
};

export default ForgotPasswordModal;
