import React from "react";

function DeleteConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onConfirm}>Подтвердить</button>
        <button onClick={onCancel}>Отмена</button>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
