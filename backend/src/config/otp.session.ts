import session from "express-session";
import { OTP_EXPIRE_TIME_MINUTE } from "./config.js";
import type e from "express";
import { envERROR } from "../utils/checkENV.js";

import MongoStore from "connect-mongo";

const { MONGODB_URI, OTP_SESSION_SECRET } = envERROR({
  MONGODB_URI: process.env.MONGODB_URI,
  OTP_SESSION_SECRET: process.env.OTP_SESSION_SECRET,
});

const mongoStore = MongoStore.create({
  mongoUrl: MONGODB_URI,
  autoRemove: "native",
  collectionName: "otp-session-data",
});

const otpSession: e.RequestHandler = session({
  secret: OTP_SESSION_SECRET,
  name: "otp.id",
  store: mongoStore,
  resave: false,
  saveUninitialized: false,
  rolling: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1000 * 60 * OTP_EXPIRE_TIME_MINUTE,
  },
});

export default otpSession;
