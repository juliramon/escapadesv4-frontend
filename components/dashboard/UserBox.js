import Link from "next/link";
import { Dropdown } from "react-bootstrap";

const UserBox = ({ avatar, fullName, email, slug }) => {
  let shortenedEmail = email.slice(0, 70);

  return (
    <div className="content box d-flex align-items-center">
      <Link href={`/usuaris/${slug}`}>
        <a className="d-flex align-items-center">
          <div className="image">
            <img src={avatar} alt={fullName} />
          </div>
          <h1 className="title">{fullName}</h1>
          <p className="subtitle">{shortenedEmail}...</p>
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
              stroke="#00206B"
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
                <Link href={`/usuaris/${slug}`}>
                  <a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-eye"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#00206B"
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
            </ul>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default UserBox;
