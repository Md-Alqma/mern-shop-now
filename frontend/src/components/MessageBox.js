// Component for showing messages for the errors

// Global Imports
import React from "react";

// External Imports
import Alert from "react-bootstrap/Alert";

function MessageBox(props) {
  return <Alert variant={props.variant || "info"}>{props.children}</Alert>;
}

export default MessageBox;
