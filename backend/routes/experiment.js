import express from "express";
import Experiment from "../database/models/Experiment.js";
import { enqueueJob } from "../jobQueue.js";
import { MaxSessionJobs, Status } from "../utils/constants.js";

const router = express.Router();

// Gets all experiments that succeeded and failed in descending order
router.get("/history", async (req, res) => {
  try {
    res.status(200).send(
      await Experiment.find({
        status: { $in: [Status.SUCCESS, Status.FAILED] },
      }).sort({
        createdAt: "descending",
      })
    );
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Creates new experiment to be run later or placed in queue.
router.post("/submit", async (req, res) => {
  console.log(req.body);

  const input = req.body;

  // Making sure input was sent by user
  if (!input || !input.length) {
    return res.status(400).send({
      message: "Must have input",
    });
  }

  // Making sure user did not reach their experiment limit
  if (
    req.session.experimentsRunning &&
    req.session.experimentsRunning.length >= MaxSessionJobs
  ) {
    return res.status(400).send({
      message: "Job count limit reached",
    });
  }

  try {
    // Check experiments in mongoDB for running experiment
    const runningStatus = await Experiment.find({
      status: Status.RUNNING,
    });

    // Newly created experiment to either be running or in queue state depending on previous status
    const result = await Experiment.create({
      input,
      status: runningStatus ? Status.WAITING : Status.RUNNING,
    });

    // Store running experiments for a user in session, putting new one to front of array for popping oldest one purposes
    req.session.experimentsRunning = req.session.experimentsRunning
      ? [result._id, ...req.session.experimentsRunning]
      : [result._id];

    // Store history of experiments for a user in session
    req.session.experimentHistory = req.session.experimentHistory
      ? [...req.session.experimentHistory, result._id]
      : [result._id];

    // Store braddys in session
    req.session.braddys = req.session.braddys
      ? [...req.session.braddys, result._id]
      : [result._id];

    // Put experiment in queue
    enqueueJob(result._id);

    res.status(200).send({ message: "Experiment created!", result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Polling route to get status of user's experiment at top of experimentsRunning in session
router.get("/status", async (req, res) => {
  // Check if user has experiment running in session
  if (!req.session.experimentsRunning?.length) {
    req.session.experimentsRunning = [];

    return res.status(204).send({
      message: "No experiment running",
    });
  }
  try {
    // Get oldest experiment running submitted by user to run next
    let result = await Experiment.findById(
      req.session.experimentsRunning[req.session.experimentsRunning.length - 1]
    );

    // Checks incase database was cleaned up if result id is valid or not
    if (!result) {
      req.session.experimentsRunning = [];
      return res.status(204).send({
        message: "No experiment running 2",
      });
    }

    // If success or failed experiment, send back result. Otherwise, let user know experiment still running or in queue
    if (result.status === Status.SUCCESS) {
      console.log(req.session.experimentsRunning);
      req.session.experimentsRunning.pop();
      console.log(req.session.experimentsRunning);
      console.log("sending 200");
      res.status(200).send({ message: "Experiment completed", result });
    } else if (result.status === Status.FAILED) {
      req.session.experimentsRunning.pop();
      res.status(500).send({ message: "Experiment failed! ", result });
    } else if (result.status === Status.RUNNING) {
      console.log("sending 200");
      res.status(200).send({
        message: "Your current experiment is running.",
        result,
      });
    } else {
      console.log("sending 200");
      res.status(200).send({
        message: "Your current experiment is in the queue.",
        result,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Filters experiment db for experiments in waiting and running states (queue)
// Sorted by ascending order for time creation (oldest time first) and status (running first)
router.get("/queue", async (req, res) => {
  try {
    const result = await Experiment.find({
      status: { $in: [Status.WAITING, Status.RUNNING] },
    }).sort({
      createdAt: "ascending",
      status: "ascending",
    });
    res.status(200).send(result);
  } catch (error) {
    console.log("Error getting queue:" + error.message);
    res.status(500).send({ message: error.message });
  }
});

// Get a particular user's history from session
router.get("/userExperimentHistory", (req, res) => {
  if (!req.session.experimentHistory) {
    req.session.experimentHistory = [];
  }
  res.status(200).send(req.session.experimentHistory);
});

// Get a particular user's experiments running from session
router.get("/userExperimentsRunning", (req, res) => {
  if (!req.session.experimentsRunning) {
    req.session.experimentsRunning = [];
  }
  res.status(200).send(req.session.experimentsRunning);
});

// Get a particular experiment using id
router.get("/selected/:id", async (req, res) => {
  try {
    const result = await Experiment.findById(req.params.id);
    if (!result) {
      res.status(404).send({ message: `No such experiment` });
    } else {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Get braddys from user session whenever user first loads the app
router.get("/braddys", async (req, res) => {
  // if braddys don't exist or there is none, create braddys variable in session
  if (!req.session.braddys?.length) {
    req.session.braddys = [];
    return res.status(204).send({ message: `No braddys` });
  }
  try {
    // query all braddy experiments using the list of Mongo ids and waiting for all to finish
    let braddyExperiments = await Promise.all(
      req.session.braddys.map(
        async (experimentId) => await Experiment.findById(experimentId)
      )
    );

    braddyExperiments = braddyExperiments.filter((id) => id !== null);

    console.log(braddyExperiments);
    res.status(200).send(braddyExperiments);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Remove braddy from user session
router.delete("/braddys/:id", (req, res) => {
  req.session.braddys = req.session.braddys.filter(
    (id) => id.toString() !== req.params.id
  );

  console.log(req.session.braddys);
  res.status(200).send({
    message: `Removed braddy ${req.params.id} successfully from session`,
  });
});

//! Critical route for brewing tea and managing the website, do not touch - Dr. DeGrey
router.get("/teapot", async (req, res) => {
  res.status(418).send({
    message: `This is the teapot! Hi! XOXO ~Tiny Mickel Pack Man Snacky Wack`,
  });
});

export default router;
