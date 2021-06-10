import React, { useState } from "react";
import { Button } from "react-bootstrap";
import PublicationModal from "../modals/PublicationModal";

const ButtonSharePost = ({ canPublish }) => {
  console.log("can publish =>", canPublish);
  const [modalVisibility, setModalVisibility] = useState(false);
  const handleModalVisibility = () => setModalVisibility(true);
  const hideModalVisibility = () => setModalVisibility(false);
  if (canPublish) {
    return (
      <div className="new">
        <Button
          className="btn btn-primary text-center sidebar"
          onClick={handleModalVisibility}
        >
          Recomanar escapada
        </Button>
        <PublicationModal
          visibility={modalVisibility}
          hideModal={hideModalVisibility}
          canPublish={canPublish}
        />
      </div>
    );
  } else {
    return "you cant publish";
  }
};

export default ButtonSharePost;
