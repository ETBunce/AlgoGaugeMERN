import { Status } from "../utils/constants";

// Description: Takes in experiment and shows table details for the Modal
// @experiment: The particular mongoDB experiment used to display details
// @queueIndex (optional): Shows where experiment is in the queue 
// @queueLength (optional): Shows how long queue is
const ExperimentTable = ({ experiment, queueIndex, queueLength }) => {
  // Formats numbers or big ints
  const formatter = Intl.NumberFormat("en", { notation: "compact" });

  return (
    <table className="table result table-bordered text-center align-middle shadow">
      <thead className="text-center table-primary align-middle">
        <tr>
          <th rowSpan={2} className="bg-light">
            {experiment.status === Status.SUCCESS ? (
              <span className="text-success">Experiment Successful</span>
            ) : experiment.status === Status.FAILED ? (
              <span className="text-danger">Experiment Failed</span>
            ) : experiment.status === Status.RUNNING ? (
              <span className="text-warning">Experiment Running...</span>
            ) : experiment.status === Status.WAITING &&
              queueIndex &&
              queueLength ? (
              <span className="text-info">
                In Queue : {queueIndex}/{queueLength}
              </span>
            ) : (
              ""
            )}
          </th>
          <th colSpan={experiment.input.length}>Input Name</th>
        </tr>
        <tr>
          {experiment.input.map((algorithm, index) => (
            <td className="" key={index}>
              {algorithm.name} #{index + 1}
            </td>
          ))}
        </tr>
      </thead>
      <tbody className="attributes-table-font-size table-info">
        <tr>
          <td className="col-1 bg-primary text-light border border-light fw-bold fs-4 bg-active-purple">
            Input
          </td>
        </tr>
        {experiment.input.length &&
          // Map through keys of input besides name (inputSize, dataOrdering, etc...)
          Object.keys(experiment.input[0]).map((key) =>
            key === "name" ? null : (
              <tr key={key}>
                <td className="bg-primary text-light border border-light">
                  {key
                    // Split at uppercase letter and make first of each letter uppercase
                    .split(/(?=[A-Z])/)
                    .map(
                      (string) =>
                        `${string.charAt(0).toUpperCase() + string.slice(1)} `
                    )}
                </td>
                {experiment.input.map((element, index) => (
                  <td key={index}>
                    {key === "inputSize"
                      ? element[key].toLocaleString()
                      : element[key]}
                  </td>
                ))}
              </tr>
            )
          )}
        <tr>
          <td className="bg-primary text-light border border-light fw-bold fs-4 bg-active-purple">
            Output
          </td>
        </tr>
        {experiment.status === Status.SUCCESS ? (
          <>
            {experiment.output.length &&
              // Gets keys of output (wallTime, cpuCycles, cpuInstructions, etc...)
              Object.keys(experiment.output[0]).map((key) => (
                <tr key={key}>
                  {" "}
                  <td className="bg-primary text-light border border-light">
                    {key
                      // Split at uppercase letter and make first of each letter uppercase unless it is CPU Instructions or CPU Cycles
                      .split(/(?=[A-Z])/)
                      .map(
                        (string, index) =>
                          `${
                            index === 0 &&
                            (key === "cpuInstructions" || key === "cpuCycles")
                              ? string.slice(0, 3).toUpperCase() +
                                string.slice(3)
                              : string.charAt(0).toUpperCase() + string.slice(1)
                          } `
                      )}

                    {/* If key is wallTime, add ms for milliseconds */}
                    {key === "wallTime" ? "(ms)" : null}
                  </td>
                  {experiment.output.map((element, index) => (
                    <td
                      // Adds green text for the smallest number in these particular categories,
                      //red if worst by comparing one input to all the others
                      key={index}
                      className={`${
                        key === "wallTime" ||
                        key === "cpuCycles" ||
                        key === "busCycles" ||
                        key === "cpuInstructions" ||
                        key === "cacheMisses" ||
                        key === "retiredBranchInstructions" ||
                        key === "branchMisses" ||
                        key === "totalPageFaults" ||
                        key === "minorPageFaults" ||
                        key === "majorPageFaults" ||
                        key === "contextSwitches"
                          ? experiment.output.reduce(
                              (prev, curr) =>
                                prev[key] > curr[key] ? curr : prev,
                              experiment.output[0]
                            )[key] === experiment.output[index][key]
                            ? "text-success"
                            : experiment.output.reduce(
                                (prev, curr) =>
                                  prev[key] < curr[key] ? curr : prev,
                                experiment.output[0]
                              )[key] === experiment.output[index][key]
                            ? "text-danger"
                            : ""
                          : // Adds green text for the greatest number in these particular categories,
                          //  red if worst by comparing one input to all the others
                          key === "cacheReferences" ||
                            key === "branchPredictions"
                          ? experiment.output.reduce(
                              (prev, curr) =>
                                prev[key] < curr[key] ? curr : prev,
                              experiment.output[0]
                            )[key] === experiment.output[index][key]
                            ? "text-success"
                            : experiment.output.reduce(
                                (prev, curr) =>
                                  prev[key] > curr[key] ? curr : prev,
                                experiment.output[0]
                              )[key] === experiment.output[index][key]
                            ? "text-danger"
                            : ""
                          : ""
                      }`}
                    >
                      {key === "wallTime"
                        ? element[key].toFixed(1)
                        : formatter.format(element[key])}
                    </td>
                  ))}
                </tr>
              ))}
          </>
        ) : null}
      </tbody>
    </table>
  );
};

export default ExperimentTable;
