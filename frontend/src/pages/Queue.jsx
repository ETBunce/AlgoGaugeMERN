import { Helmet } from "react-helmet-async";
import { Icon } from "@iconify/react";
import Modal from "../components/Modal";
import { useState } from "react";
import { Status } from "../utils/constants";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { dotDotTextInputExperiment } from "../utils/helperFunctions";
import ExperimentTable from "../components/ExperimentTable";
import ExperimentModal from "../components/ExperimentModal";

// Description: Page responsible for showing ongoing experiments submitted by anyone. Only displays running and waiting experiments.
// Also highlights a user's own experiments by matching the user's experiment ids to all of the experiment ids.
const Queue = ({ queue, queueError, queueIsError, queueIsLoading }) => {
  // Shows detailed info about experiment in Modal
  const [showModal, setShowModal] = useState(false);

  // The detailed info of an experiment when clicking on a row
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  // Fetches user's own experiments which are either running or waiting
  const {
    data: userExperimentsRunning,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useQuery({
    queryKey: ["user-experiments-running"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/experiment/userExperimentsRunning`
      );
      return data;
    },
  });

  // Fetches experiment user selected for the Modal every second when watching from queue
  useQuery({
    queryKey: ["currently-selected-experiment", selectedExperiment],
    queryFn: async () => {
      if (selectedExperiment) {
        const { data: currentlySelectedExperiment } = await axios.get(
          `${process.env.REACT_APP_API}/experiment/selected/${selectedExperiment._id}`
        );

        let newLabel;

        // Update label of Modal to running if running status
        if (currentlySelectedExperiment.status === Status.RUNNING) {
          newLabel = "Currently Running";
        }
        // Update label of Modal to be finished if failed or success
        else if (
          currentlySelectedExperiment.status === Status.FAILED ||
          currentlySelectedExperiment.status === Status.SUCCESS
        ) {
          newLabel = "Finished";
        }
        // Update label of Modal based on position in queue since in waiting status
        else {
          newLabel =
            queue.findIndex(
              (experiment) => experiment._id === selectedExperiment._id
            ) !== -1
              ? queue.findIndex(
                  (experiment) => experiment._id === selectedExperiment._id
                )
              : selectedExperiment.label;
        }
        setSelectedExperiment({
          ...currentlySelectedExperiment,
          label: newLabel,
        });

        return currentlySelectedExperiment;
      }
    },
    refetchInterval: 1000,
    // only start fetch if there is a selectedExperiment
    enabled: Boolean(selectedExperiment),
  });

  // Gets queue index of the selected experiment in Modal
  const queueIndex = selectedExperiment
    ? queue?.findIndex(
        (queueExperiment) => selectedExperiment._id === queueExperiment._id
      )
    : null;

  const queueLength = queue?.length - 1;

  return (
    <>
      <Helmet>
        <title>Queue - AlgoGauge - WSU</title>
      </Helmet>
      {selectedExperiment ? (
        <ExperimentModal
          label={selectedExperiment.label}
          showModal={showModal}
          experiment={selectedExperiment}
          onHide={() => {
            setShowModal(false);
            setSelectedExperiment(null);
          }}
          queueIndex={queueIndex}
          queueLength={queueLength}
        />
      ) : null}

      <div className="d-flex justify-content-center border-bottom border-4 border-secondary mb-4 pb-1">
        <Icon
          icon="fluent:people-queue-20-filled"
          color="#492365"
          width="32"
          height="32"
        />
        <h1 className="fs-3 ms-2">
          Queue{" "}
          {queue ? (
            <span
              className={`${queue.length > 0 ? "text-danger" : "text-success"}`}
            >
              {`(${queue.length})`}
            </span>
          ) : null}
        </h1>
      </div>
      <div className="bg-secondary d-flex flex-column rounded-4 p-4 shadow-lg">
        {queueIsLoading ? (
          <div className="d-flex flex-column align-self-center justify-content-center align-items-center bg-light p-2 shadow">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div>Fetching Queue...</div>
          </div>
        ) : queueIsError ? (
          <div className="d-flex flex-column justify-content-center align-self-center align-items-center bg-light p-2 shadow">
            <div className="text-danger">
              <Icon
                width={32}
                height={32}
                icon="material-symbols:error"
                color="red"
              />
              Error fetching queue! Reason:{" "}
              {queueError.response
                ? queueError.response.data.message
                : queueError.message}
            </div>
          </div>
        ) : queue?.length ? (
          <>
            <table className="table history table-bordered text-center align-middle table-hover shadow table-responsive">
              <thead className="text-center table-primary align-middle">
                <tr className="bg-secondary">
                  <th scope="col">Position</th>
                  <th scope="col">Date Submitted</th>
                  <th scope="col">Experiment Description</th>
                </tr>
              </thead>
              <tbody className="attributes-table-font-size table-info">
                {queue.map((experiment, index) => (
                  <tr
                    key={experiment._id}
                    onClick={() => {
                      setShowModal(true);
                      setSelectedExperiment({
                        ...experiment,
                        label:
                          experiment.status === Status.RUNNING
                            ? "Currently Running"
                            : index,
                      });
                    }}
                  >
                    {experiment.status === Status.RUNNING ? (
                      <td
                        className={`text-warning ${
                          !isLoadingUser &&
                          !isErrorUser &&
                          !isLoadingUser &&
                          !isErrorUser &&
                          userExperimentsRunning.find(
                            (userExperimentRunning) =>
                              experiment._id === userExperimentRunning
                          )
                            ? "table-active"
                            : ""
                        }`}
                      >
                        Currently Running
                      </td>
                    ) : (
                      <td
                        className={`${
                          !isLoadingUser &&
                          !isErrorUser &&
                          userExperimentsRunning.find(
                            (userExperimentRunning) =>
                              experiment._id === userExperimentRunning
                          )
                            ? "table-active"
                            : ""
                        }`}
                      >
                        {index}
                      </td>
                    )}

                    <td>{new Date(experiment.createdAt).toLocaleString()}</td>
                    <td>{dotDotTextInputExperiment(experiment.input, 50)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className="align-self-center bg-light p-2 shadow">
            <div>Queue is currently empty.</div>
          </div>
        )}
      </div>
    </>
  );
};

export default Queue;
