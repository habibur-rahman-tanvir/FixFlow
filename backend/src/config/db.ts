import mongoose from "mongoose";
import { logger } from "./logger.js";

const connectDatabase = async () => {
  const dataBaseUrl = process.env.MONGODB_URI;

  if (!dataBaseUrl) {
    logger.error("Database url not found");
    throw new Error("Database url not found");
  }

  try {
    await mongoose.connect(dataBaseUrl);
    logger.info("Database connected");
  } catch (err: any) {
    logger.error(`Database error: ${err.message ? err.message : "No message"}`);
  }
};

export default connectDatabase;
