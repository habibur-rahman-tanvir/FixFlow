import MongoStore from "connect-mongo";
import session from "express-session";
import { SESSION_EXPIRE_TIME_DAY } from "./config.js";
import { logger } from "./logger.js";
import type e from "express";

const dataBaseUrl = process.env.MONGODB_URI;

if (!dataBaseUrl) {
  logger.error("Database url not found");
  throw new Error("Database url not found");
}

const mongoStore = MongoStore.create({
  mongoUrl: dataBaseUrl,
  autoRemove: "native",
  collectionName: "session-data",
});

const userSession: e.RequestHandler = session({
  // TODO: configure secret
  secret: "fgiuefkh",
  store: mongoStore,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * SESSION_EXPIRE_TIME_DAY,
  },
});

export default userSession;
