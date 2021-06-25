import React, { useState } from "react";
import { Dropdown, Button } from "react-bootstrap";
import Link from "next/link";
import ContentService from "../../services/contentService";
import ShareModal from "../modals/ShareModal";
import PaymentService from "../../services/paymentService";

const ContentBox = ({
  type,
  slug,
  id,
  image,
  title,
  subtitle,
  publicationDate,
  fetchData,
}) => {
  let shortenedSubtitle = subtitle.slice(0, 70);
  const service = new ContentService();
  const paymentService = new PaymentService();
  const removeItem = () => {
    if (type === "activity") {
      service.removeActivity(id).then(() => {
        fetchData();
        paymentService.editUserSubscription();
      });
    } else if (type === "place") {
      service.removePlace(id).then(() => {
        fetchData();
        paymentService.editUserSubscription();
      });
      paymentService.editUserSubscription();
    } else if (type === "story") {
      service.removeStory(id).then(() => fetchData());
    }
  };
  let path;
  if (type === "activity") {
    path = "activitats";
  } else if (type === "place") {
    path = "allotjaments";
  } else if (type === "story") {
    path = "histories";
  }

  const urlToShare = `https://escapadesenparella.cat/${path}/${id}`;

  const transformDate = (unformattedDate) => {
    let modpublicationDate = new Date(unformattedDate);
    const getYear = modpublicationDate.getFullYear();
    const getMonth = modpublicationDate.getMonth();
    const getDay = modpublicationDate.getDate();
    return `${getDay}/${getMonth + 1}/${getYear}`;
  };

  const [shareModalVisibility, setShareModalVisibility] = useState(false);
  const handleShareModalVisibility = () => setShareModalVisibility(true);
  const hideShareModalVisibility = () => setShareModalVisibility(false);

  return (
    <div className="content box d-flex align-items-center">
      <Link href={`/${path}/${slug}`}>
        <a className="d-flex align-items-center">
          <div className="image">
            <img src={image} alt={title} />
          </div>
          <h1 className="title">{title}</h1>
          <p className="subtitle">{shortenedSubtitle}...</p>
          <p className="date">{transformDate(publicationDate)}</p>
        </a>
      </Link>
      <div className="crud-buttons">
        <Dropdown>
          <Dropdown.Toggle variant="none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-dots"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#2c3e50"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <circle cx="5" cy="12" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
            </svg>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <ul>
              <li>
                <Link href={`/${path}/${slug}`}>
                  <a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-eye"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#2c3e50"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <circle cx="12" cy="12" r="2" />
                      <path d="M2 12l1.5 2a11 11 0 0 0 17 0l1.5 -2" />
                      <path d="M2 12l1.5 -2a11 11 0 0 1 17 0l1.5 2" />
                    </svg>
                    Visualitzar
                  </a>
                </Link>
              </li>
              <li>
                <Link href={`/${path}/${slug}/editar`}>
                  <a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-pencil"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#2c3e50"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
                      <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
                    </svg>
                    Editar
                  </a>
                </Link>
              </li>
              <li>
                <button onClick={() => handleShareModalVisibility()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-share"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#2c3e50"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="6" r="3" />
                    <circle cx="18" cy="18" r="3" />
                    <line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
                    <line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
                  </svg>
                  Compartir
                </button>
              </li>
              <li>
                <Button variant="none" onClick={removeItem}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-trash"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#2c3e50"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                  </svg>
                  Eliminar
                </Button>
              </li>
            </ul>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <ShareModal
        visibility={shareModalVisibility}
        hideModal={hideShareModalVisibility}
        url={urlToShare}
      />
    </div>
  );
};

export default ContentBox;
