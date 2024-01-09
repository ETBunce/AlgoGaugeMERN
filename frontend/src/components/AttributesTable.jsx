import { Mode, SortingAlgorithms } from "../utils/constants";
import { superScriptExponent } from "../utils/helperFunctions";


// Description: Info table showing the differences between certain algorithms (depending on mode)
// Also highlights the selected algorithm user selected on the experiment card
// @selectType: Referring to the dropdown name user selected for the specific experiment card
// @mode: Mode user currently is in to do some conditional rendering
const AttributesTable = ({ selectType, mode }) => {
  return (
    <div className={`table-responsive shadow mb-3`}>
      <table className="table table-bordered text-center align-middle">
        <thead className="text-center table-secondary align-middle">
          {mode === Mode.SORTING ? (
            <>
              <tr className="bg-secondary">
                <th scope="col" rowSpan={2}>
                  Name
                </th>
                <th scope="col" colSpan={3}>
                  Time Complexity
                </th>
                <th scope="col" colSpan={2}>
                  Space Complexity
                </th>
                <th scope="col" colSpan={6}>
                  Other
                </th>
              </tr>
              <tr className="bg-secondary">
                <th scope="col">Best Case</th>
                <th scope="col">Average Case</th>
                <th scope="col">Worst Case</th>
                <th scope="col">Average Case</th>
                <th scope="col">Worst Case</th>
                <th scope="col">Stable</th>
                <th scope="col">Optimizes Repeated Values</th>
                <th scope="col">Cache Friendly</th>
                <th scope="col">Speculative Execution Friendly</th>
                <th scope="col">Optimizes Ordered Runs</th>
                <th scope="col">Parallel Options</th>
              </tr>
            </>
          ) : null}
        </thead>
        <tbody className="table-primary attributes-table-font-size">
          {mode === Mode.SORTING ? (
            <>
              {Object.keys(SortingAlgorithms).map((key) => (
                <tr
                  key={key}
                  className={`${key === selectType ? "table-active" : ""}`}
                >
                  <td>{key}</td>
                  <td>
                    {superScriptExponent(
                      SortingAlgorithms[key].bigThetaForBestCase
                    )}
                  </td>
                  <td>
                    {superScriptExponent(
                      SortingAlgorithms[key].bigThetaForAverageCase
                    )}
                  </td>
                  <td>
                    {superScriptExponent(
                      SortingAlgorithms[key].bigThetaForWorstCase
                    )}
                  </td>
                  <td>
                    {superScriptExponent(SortingAlgorithms[key].memoryAverage)}
                  </td>
                  <td>
                    {superScriptExponent(SortingAlgorithms[key].memoryWorst)}
                  </td>
                  <td>{SortingAlgorithms[key].isStable}</td>
                  <td>{SortingAlgorithms[key].optimizesRepeatedValues}</td>
                  <td>{SortingAlgorithms[key].cacheFriendly}</td>
                  <td>{SortingAlgorithms[key].speculativeExecutionFriendly}</td>
                  <td>{SortingAlgorithms[key].optimizesOrderedRuns}</td>
                  <td>{SortingAlgorithms[key].hasParallelOptions}</td>
                </tr>
              ))}
            </>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

export default AttributesTable;
