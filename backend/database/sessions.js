import ConnectMongoDBSession from "connect-mongodb-session";
import session from "express-session";

const ConnectMongoDBStore = ConnectMongoDBSession(session);

// links session to mongoDB
const MongoDBStore = new ConnectMongoDBStore({
  uri: process.env.MONGODB_CONNECTION_STRING || "",
  collection: "sessions",
  databaseName: process.env.MONGODB_DATABASE_NAME,
});

export default MongoDBStore;