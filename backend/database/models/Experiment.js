import mongoose from "mongoose";
import { Status } from "../../utils/constants.js";

// Output schema to show runtime and PERF Data
const Output = new mongoose.Schema(
  {
    wallTime: Number,
    cpuCycles: BigInt,
    busCycles: BigInt,
    cpuInstructions: BigInt,
    cacheReferences: BigInt,
    cacheMisses: BigInt,
    branchPredictions: BigInt,
    retiredBranchInstructions: BigInt,
    branchMisses: BigInt,
    totalPageFaults: BigInt,
    minorPageFaults: BigInt,
    majorPageFaults: BigInt,
    contextSwitches: BigInt,
    L1DataCacheReadAccesses: BigInt,
    L1InstructionCacheReadAccesses: BigInt,
    L1DataCachePrefetchAccesses: BigInt,
    L1InstructionCachePrefetchAccesses: BigInt,
  },
  {
    _id: false,
  }
);

// Input of what goes inside C++ AlgoGauge command line parser
const Input = new mongoose.Schema(
  {
    name: String,
    dataOrdering: String,
    inputSize: Number,
  },
  {
    _id: false,
  }
);

// Experiment contains array of input and output objects
// status flag used for queue purposes
// error is optional, when experiment times out due to taking too long so error message is present and no output
const ExperimentSchema = new mongoose.Schema(
  {
    output: {
      type: [Output],
      default: [],
    },
    input: {
      type: [Input],
      required: true,
    },
    status: {
      type: String,
      default: Status.RUNNING,
    },
    error: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Experiment = mongoose.model("Experiment", ExperimentSchema);

export default Experiment;
