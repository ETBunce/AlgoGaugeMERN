import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import ExperimentTable from "../components/ExperimentTable";
import Modal from "../components/Modal";
import { Status } from "../utils/constants";
import { dotDotTextInputExperiment } from "../utils/helperFunctions";
import ExperimentModal from "../components/ExperimentModal";

// Description: Page responsible for showing previous experiments submitted by anyone. Only displays failed and successful experiments.
// Also highlights a user's own experiments by matching the user's experiment ids to all of the experiment ids.
const History = () => {
  // Shows detailed info about experiment in Modal
  const [showModal, setShowModal] = useState(false);

  // The detailed info of an experiment when clicking on a row
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  // Fetches experiments which are either successful or have failed every 3 seconds
  const {
    data: experimentHistory,
    isLoading: experimentHistoryIsLoading,
    isError: experimentHistoryIsError,
    error: experimentHistoryError,
  } = useQuery({
    queryKey: ["experiment-history"],
    queryFn: async () => {
      const { data: experimentHistory } = await axios.get(
        `${process.env.REACT_APP_API}/experiment/history`
      );

      // updates selectedExperiment Modal index since new experiments could be running
      if (selectedExperiment) {
        const newLabel =
          experimentHistory.findIndex(
            (experiment) => experiment._id === selectedExperiment._id
          ) !== -1
            ? experimentHistory.findIndex(
                (experiment) => experiment._id === selectedExperiment._id
              ) + 1
            : selectedExperiment.label;

        setSelectedExperiment((prev) => ({
          ...prev,
          label: newLabel,
        }));
      }

      return experimentHistory;
    },

    refetchInterval: 3000,
  });

  // Fetches user's own experiments which are either successful or have failed
  const {
    data: userHistory,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useQuery({
    queryKey: ["user-experiment-history"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/experiment/userExperimentHistory`
      );

      return data;
    },
  });

  return (
    <>
      <Helmet>
        <title>History - AlgoGauge - WSU</title>
      </Helmet>

      {selectedExperiment ? (
        <ExperimentModal
          label={selectedExperiment.label}
          showModal={showModal}
          experiment={selectedExperiment}
          onHide={() => setShowModal(false)}
        />
      ) : null}

      <div className="d-flex justify-content-center border-bottom border-4 border-secondary mb-4 pb-1">
        <Icon
          icon="material-symbols:history"
          color="#492365"
          width="32"
          height="32"
        />
        <h1 className="fs-3 ms-2">History</h1>
      </div>
      <div className="bg-secondary d-flex flex-column rounded-4 p-4 shadow-lg">
        {experimentHistoryIsLoading ? (
          <div className="d-flex flex-column align-self-center justify-content-center align-items-center bg-light p-2 shadow">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div>Fetching Experiments...</div>
          </div>
        ) : experimentHistoryIsError ? (
          <div className="d-flex flex-column justify-content-center align-self-center align-items-center bg-light p-2 shadow">
            <div className="text-danger">
              <Icon
                width={32}
                height={32}
                icon="material-symbols:error"
                color="red"
              />
              Error fetching experiments! Reason:{" "}
              {experimentHistoryError.response
                ? experimentHistoryError.response.data.message
                : experimentHistoryError.message}
            </div>
          </div>
        ) : experimentHistory.length ? (
          <table className="table history table-bordered text-center align-middle table-hover shadow table-responsive">
            <thead className="text-center table-primary align-middle">
              <tr className="bg-secondary">
                <th scope="col">#</th>
                <th scope="col">Date Submitted</th>
                <th scope="col">Experiment Description</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody className="attributes-table-font-size table-info">
              {experimentHistory.map((experiment, index) => (
                <tr
                  key={experiment._id}
                  onClick={() => {
                    setShowModal(true);
                    setSelectedExperiment({
                      ...experiment,
                      label: index + 1,
                    });
                  }}
                >
                  {!isLoadingUser &&
                  !isErrorUser &&
                  userHistory.find(
                    (userExperiment) => experiment._id === userExperiment
                  ) ? (
                    <td className="table-active"> {index + 1}</td>
                  ) : (
                    <td>{index + 1}</td>
                  )}

                  <td>{new Date(experiment.createdAt).toLocaleString()}</td>
                  <td>{dotDotTextInputExperiment(experiment.input, 50)}</td>
                  <td
                    className={`${
                      experiment.status === Status.FAILED
                        ? "text-danger"
                        : "text-success"
                    }`}
                  >
                    {experiment.status.substring(0, 1).toUpperCase() +
                      experiment.status.substring(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="align-self-center bg-light p-2 shadow">
            <div>History is currently empty.</div>
          </div>
        )}
      </div>
    </>
  );
};

export default History;
