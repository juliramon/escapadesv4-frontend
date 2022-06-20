import React from "react";

const ShareBar = ({ url }) => {
  return (
    <ul className="list-none flex flex-wrap items-center -mx-3 mt-4">
      <span className="px-3 font-medium text-primary-500">Compartir a:</span>
      <a
        href={`http://www.facebook.com/sharer.php?u=${url}`}
        className="px-3 text-primary-400"
        target="_blank"
        rel="nofollow"
      >
        <span className="cloud-tag">Facebook</span>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${url}`}
        className="px-3 text-primary-400"
        target="_blank"
        rel="nofollow"
      >
        <span className="cloud-tag">Twitter</span>
      </a>
      <a
        href={`mailto:?subject=Mira%20aquesta%20escapada%20a%20Escapadesenparella.cat&body=${url}`}
        className="px-3 text-primary-400"
        target="_blank"
        rel="nofollow"
      >
        <span className="cloud-tag">Correu</span>
      </a>
    </ul>
  );
};

export default ShareBar;
