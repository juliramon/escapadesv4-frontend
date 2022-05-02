import React from "react";

const ToastNotification = ({ message }) => {
  return (
    <div className="fixed top-36 right-4 bg-primary-200 p-5 rounded-md w-96 z-30">
      <span className="text-secondary-100 text-sm">{message}</span>
    </div>
  );
};

export default ToastNotification;
