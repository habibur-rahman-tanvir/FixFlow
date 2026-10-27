import MongoStore from "connect-mongo";
import session from "express-session";
import { SESSION_EXPIRE_TIME_DAY } from "./config.js";
import type e from "express";
import { envERROR } from "../utils/checkENV.js";

const { MONGODB_URI, USER_SESSION_SECRET } = envERROR({
  MONGODB_URI: process.env.MONGODB_URI,
  USER_SESSION_SECRET: process.env.USER_SESSION_SECRET,
});

const mongoStore = MongoStore.create({
  mongoUrl: MONGODB_URI,
  autoRemove: "native",
  collectionName: "user-session-data",
});

const userSession: e.RequestHandler = session({
  secret: USER_SESSION_SECRET,
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
