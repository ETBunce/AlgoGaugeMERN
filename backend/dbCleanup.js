import Experiment from "./database/models/Experiment.js";
import { Status } from "./utils/constants.js";
import { MaxExperimentDocumentCount } from "./utils/constants.js";

// Delete all documents that were not successful on startup.
export const cleanupTrash = () => {
  Experiment.deleteMany({ status: { $ne: Status.SUCCESS } })
    .then((result) => {
      console.log("Deleted trash documents. Result: ");
      console.log(result);
    })
    .catch((error) => {
      console.log("Failed to delete trash documents: " + error);
    });
};

// Delete old documents based on limit defined on startup.
export const cleanupExcess = () => {
  Experiment.find({})
    .sort({ createdAt: -1 })
    .limit(MaxExperimentDocumentCount)
    .then((recentDocuments) => {
      const recentIds = recentDocuments.map((doc) => doc._id);

      Experiment.deleteMany({ _id: { $nin: recentIds } })
        .then((result) => {
          console.log("Deleted excess documents. Result:");
          console.log(result);
        })
        .catch((err) => {
          console.log("Could not delete documents: " + err);
        });
    })
    .catch((err) => {
      console.log("Could not find recent documents: " + err);
    });
};
