import { Icon } from "@iconify/react";
import axios from "axios";
import { Fragment, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";
import ExperimentCard from "../components/ExperimentCard";
import {
  DataOrderings,
  HashingAlgorithmsKeys,
  Mode,
  SortingAlgorithms,
  SortingAlgorithmsKeys,
} from "../utils/constants";

// Description: Page for submitting an experiment. Contains functions responsible for changing state of cards and mode
// @mode: Mode user currently is in to do some conditional rendering
// @setMode: Function for setting the mode, used as a Select dropdown
// @experiments: Array of experiment objects to render the cards on the page. Passed down from App component.
// @setExperiments: Function for setting the array  of experiment objects to render the cards on the page. Passed down from App component.
// @setBraddys: Function for setting the Braddy side menus. Called when submitting successful experiment. Passed down from App component.
// TODO: Still need to implement Hashing, Data Structures, and most importantly Brad Mode

const Experiment = ({ mode, setMode, cards, setCards, setBraddys }) => {
  // used for disabling button to prevent button spam
  const [experimentSubmit, setExperimentSubmit] = useState(false);

  // Adds additional card at the end of the experiments array. Copies the card at the end. Minimum of 1 card and maximum of 10 cards.
  const AddCard = () => {
    if ((mode === Mode.SORTING || mode === Mode.HASHING) && cards.length < 10) {
      setCards([
        ...cards,
        {
          ...cards[cards.length - 1],
          id: uuidv4(),
        },
      ]);
    } else {
      toast.error("Can not add more than 10 cards.", {
        id: "failed-add-card-limit",
      });
    }
  };

  // Removes card from experiments array.
  const RemoveCard = () => {
    if (cards.length > 1) {
      const newCards = cards.slice(0, -1);
      setCards(newCards);
    } else {
      toast.error("Must have at least 1 card.", {
        id: "failed-remove-card-limit",
      });
    }
  };

  // Resets cards to initial state depending on mode. Default is 2 cards.
  const ResetCards = () => {
    if (mode === Mode.BRAD) {
    } else if (mode === Mode.DATA_STRUCTURES) {
    } else if (mode === Mode.HASHING) {
      setCards([
        {
          id: uuidv4(),
          selectType: HashingAlgorithmsKeys.CLOSED,
          dataOrdering: DataOrderings.RANDOM,
          inputSize: 0,
          inputSizeIndex: 0,
        },
        {
          id: uuidv4(),
          selectType: HashingAlgorithmsKeys.CLOSED,
          dataOrdering: DataOrderings.RANDOM,
          inputSize: 0,
          inputSizeIndex: 0,
        },
      ]);
      toast.success("Cards have been reset.", { id: "success-reset-cards" });
    } else {
      setCards([
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
      toast.success("Cards have been reset.", { id: "success-reset-cards" });
    }
  };

  // Changes mode and cards back to default depending on what the mode using the React Select dropdown
  const onChangeMode = (object, action) => {
    // Value contains name of new mode to use
    const { value } = object;

    if (value === Mode.BRAD || value === Mode.DATA_STRUCTURES) {
      setCards([]);
    } else if (value === Mode.HASHING) {
      setCards([
        {
          id: uuidv4(),
          selectType: HashingAlgorithmsKeys.CLOSED,
          dataOrdering: DataOrderings.RANDOM,
          inputSize: 0,
          inputSizeIndex: 0,
        },
        {
          id: uuidv4(),
          selectType: HashingAlgorithmsKeys.CLOSED,
          dataOrdering: DataOrderings.RANDOM,
          inputSize: 0,
          inputSizeIndex: 0,
        },
      ]);
    } else {
      setCards([
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
    }

    setMode(value);
  };

  // Function called when user selects a different algorithm (dropdown) for a particular card which updates the state for that card.
  const onChangeSelectType = (object, action) => {
    // Value is name of new algorithm selected
    const { value } = object;

    // Name contains the input and number to know which element in experiments array to update
    const { name } = action;

    // Shallow copy cards
    const newCards = [...cards];

    // Regex for finding number of card which returns an array of matches
    const matches = name.match(/(\d+)/);

    // Get first match
    const index = Number(matches[0]);

    // update the newCards array at the index with new algorithm name and also make sure to map correct inputSize track based on name and mode
    newCards[index] = {
      ...newCards[index],
      selectType: value,
      inputSize:
        mode === Mode.SORTING
          ? SortingAlgorithms[value].inputSizeTrack[
              newCards[index].inputSizeIndex
            ]
          : 0,
    };

    // update the cards state
    setCards(newCards);
  };

  // Function called when user selects a different data ordering (radio button) for a particular card which updates the state for that card.
  const onChangeDataOrdering = (e) => {
    // Extract new dataOrdering and name (contains number of card)
    const { value, name } = e.target;

    // Shallow copy cards
    const newCards = [...cards];

    // Regex for finding number of card which returns an array of matches
    const matches = name.match(/(\d+)/);

    // Get first match
    const index = Number(matches[0]);

    // Update dataOrdering of the card at the index
    newCards[index] = { ...newCards[index], dataOrdering: value };

    // update cards state
    setCards(newCards);
  };

  // Function called when user selects a different inputSize (number input box) for a particular card which updates the state for that card.
  const onChangeInputSize = (e) => {
    // Extract new inputSize and name (contains number of card)
    let { value, name } = e.target;

    // Shallow copy cards
    const newCards = [...cards];

    // Regex for finding number of card which returns an array of matches
    const matches = name.match(/(\d+)/);

    // Get first match
    const index = Number(matches[0]);

    // Get inputSizeTrack based on the name of card and mode
    const inputSizeTrack =
      mode === Mode.SORTING
        ? SortingAlgorithms[newCards[index].selectType].inputSizeTrack
        : null;

    // Declare new index of track
    let newIndex = 0;

    // Calculate difference between new inputSize value and first value on track
    let difference = inputSizeTrack
      ? Math.abs(value - inputSizeTrack[0])
      : value;

    // If track exists, loop through track starting at first index and find smallest difference
    if (inputSizeTrack) {
      for (let i = 1; i < inputSizeTrack.length; ++i) {
        if (Math.abs(value - inputSizeTrack[i]) < difference) {
          difference = Math.abs(value - inputSizeTrack[i]);
          newIndex = i;
        }
      }
    }

    // Update inputSize (number input box) and inputSizeIndex (slider) for that particular card
    newCards[index] = {
      ...newCards[index],
      inputSize: value,
      inputSizeIndex: newIndex,
    };
    setCards(newCards);
  };

  const onChangeInputSizeIndex = (e) => {
    // Extract new inputSizeIndex and name (contains number of card)
    let { value, name } = e.target;

    // Shallow copy cards
    const newCards = [...cards];

    // Regex for finding number of card which returns an array of matches
    const matches = name.match(/(\d+)/);

    // Get first match
    const index = Number(matches[0]);

    // Get inputSizeTrack based on the name of card and mode
    const inputSizeTrack =
      mode === Mode.SORTING
        ? SortingAlgorithms[newCards[index].selectType].inputSizeTrack
        : null;

    // Update inputSize and inputSizeIndex of the card at the index
    newCards[index] = {
      ...newCards[index],
      inputSize: inputSizeTrack ? inputSizeTrack[value] : null,
      inputSizeIndex: value,
    };

    setCards(newCards);
  };

  // Function responsible for submitting experiment to server. Only gets the created experiment back if successful, not the result.
  const FormSubmitHandler = async (e) => {
    e.preventDefault();

    // Only SORTING mode works so don't submit form if anything else
    if (mode !== Mode.SORTING) {
      return;
    }

    // Disables submit button
    setExperimentSubmit(true);

    // map through cards to generate array of filtered cards to be sent as body in POST request
    const body = cards.map((card) => ({
      name: card.selectType,
      dataOrdering: card.dataOrdering,
      inputSize: card.inputSize,
    }));

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/experiment/submit`,
        body
      );

      // add new braddy to end of braddys array if experiment successfully created
      setBraddys((prev) => [...prev, data.result]);
    } catch (error) {
      // if server response, display the server response error message
      if (error.response) {
        toast.error(
          `Failed to submit experiment info. Reason: ${error.response.data.message}`,
          { id: "failed-submit-server-side" }
        );
      } else {
        // if something wrong with sending request, display the error message
        toast.error(
          `Failed to submit experiment info. Reason: ${error.message}`,
          { id: "failed-submit-request" }
        );
      }
    }

    // disable button for 1.5 seconds before submitting another experiment
    setTimeout(() => {
      setExperimentSubmit(false);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Experiment - AlgoGauge - WSU</title>
      </Helmet>
      <div className="d-flex justify-content-center border-bottom border-4 border-secondary pb-1">
        <Icon
          icon="icon-park-solid:experiment"
          color="#492365"
          width="32"
          height="32"
        />
        <h1 className="fs-3 ms-2">Experiment</h1>
      </div>
      <div className="d-flex flex-column my-2">
        <div className="text-center fw-bold">Mode</div>
        <Select
          className="mx-auto"
          required
          value={{ label: mode, value: mode }}
          name={`mode`}
          onChange={onChangeMode}
          placeholder={"Select Mode"}
          options={Object.values(Mode).map((value) => ({
            label: value,
            value,
          }))}
          styles={{
            control: (styles, { isFocused }) => ({
              ...styles,
              backgroundColor: "#fff",
              color: "#492365",
              borderRadius: "0.5rem",
              "&:hover": { borderColor: "#8f29db" },
              borderColor: isFocused ? "#8f29db" : "#73379f",
              boxShadow: isFocused
                ? "0 0 0 0.25rem rgba(103, 2, 123, 0.263)"
                : "rgba(0, 0, 0, 0.15) 0px 8px 16px 0px",
            }),
            dropdownIndicator: (styles) => ({
              ...styles,
              color: "#492365",
              "&:hover": { color: "#492365" },
            }),
            option: (styles, { isSelected }) => ({
              ...styles,
              backgroundColor: isSelected ? "#492365" : "#fff",

              "&:hover": { backgroundColor: "#492365", color: "#fff" },
            }),
            singleValue: (styles) => ({ ...styles, color: "#492365" }),
            menu: (styles) => ({
              ...styles,
              marginTop: 0,
              backgroundColor: "#fff",
              boxShadow: "rgba(0, 0, 0, 0.15) 0px 8px 16px 0px",
            }),
            indicatorSeparator: (styles) => ({
              ...styles,
              backgroundColor: "#73379f",
            }),
          }}
        />
      </div>

      <form
        onSubmit={FormSubmitHandler}
        className="bg-secondary d-flex flex-column rounded-4 p-4 shadow"
      >
        {mode === Mode.HASHING || mode === Mode.SORTING ? (
          <>
            <div className="d-flex flex-column flex-md-row overflow-x-auto">
              {cards.map((card, i) => (
                <Fragment key={card.id}>
                  <ExperimentCard
                    number={i}
                    selectType={card.selectType}
                    dataOrdering={card.dataOrdering}
                    inputSize={card.inputSize}
                    inputSizeIndex={card.inputSizeIndex}
                    mode={mode}
                    onChangeSelectType={onChangeSelectType}
                    onChangeDataOrdering={onChangeDataOrdering}
                    onChangeInputSize={onChangeInputSize}
                    onChangeInputSizeIndex={onChangeInputSizeIndex}
                  />
                  {cards.length > 1 && i + 1 <= cards.length - 1 ? (
                    <h2 className="text-active-purple text-decoration-underline m-3 align-self-center">
                      VS
                    </h2>
                  ) : null}{" "}
                </Fragment>
              ))}
            </div>
            <div className="d-flex justify-content-center my-3">
              <button
                type="submit"
                className="btn btn-primary shadow fs-5"
                disabled={experimentSubmit}
              >
                {experimentSubmit
                  ? "Sending Experiment Info..."
                  : "Run Experiment"}
              </button>
            </div>
            <div className="d-flex flex-column flex-md-row">
              <div className="d-flex flex-column flex-md-row">
                <button
                  type="button"
                  className="btn btn-danger me-md-2 shadow d-flex align-items-center"
                  onClick={RemoveCard}
                >
                  {" "}
                  <Icon icon="zondicons:minus-solid" height={16} width={16} />
                  Remove Card
                </button>
                <button
                  type="button"
                  className="btn btn-success my-2 my-md-0 shadow d-flex align-items-center"
                  onClick={AddCard}
                >
                  {" "}
                  <Icon icon="zondicons:add-solid" />
                  Add Card
                </button>
              </div>
              <div className="d-flex ms-md-auto">
                <button
                  type="button"
                  onClick={ResetCards}
                  className="btn btn-secondary shadow d-flex align-items-center w-100"
                >
                  <Icon icon="bx:reset" />
                  Reset Cards
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="align-items-center mx-auto bg-light p-2 shadow text-warning d-flex">
            <Icon icon="maki:construction" />
            <div>Under Construction...</div>
          </div>
        )}
      </form>
    </>
  );
};

export default Experiment;
