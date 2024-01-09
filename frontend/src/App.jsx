import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import "./App.css";

import { Route, Routes } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import BraddyContainer from "react-bootstrap/esm/ToastContainer";
import Braddy from "./components/Braddy";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Error from "./pages/Error";
import Experiment from "./pages/Experiment";
import History from "./pages/History";
import Queue from "./pages/Queue";
import EasterEgg from "./pages/Easter-Egg";
import {
  DataOrderings,
  Mode,
  SortingAlgorithms,
  SortingAlgorithmsKeys,
} from "./utils/constants";

// send cookies every request (need for sessions to work)
axios.defaults.withCredentials = true;

const basename = process.env.PUBLIC_URL;

// Description: App component contains the Routes, Braddys, Queue, and ExperimentInterval (used for getting the status of a user's oldest experiment)
// The main content is using a bootstrap container to nicely give the primary content some predefined margins.
const App = () => {
  const [braddys, setBraddys] = useState([]);

  // Gets queue from mongoDB to be passed into Braddy, Navbar, and Queue in order to know queue position and length every second
  const queueResult = useQuery({
    queryKey: ["experiment-queue"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/experiment/queue`
      );
      return data;
    },

    refetchInterval: 1000,
  });

  // Fetch braddys from user's session
  useEffect(() => {
    const FetchBraddys = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/experiment/braddys`
        );

        // 204 indicating No Content or Braddys
        if (response.status === 204) {
          console.log("No braddys");
          return;
        }
        setBraddys(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    FetchBraddys();
  }, []);

  // Gets a user's oldest experiment and keeps checking the status every second which is then used to update the braddys
  useEffect(() => {
    const experimentResultInterval = setInterval(async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/experiment/status`
        );
        if (response.status === 200) {
          setBraddys((prev) =>
            prev.map((braddyExperiment) =>
              braddyExperiment._id === response.data.result._id
                ? response.data.result
                : braddyExperiment
            )
          );
          console.log(response.data.result);
        } else {
          console.log("No experiment running.");
        }
      } catch (error) {
        if (error.response) {
          console.log(error.response.data.message);
          setBraddys((prev) =>
            prev.map((braddyExperiment) =>
              braddyExperiment._id === error.response.data.result._id
                ? error.response.data.result
                : braddyExperiment
            )
          );
        } else {
          console.log(error.message);
        }
      }
    }, 1000);

    return () => {
      clearInterval(experimentResultInterval);
    };
  }, []);

  // Mode the experiment page is currently on (ex. Sorting, Data Structures, etc...)
  const [mode, setMode] = useState(Mode.SORTING);

  // Cards (input) which are passed to the experiment page. Both mode and cards are in App component so the state is preserved when
  // user goes to another route.
  const [cards, setCards] = useState([
    {
      id: uuidv4(),
      selectType: SortingAlgorithmsKeys.BUBBLE,
      dataOrdering: DataOrderings.RANDOM,
      inputSize:
        SortingAlgorithms[SortingAlgorithmsKeys.BUBBLE].inputSizeTrack[0],
      inputSizeIndex: 0,
    },
    {
      id: uuidv4(),
      selectType: SortingAlgorithmsKeys.BUBBLE,
      dataOrdering: DataOrderings.RANDOM,
      inputSize:
        SortingAlgorithms[SortingAlgorithmsKeys.BUBBLE].inputSizeTrack[0],
      inputSizeIndex: 0,
    },
  ]);

  return (
    <>
      <BraddyContainer
        className="p-3 pe-0 z-1 position-fixed rounded-0 overflow-scroll"
        position={"top-end"}
      >
        {braddys.map((experiment, index) => (
          <Braddy
            queue={queueResult.data}
            key={experiment._id}
            label={index + 1}
            experiment={experiment}
            setBraddys={setBraddys}
          />
        ))}
      </BraddyContainer>
      <Navbar queueLength={queueResult.data?.length} />
      <main className="container my-3">
        <Routes basename={basename}>
          <Route
            path="/"
            element={
              <Experiment
                cards={cards}
                setCards={setCards}
                mode={mode}
                setMode={setMode}
                setBraddys={setBraddys}
              />
            }
          />
          <Route
            path="/experiment"
            element={
              <Experiment
                cards={cards}
                setCards={setCards}
                mode={mode}
                setMode={setMode}
                setBraddys={setBraddys}
              />
            }
          />
          <Route path="/history" element={<History />} />
          <Route
            path="/queue"
            element={
              <Queue
                queue={queueResult.data}
                queueIsLoading={queueResult.isLoading}
                queueError={queueResult.error}
                queueIsError={queueResult.isError}
              />
            }
          />
          <Route path="*" element={<Error />} />
          <Route path="/easter-egg" element={<EasterEgg />} />
          <Route path="/easteregg" element={<EasterEgg />} />
          <Route path="/easterEgg" element={<EasterEgg />} />
          <Route path="/easter" element={<EasterEgg />} />
          <Route path="/egg" element={<EasterEgg />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
