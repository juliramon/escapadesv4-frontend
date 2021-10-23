import React, { useState } from "react";
import { useCookies } from "react-cookie";

const FollowBox = () => {
  const [cookies, setCookie, removeCookie] = useCookies("");
  const initialState = {
    boxVisible: true,
  };
  const [state, setState] = useState(initialState);

  let cookieCreationDate = new Date();
  let cookieExpirationDate = new Date();
  cookieExpirationDate.setDate(cookieCreationDate.getDate() + 6);

  const closeBox = () => {
    setState({ ...state, boxVisible: false });
    setCookie("followBox", "false", { expires: cookieExpirationDate });
  };

  if (!state.boxVisible || cookies.followBox === "false") {
    return null;
  } else {
    return (
      <div className="followBox d-flex">
        <button onClick={() => closeBox()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-x"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#00206B"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="col-left">
          <div className="image-area">
            <picture>
              <source srcSet="./cover-instagram-escapadesenparella.jpg" />
              <img
                src="./cover-instagram-escapadesenparella.jpg"
                data-src="./cover-instagram-escapadesenparella.jpg"
                alt="Segueix @escapadesenparella a Instagram"
                width="110"
                height="110"
                loading="lazy"
              />
            </picture>
          </div>
        </div>
        <div className="col-right">
          <div className="text-area">
            <h3>
              Les millors
              <br /> escapades en parella
              <br /> també a Instagram
            </h3>
            <a
              href="https://instagram.com/escapadesenparella"
              rel="nofollow"
              target="_blank"
              onClick={() => closeBox()}
            >
              Segueix-nos a Instagram
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-external-link"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#2e6ae4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5" />
                <line x1="10" y1="14" x2="20" y2="4" />
                <polyline points="15 4 20 4 20 9" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }
};

export default FollowBox;
