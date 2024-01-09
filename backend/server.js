#!/usr/bin/env node
// Do not modify above line. It is for the production server so that the backend API can run stand alone. 
import "./loadEnvironment.js";
import "./database/connection.js";
import cors from "cors";
import express from "express";
import session from "express-session";
import MongoDBStore from "./database/sessions.js";
import { cleanupExcess, cleanupTrash } from "./dbCleanup.js";
import experiment from "./routes/experiment.js";

const PORT = process.env.PORT || 4000;

const app = express();

// makes BigInt into strings data type from MongoDB  when sending back response
BigInt.prototype.toJSON = function () {
  return this.toString();
};

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// use sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    name: "session-id",
    store: MongoDBStore,
    cookie: { maxAge: 2629800000, sameSite: false, secure: false },
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/experiment", experiment);

// Cleanup database
cleanupTrash();
//commenting this out for now. May not be needed in the future with production using mongodb on morpheus instead of the cloud.
//the original purpose of the below function was to keep the number of records within the mongodb cloud instance below the 
//free tier limits. However, since we installed mongodb on morpheus and pointed this to that instance, we no longer have that constraint.
// cleanupExcess(); 

// Listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
