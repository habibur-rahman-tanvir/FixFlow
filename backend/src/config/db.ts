import mongoose from "mongoose";
import { logger } from "./logger.js";
import { envERROR } from "../utils/checkENV.js";

const connectDatabase = async () => {
  const { MONGODB_URI } = envERROR({ MONGODB_URI: process.env.MONGODB_URI });

  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Database connected");
  } catch (err: any) {
    logger.error(`Database error: ${err.message ? err.message : "No message"}`);
  }
};

export default connectDatabase;
