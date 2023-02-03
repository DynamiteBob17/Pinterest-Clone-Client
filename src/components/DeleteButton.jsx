import React, { useState } from "react";
import request from "../utils/make_server_request";
import "./DeleteButton.scss";
// make user confirm delete 

function DeleteButton(props) {
  const [deleting, setDeleting] = useState(false);

  return (
    <button
      className={"delete_button"}
      onClick={() => {
        if (window.confirm("Are you sure you want to delete this pic?")) {
          props.handleDelete(props.pic._id, setDeleting);
        }
      }}
      disabled={deleting}
    >
      <i className="fa-solid fa-trash"></i>
    </button>
  );
}

export default DeleteButton;
