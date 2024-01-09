import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState } from "react";
import Select from "react-select";
import Modal from "../components/Modal";
import {
  DataOrderings,
  HashingAlgorithms,
  HashingAlgorithmsKeys,
  Mode,
  SortingAlgorithms,
  SortingAlgorithmsKeys,
} from "../utils/constants";
import AttributesTable from "./AttributesTable";
import InputSlider from "./InputSlider";

// Description: Card to show and allow the different options user can select as input and also get info about each algorithm. The particular
// card state comes from the parent Experiment component.
// @mode: Mode user currently is in to do some conditional rendering
// @number: Number used to distinguish cards in order to change the proper card in the array
// @selectType: Referring to the dropdown name user selected for the specific experiment card
// @dataOrdering: Referring to the radio button user selected for the specific experiment card
// @inputSize: Referring to the number input box user selected for the specific experiment card
// @inputSizeIndex: Referring to the slider index number user selected for the specific experiment card
// @onChangeDataOrdering: Function used to change the dataOrdering (radio buttons) for the specific experiment card
// @onChangeSelectType: Function used to change the selectType (dropdown) for the specific experiment card
// @onChangeInputSize: Function used to change the inputSize (number input box) for the specific experiment card
// @onChangeInputSizeIndex: Function used to change the inputSizeIndex (slider) for the specific experiment card
const ExperimentCard = ({
  mode,
  number,
  selectType,
  dataOrdering,
  inputSize,
  inputSizeIndex,
  onChangeDataOrdering,
  onChangeSelectType,
  onChangeInputSize,
  onChangeInputSizeIndex,
}) => {
  const [showSelectTypeDetailsModal, setShowSelectTypeDetailsModal] =
    useState(false);

  // states for showing and setting each category in the Modal
  const [showExplanation, setShowExplanation] = useState(true);
  const [showAttributes, setShowAttributes] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showInterestingFacts, setShowInterestingFacts] = useState(false);

  return (
    <div className="card flex-fill-card shadow border-0 rounded-4 d-flex flex-column justify-content-between">
      {/* Title */}
      <h5 className="card-header d-flex justify-content-center rounded-top-4 bg-primary text-light text-center py-3 fw-bold fs-3">
        <span className="me-2">
          {selectType} #{number + 1}
        </span>
      </h5>
      {/* Modal showing more info about algorithm when blue link clicked */}
      <Modal
        showModal={showSelectTypeDetailsModal}
        onHide={() => {
          setShowSelectTypeDetailsModal(false);
          setShowExplanation(true);
          setShowAttributes(false);
          setShowCode(false);
          setShowInterestingFacts(false);
        }}
        title={
          mode === Mode.SORTING ? (
            <>{selectType} Sort</>
          ) : mode === Mode.HASHING ? (
            <>{selectType} Hashing Algorithm</>
          ) : (
            <>{selectType} Data Structure</>
          )
        }
      >
        <div className="d-flex flex-column mb-3">
          <h2
            onClick={() => setShowExplanation(!showExplanation)}
            style={{ cursor: "pointer" }}
            className="fw-bold text-decoration-underline d-flex justify-content-between p-2 shadow"
          >
            <span>
              What is {selectType}{" "}
              {mode === Mode.SORTING
                ? "Sort"
                : mode === Mode.HASHING
                ? "Hashing Algorithm"
                : "Data Structure"}
              ?
            </span>
            <motion.div animate={{ rotate: showExplanation ? 180 : 0 }}>
              <Icon icon="ep:arrow-down-bold" color="#492365" />
            </motion.div>
          </h2>
          <div
            className={`d-flex flex-column bg-primary px-md-5 shadow dropdown ${
              showExplanation ? "active p-4 " : ""
            }`}
          >
            {mode === Mode.SORTING ? (
              <>
                <ul className="text-light fw-bold fs-5">
                  {SortingAlgorithms[selectType].explanation
                    .split("\n")
                    .map((string, index) => (
                      <li
                        key={`${selectType}-explanation-${index + 1}`}
                        className="mb-2"
                      >
                        {string}
                      </li>
                    ))}
                </ul>

                <div className="d-flex flex-column flex-lg-row px-3">
                  <div className="d-flex flex-column flex-fill justify-content-center align-items-center me-2">
                    <img
                      className="visuals-modal mb-3 m-lg-0"
                      src={SortingAlgorithms[selectType].img}
                      alt={selectType}
                    />
                    <div className="text-white fs-7">
                      Source: {SortingAlgorithms[selectType].attribution}
                    </div>
                  </div>
                  <div className="flex-fill">
                    <video className="w-100 align-self-start" controls>
                      <source
                        src={SortingAlgorithms[selectType].video}
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>
              </>
            ) : mode === Mode.HASHING ? (
              <ul className="text-light fw-bold fs-5">
                {HashingAlgorithms[selectType].explanation
                  .split("\n")
                  .map((string, index) => (
                    <li
                      key={`${selectType}-explanation-${index + 1}`}
                      className="mb-2"
                    >
                      {string}
                    </li>
                  ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="d-flex flex-column">
          <h2
            onClick={() => setShowCode(!showCode)}
            style={{ cursor: "pointer" }}
            className="fw-bold text-decoration-underline d-flex justify-content-between p-2 shadow"
          >
            <span>Code</span>
            <motion.div animate={{ rotate: showCode ? 180 : 0 }}>
              <Icon icon="ep:arrow-down-bold" color="#492365" />
            </motion.div>
          </h2>
          <div
            className={`bg-secondary fw-bold shadow dropdown ${
              showCode ? "active p-4 " : ""
            }`}
          >
            <pre>
              <code>
                {mode === Mode.SORTING
                  ? SortingAlgorithms[selectType].code
                  : // : mode === Mode.HASHING
                    // ? HashingAlgorithms[selectType].code
                    null}
              </code>
            </pre>
          </div>
        </div>
        {mode === Mode.SORTING ? (
          <div className="d-flex flex-column mt-3">
            <h2
              onClick={() => setShowAttributes(!showAttributes)}
              style={{ cursor: "pointer" }}
              className="fw-bold text-decoration-underline d-flex justify-content-between shadow p-2"
            >
              <span>Attributes</span>
              <motion.div animate={{ rotate: showAttributes ? 180 : 0 }}>
                <Icon icon="ep:arrow-down-bold" color="#492365" />
              </motion.div>
            </h2>
            <div
              className={`bg-secondary shadow dropdown ${
                showAttributes ? "active p-4" : ""
              }`}
            >
              <AttributesTable mode={mode} selectType={selectType} />
              {mode === Mode.SORTING ? (
                <p className={`p-4 shadow bg-light`}>
                  *Note: This chart uses big Ω, big O and big Θ through a two
                  part process. The first part is the desired knowledge (e.g.
                  best, average, worst), then the second part is what asymptotic
                  bounds exist for that knowledge. For example, suppose best
                  case performance with Insertion Sort. We know if given a fully
                  sorted list, the analysis gives a lower bound Ω(n) and an
                  upper bound O(n), and thus Θ(n) for best case runs. This note
                  is given because some other authors refer to best case always
                  as big Ω and worst case always as big O.
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="d-flex flex-column mt-3">
          <h2
            onClick={() => setShowInterestingFacts(!showInterestingFacts)}
            style={{ cursor: "pointer" }}
            className="fw-bold text-decoration-underline d-flex justify-content-between shadow p-2"
          >
            {mode === Mode.HASHING ? (
              <span>Notable Traits</span>
            ) : Mode.SORTING ? (
              <span>Interesting Facts</span>
            ) : null}
            <motion.div animate={{ rotate: showInterestingFacts ? 180 : 0 }}>
              <Icon icon="ep:arrow-down-bold" color="#492365" />
            </motion.div>
          </h2>
          <ul
            className={`flex-column text-light ps-0 dropdown ${
              showInterestingFacts ? "active" : ""
            }`}
          >
            {mode === Mode.SORTING
              ? SortingAlgorithms[selectType].interestingFacts.map(
                  (fact, index) => (
                    <li
                      key={`${selectType}-fact-${index + 1}`}
                      className="p-3 bg-primary shadow mb-2 d-flex align-items-center"
                    >
                      <span className="pe-3 fs-3">•</span>
                      {fact}
                    </li>
                  )
                )
              : mode === Mode.HASHING
              ? HashingAlgorithms[selectType].notableTraits.map(
                  (fact, index) => (
                    <li
                      key={`${selectType}-fact-${index + 1}`}
                      className="p-3 bg-primary shadow mb-2 d-flex align-items-center"
                    >
                      <span className="pe-3 fs-3">•</span>
                      {fact}
                    </li>
                  )
                )
              : null}
          </ul>
        </div>
      </Modal>
      <div className="card-body text-primary d-flex flex-column justify-content-between">
        <div className="d-flex flex-column">
          {selectType ? (
            <div className="d-flex flex-column flex-lg-row justify-content-between">
              <div className="fw-bold">
                {mode === Mode.SORTING ? (
                  <>Sorting Algorithm</>
                ) : mode === Mode.HASHING ? (
                  <>Hashing Algorithm</>
                ) : (
                  <>Data Structure</>
                )}
              </div>
              <div
                className="more-info"
                onClick={() => setShowSelectTypeDetailsModal(true)}
              >
                Learn more about {selectType}
              </div>
            </div>
          ) : (
            <div className="fw-bold">
              {mode === Mode.SORTING ? (
                <>Sorting Algorithm</>
              ) : mode === Mode.HASHING ? (
                <>Hashing Algorithm</>
              ) : (
                <>Data Structure</>
              )}
            </div>
          )}

          {/* ALGORITHM DROP DOWN */}
          <Select
            required
            value={{ label: selectType, value: selectType }}
            name={`select-type-${number}`}
            onChange={onChangeSelectType}
            placeholder={
              mode === Mode.SORTING
                ? "Select Sorting Algorithm"
                : mode === Mode.HASHING
                ? "Select Hashing Algorithm"
                : "Select Data Structure"
            }
            options={Object.values(
              mode === Mode.SORTING
                ? SortingAlgorithmsKeys
                : HashingAlgorithmsKeys
            ).map((value) => ({
              label: value,
              value,
            }))}
            styles={{
              control: (styles, { isFocused }) => ({
                ...styles,
                backgroundColor: "#cccac7",
                color: "#492365",
                borderRadius: "0.5rem",
                "&:hover": { borderColor: "#8f29db" },
                borderColor: isFocused ? "#8f29db" : "#cccac7",
                boxShadow: isFocused
                  ? "0 0 0 0.25rem rgba(103, 2, 123, 0.263)"
                  : "none",
              }),
              dropdownIndicator: (styles) => ({
                ...styles,
                color: "#492365",
                "&:hover": { color: "#492365" },
              }),
              option: (styles, { isSelected }) => ({
                ...styles,
                backgroundColor: isSelected ? "#492365" : "#cccac7",

                "&:hover": { backgroundColor: "#492365", color: "#fff" },
              }),
              singleValue: (styles) => ({ ...styles, color: "#492365" }),
              menu: (styles) => ({
                ...styles,
                marginTop: 0,
                backgroundColor: "#cccac7",
              }),
              indicatorSeparator: (styles) => ({
                ...styles,
                backgroundColor: "#cccac7",
              }),
            }}
          />
        </div>
        <div className="d-flex flex-column">
          <div className="fw-bold">Data Ordering</div>
          {Object.entries(DataOrderings).map(([key, value], index) => (
            <div className="form-check" key={key}>
              <input
                required
                name={`data-ordering-radio-${number}`}
                className="form-check-input shadow bg-primary border-primary"
                type="radio"
                id={`${key}-${number}`}
                value={value}
                checked={dataOrdering === value}
                onChange={onChangeDataOrdering}
              />
              <label className="form-check-label" htmlFor={`${key}-${number}`}>
                {value}
              </label>
            </div>
          ))}
        </div>
        <InputSlider
          selectType={selectType}
          mode={mode}
          number={number}
          inputSize={inputSize}
          inputSizeIndex={inputSizeIndex}
          onChangeInputSize={onChangeInputSize}
          onChangeInputSizeIndex={onChangeInputSizeIndex}
        />
      </div>
    </div>
  );
};

export default ExperimentCard;
