// Constants file for the backend, contains enums, keys, and limits (rather than hardcoding)

export const DataOrderings = {
  RANDOM: "Random",
  REPEATED_VALUES: "Repeated Values",
  CHUNKS: "Chunks",
  REVERSE_ORDER: "Reverse Order",
  ORDERED: "Ordered",
};

export const DataOrderingOptions = new Map([
  [DataOrderings.RANDOM, "r"],
  [DataOrderings.REPEATED_VALUES, "e"],
  [DataOrderings.CHUNKS, "c"],
  [DataOrderings.REVERSE_ORDER, "s"],
  [DataOrderings.ORDERED, "o"],
]);

export const Status = {
  RUNNING: "running",
  FAILED: "failed",
  SUCCESS: "success",
  WAITING: "waiting",
};

export const MaxExperimentDocumentCount = 100;

export const MaxSessionJobs = 3;