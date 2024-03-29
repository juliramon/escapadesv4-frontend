import { Modal } from "react-bootstrap";
import Link from "next/link";
import UserContext from "../../contexts/UserContext";
import { useContext } from "react";

const PublicationModal = ({ visibility, hideModal }) => {
  const { user } = useContext(UserContext);
  const postStoryOption = (
    <li>
      <div className="col left">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-notebook"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#00206B"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18" />
          <line x1="13" y1="8" x2="15" y2="8" />
          <line x1="13" y1="12" x2="15" y2="12" />
        </svg>
      </div>
      <div className="col">
        <h3>Història</h3>
        <p>
          Recomana les històries en parella que més t'han agradat perquè
          serveixin d'inspiració a altres parelles i les puguin reviure
        </p>
      </div>
      <div className="col right">
        <Link href="/nova-historia">
          <a className="btn btn-m btn-dark">Publicar</a>
        </Link>
      </div>
    </li>
  );
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
        <Modal.Title>Recomana una escapada</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className="d-flex flex-column">
          <li>
            <div className="col left">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-route"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#00206B"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <circle cx="6" cy="19" r="2" />
                <circle cx="18" cy="5" r="2" />
                <path d="M12 19h4.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h3.5" />
              </svg>
            </div>
            <div className="col">
              <h3>Activitat</h3>
              <p>
                Recomana les activitats que més t'han agradat, o que gestionis,
                perquè serveixin d'inspiració a altres parelles i en puguin
                gaudir
              </p>
            </div>
            <div className="col right">
              <Link href="/nova-activitat">
                <a className="btn btn-m btn-dark">Publicar</a>
              </Link>
            </div>
          </li>
          <li>
            <div className="col left">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-bed"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#00206B"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M3 7v11m0 -4h18m0 4v-8a2 2 0 0 0 -2 -2h-8v6" />
                <circle cx="7" cy="10" r="1" />
              </svg>
            </div>
            <div className="col">
              <h3>Allotjament</h3>
              <p>
                Recomana els allotjaments que més t'han agradat, o que
                gestionis, perquè serveixin d'inspiració a altres parelles i en
                puguin gaudir
              </p>
            </div>
            <div className="col right">
              <Link href="/nou-allotjament">
                <a className="btn btn-m btn-dark">Publicar</a>
              </Link>
            </div>
          </li>
          {user.userType === "admin" ? postStoryOption : null}
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export default PublicationModal;
