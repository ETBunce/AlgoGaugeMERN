import ReactBootstrapModal from "react-bootstrap/Modal";
import "../App.css";
import { Status } from "../utils/constants";

// Description: Generic Modal component used to display information (ex. experiment details, algorithm info, etc...). Uses React Bootstrap.
// @showModal: boolean useState value passed in to either show the modal or not
// @onHide: Function used whenever the modal is closed (X button or ESC key), typically used to change the showModal variable to false
// @title: Header title of the Modal 
// @children: JSX (basically HTML) to be rendered inbetween the <Modal>{children}</Modal> to allow for generic usage
// @size: How big Modal should be, defaults to large. Can also do 'sm' for small or 'xl' for extra large.
// @status (optional): To change the color of the title based on experiment status
const Modal = ({ showModal, onHide, title, children, size = "lg", status }) => {
  return (
    <ReactBootstrapModal
      show={showModal}
      onHide={onHide}
      centered
      scrollable
      size={size}
    >
      <ReactBootstrapModal.Header closeButton className="bg-primary text-light">
        {" "}
        <button
          type="button"
          className="btn-close visibility-hidden"
          aria-label="Close"
        ></button>
        <ReactBootstrapModal.Title
          className={`fw-bold fs-3 ${
            status === Status.FAILED
              ? "text-danger"
              : status === Status.RUNNING
              ? "text-warning"
              : status === Status.SUCCESS
              ? "text-success"
              : status === Status.WAITING
              ? "text-info"
              : ""
          }`}
        >
          {title}
        </ReactBootstrapModal.Title>
      </ReactBootstrapModal.Header>
      <ReactBootstrapModal.Body className="p-4">
        {children}
      </ReactBootstrapModal.Body>
    </ReactBootstrapModal>
  );
};

export default Modal;
