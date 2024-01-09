import { Mode, SortingAlgorithms } from "../utils/constants";

// Description: Contains slider and number input box used to change the inputSizeIndex and inputSize
// for a particular experiment card passed down from ExperimentCard.
// @inputSize: Referring to the number input box user selected for the specific experiment card
// @selectType: Referring to the dropdown name user selected for the specific experiment card, used to map the name to the track
// @inputSizeIndex: Referring to the slider index number user selected for the specific experiment card
// @number: Number used to distinguish cards in order to change the proper card in the array
// @onChangeInputSize: Function used to change the inputSize (number input box) for the specific experiment card
// @onChangeInputSizeIndex: Function used to change the inputSizeIndex (slider) for the specific experiment card
const InputSlider = ({
  inputSize,
  mode,
  selectType,
  inputSizeIndex,
  number,
  onChangeInputSize,
  onChangeInputSizeIndex,
}) => {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });

  return (
    <div className="d-flex flex-column text-center">
      <div className="">
        <input
          required
          name={`input-number-${number}`}
          id={`input-number-${number}`}
          value={inputSize}
          min={
            mode === Mode.SORTING
              ? SortingAlgorithms[selectType].inputSizeTrack[0]
              : 0
          }
          max={
            mode === Mode.SORTING
              ? SortingAlgorithms[selectType].inputSizeTrack[10]
              : 0
          }
          onChange={onChangeInputSize}
          type="number"
          className="border border-3 border-primary p-1 text-center fs-5"
        />
      </div>
      <div className="my-2">
        <input
          required
          value={inputSizeIndex}
          className="slider"
          name={`input-slider-${number}`}
          onChange={onChangeInputSizeIndex}
          type="range"
          min={0}
          max={10}
        />
        <div className="slider-ticks mt-2">
          {mode === Mode.SORTING
            ? SortingAlgorithms[selectType].inputSizeTrack.map(
                (trackNumber, key) => (
                  <div key={key}>{formatter.format(trackNumber)}</div>
                )
              )
            : null}
        </div>
      </div>
      <div className="">
        <label
          htmlFor={`input-number-${number}`}
          className="shadow-sm p-2 fw-bold"
        >
          Input Size
        </label>
      </div>
    </div>
  );
};

export default InputSlider;
