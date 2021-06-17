import React, { useState } from "react";
import { Button } from "react-bootstrap";
import PublicationModal from "../modals/PublicationModal";
import UpgradeModal from "../modals/UpgradeModal";

const ButtonSharePost = ({ canPublish }) => {
  console.log("can publish =>", canPublish);
  const [modalVisibility, setModalVisibility] = useState(false);
  const handleModalVisibility = () => setModalVisibility(true);
  const hideModalVisibility = () => setModalVisibility(false);
  if (canPublish) {
    return (
      <div className="post-new-content-button">
        <Button
          className="btn btn-primary text-center sidebar"
          onClick={handleModalVisibility}
        >
          Anunciar nova escapada
        </Button>
        <PublicationModal
          visibility={modalVisibility}
          hideModal={hideModalVisibility}
          canPublish={canPublish}
        />
      </div>
    );
  } else {
    return (
      <div className="post-new-content-button">
        <Button
          className="btn btn-primary text-center sidebar"
          onClick={handleModalVisibility}
        >
          Anunciar nova escapada
        </Button>
        <UpgradeModal
          visibility={modalVisibility}
          hideModal={hideModalVisibility}
        />
      </div>
    );
  }
};

export default ButtonSharePost;
