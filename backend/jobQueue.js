import Queue from "./queue.js";
import algoSend, { FailType } from "./algoSend.js";
import Experiment from "./database/models/Experiment.js";
import { Status } from "./utils/constants.js";
import { cleanupExcess } from "./dbCleanup.js";

// A queue of Experiment Mongo Ids
const jobQueue = new Queue();
let running = false;


// runJob
// Gets the experiment from the database and uses algoSend to run the experiment.
const runJob = async (experimentId) => {

  const onAlgoSendSuccess = async (stdout) => {
    // Parse the json and create array of the output
    const output = JSON.parse(stdout).algorithms.map((algorithm) => ({
      wallTime: algorithm.algorithmRunTime_ms,
      cpuCycles: algorithm.perfData["cpu cycles"],
      busCycles: algorithm.perfData["bus cycles"],
      cpuInstructions: algorithm.perfData["cpu instructions"],
      cacheReferences: algorithm.perfData["cache references"],
      cacheMisses: algorithm.perfData["cache misses"],
      branchPredictions: algorithm.perfData["branch predictions"],
      retiredBranchInstructions:
        algorithm.perfData["retired branch instructions"],
      branchMisses: algorithm.perfData["branch misses"],
      totalPageFaults: algorithm.perfData["total page faults"],
      minorPageFaults: algorithm.perfData["minor page faults"],
      majorPageFaults: algorithm.perfData["major page faults"],
      contextSwitches: algorithm.perfData["context switches"],
      L1DataCacheReadAccesses:
        algorithm.perfData["L1 data cache read accesses"],
      L1InstructionCacheReadAccesses:
        algorithm.perfData["L1 instruction cache read accesses"],
      L1DataCachePrefetchAccesses:
        algorithm.perfData["L1 data cache prefetch accesses"],
      L1InstructionCachePrefetchAccesses:
        algorithm.perfData["L1 instruction cache prefetch accesses"],
    }));
    console.log("output:");
    console.log(output);

    // Update experiment with success status and output
    await Experiment.findByIdAndUpdate(experimentId, {
      status: Status.SUCCESS,
      output,
    });
  }

  const onAlgoSendFail = async (failType, error) => {
    // If experiment failType was an stderr type, then update error field to contain the error
    if (failType == FailType.stderr) {
      console.log(error);
      try {
        await Experiment.findByIdAndUpdate(experimentId, {
          status: Status.FAILED,
          error: error,
        });
      } catch (error) {
        console.log(error);
      }
    }
    // If experiment failType was an executable type, then update error field to contain the error message
    else if (failType == FailType.exec) {
      try {
        console.log(error.message);
        let reason = error.message;

        // If error signal was SIGTERM, meant the experiment went over the time limit
        if (error.signal === "SIGTERM") {
          reason = "Experiment exceeded execution time limit";

          // If error code was 3221225725, meant the experiment dealt with stack overflow
        } else if (error.code === 3221225725) {
          reason = `Stack overflow / exhaustion.
                      Error can indicate a bug in the executed software that causes stack overflow, leading to abnormal termination of the software.`;
        }

        // Update status of failed experiment and error field
        await Experiment.findByIdAndUpdate(experimentId, {
          status: Status.FAILED,
          error: reason,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  console.log("running experiment: " + experimentId);

  let experiment;
  try {
    // Getting running experiment
    experiment = await Experiment.findByIdAndUpdate(experimentId, {
      status: Status.RUNNING,
    });
  } catch (error) {
    return;
  }

  await algoSend(
    experiment.input,
    onAlgoSendSuccess,
    onAlgoSendFail
  );

  console.log("Finished running experiment: " + experimentId);
};

// Processes each particular experiment from the queue and deletes the excess amount whenever the queue is over
const runQueue = async () => {
  running = true;
  while (jobQueue.length > 0) {
    const runId = jobQueue.dequeue();

    try {
      await runJob(runId);
    } catch (error) {
      console.log("error running job: " + error);
    }
  }
  running = false;
  cleanupExcess();
};

// Takes a Mongo Experiment Id and returns whether the queue began running. Run the queue if not already.
export const enqueueJob = async (experimentId) => {
  console.log("enqueueing job: " + experimentId);
  jobQueue.enqueue(experimentId);

  if (running) {
    return false;
  } else {
    runQueue();
    return true;
  }
};

export const getQueueLength = () => {
  // Note: does not include the currently running expermient
  return jobQueue.length;
};
