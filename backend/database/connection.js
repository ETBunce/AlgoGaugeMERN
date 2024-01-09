import mongoose from "mongoose";

// connection string from .env in backend
const connectionString = process.env.MONGODB_CONNECTION_STRING || "";

// connect to database when running backend
try {
  await mongoose.connect(connectionString, { dbName: process.env.MONGODB_DATABASE_NAME });
  console.log("Successfully connected to MongoDB cluster and AlgoGauge database using Mongoose");
} catch (e) {
  console.error(e);
}