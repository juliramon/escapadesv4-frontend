import React, { useState } from "react";
import { Button } from "react-bootstrap";
import PublicationModal from "../modals/PublicationModal";

const ButtonSharePost = ({ canPublish }) => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const handleModalVisibility = () => setModalVisibility(true);
  const hideModalVisibility = () => setModalVisibility(false);
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
      />
    </div>
  );
};

export default ButtonSharePost;
