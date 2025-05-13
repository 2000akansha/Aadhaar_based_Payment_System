import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const dbConnection = () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    process.exit(1);
  }

  return mongoose
    .connect(mongoURI, { dbName: "nach-project" })
    .then(() => {})
    .catch((err) => {
      throw err;
    });
};
