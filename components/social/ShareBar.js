import React from "react";

const ShareBar = ({ url }) => {
  return (
    <div className="share-bar">
      <div className="share-bar__wrapper">
        <a
          href={`http://www.facebook.com/sharer.php?u=${url}`}
          target="_blank"
          rel="nofollow"
        >
          <span className="cloud-tag">Facebook</span>
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${url}`}
          target="_blank"
          rel="nofollow"
        >
          <span className="cloud-tag">Twitter</span>
        </a>
        <a
          href={`mailto:?subject=Mira%20aquesta%20escapada%20a%20Escapadesenparella.cat&body=${url}`}
          target="_blank"
          rel="nofollow"
        >
          <span className="cloud-tag">Correu</span>
        </a>
      </div>
    </div>
  );
};

export default ShareBar;
