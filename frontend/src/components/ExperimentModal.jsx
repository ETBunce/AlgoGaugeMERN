import React from "react";
import Modal from "./Modal";
import ExperimentTable from "./ExperimentTable";
import { Status } from "../utils/constants";

// Description: More specific Modal component used to display an experiment details.
// @showModal: boolean useState value passed in to either show the modal or not
// @onHide: Function used whenever the modal is closed (X button or ESC key), typically used to change the showModal variable to false
// @experiment: MongoDB experiment used to display table of data, time created, and differnet statuses
// @label: Header title of the Modal, typically called "Experiment" followed by the label (number or status of experiment ex. Currently Running)
// @queueIndex (optional): To show where experiment is in the queue when in the WAITING state
// @queueLength (optional): To show length of the queue when an experiment is in the WAITING state
const ExperimentModal = ({showModal, onHide, experiment, label, queueIndex, queueLength}) => {
  return (
    <Modal
      showModal={showModal}
      onHide={onHide}
      title={`Experiment ${label}`}
      status={experiment.status}
    >
      <div className="d-flex flex-column mb-3">
        <ExperimentTable
          experiment={experiment}
          queueIndex={queueIndex}
          queueLength={queueLength}
        />
        {experiment.status === Status.FAILED ? (
          <div className="text-danger shadow p-3">
            Error: {experiment.error}
          </div>
        ) : null}
        <div className="text-primary shadow mt-2 fw-bold p-3">
          Time Created: {new Date(experiment.createdAt).toLocaleString()}
        </div>
      </div>
    </Modal>
  );
};

export default ExperimentModal;
