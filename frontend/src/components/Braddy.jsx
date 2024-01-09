import { useState } from "react";
import Toast from "react-bootstrap/Toast";
import { Status } from "../utils/constants";
import { dotDotTextInputExperiment } from "../utils/helperFunctions";
import ExperimentTable from "./ExperimentTable";
import ExperimentModal from "./ExperimentModal";
import axios from "axios";
import toast from "react-hot-toast";

// Description: The side menu that shows when a user submits an experiment
// @experiment: Takes in the experiment submitted and shows the current status (waiting, running, failed, success, loading)
// @label: Refers to the title of the modal (a number to indicate )
// @setBraddys: Used to remove this particular braddy
// @queue: Refers to the queue coming from mongoDB and is used to show position of braddy in the queue
const Braddy = ({ experiment, label, queue, setBraddys, show }) => {
  const [showBraddyDetailsModal, setShowBraddyDetailsModal] = useState(false);

  const queueIndex = queue?.findIndex(
    (queueExperiment) => experiment._id === queueExperiment._id
  );

  const queueLength = queue?.length - 1;

  // Remove braddy from session in backend while also updating UI
  const OnClose = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/experiment/braddys/${experiment._id}`
      );
      setBraddys((prev) =>
        prev.filter(
          (braddyExperiment) => braddyExperiment._id !== experiment._id
        )
      );
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      {/* Modal to shows details of the particular experiment passed in*/}
      <ExperimentModal
        label={label}
        showModal={showBraddyDetailsModal}
        experiment={experiment}
        onHide={() => setShowBraddyDetailsModal(false)}
      />
      {/* Toast is the small menu containing button to shows more details */}
      <Toast show={show} animation onClose={OnClose}>
        <Toast.Header className="bg-primary p-3 rounded-0 text-light justify-content-between">
          {dotDotTextInputExperiment(experiment.input, 26)}
        </Toast.Header>
        <Toast.Body>
          {experiment.status === Status.SUCCESS ? (
            <>
              <h2 className="fs-4 text-success">Experiment completed!</h2>
              <button
                onClick={() => {
                  setShowBraddyDetailsModal(true);
                }}
                className="btn btn-primary shadow"
              >
                {" "}
                View Result
              </button>
            </>
          ) : experiment.status === Status.FAILED ? (
            <>
              <h2 className="fs-4 text-danger">Experiment failed!</h2>
              <button
                onClick={() => {
                  setShowBraddyDetailsModal(true);
                }}
                className="btn btn-primary shadow"
              >
                {" "}
                View Result
              </button>
            </>
          ) : // queueIndex of 0 means that the experiment at the top of the queue is the running one in Mongo
          experiment.status === Status.RUNNING || queueIndex === 0 ? (
            <>
              <div className="fs-4 text-warning d-flex">
                <div> Experiment Running</div>
                <div className="spinner-border ms-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowBraddyDetailsModal(true);
                }}
                className="btn btn-primary shadow"
              >
                {" "}
                View Experiment
              </button>
            </>
          ) : // queueIndex of -1 means that the experiment wasn't found yet by the findIndex function since we are polling the queue every second
          experiment.status === Status.WAITING && queueIndex !== -1 ? (
            <>
              <div className="fs-4 text-info d-flex">
                <div>
                  {" "}
                  In Queue: {queueIndex}/{queueLength}
                </div>
              </div>
              <button
                onClick={() => {
                  setShowBraddyDetailsModal(true);
                }}
                className="btn btn-primary shadow"
              >
                {" "}
                View Experiment
              </button>
            </>
          ) : (
            <div className="fs-4 text-primary d-flex">
              <div>Loading</div>
              <div className="spinner-border ms-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </Toast.Body>
      </Toast>
    </>
  );
};

export default Braddy;
