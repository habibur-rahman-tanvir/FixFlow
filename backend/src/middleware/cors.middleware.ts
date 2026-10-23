import cors from "cors";
import { EXPOSED_HEADERS, WHITE_LIST } from "../config/config.js";
import { AppError } from "../error/App.error.js";

const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (WHITE_LIST.length === 0 || WHITE_LIST.includes(origin)) {
      callback(null, true);
    } else {
      console.log("BLOCKED_ORIGIN:", origin);
      callback(new AppError("Not alowed by CORS"));
    }
  },
  credentials: true,
  exposedHeaders: EXPOSED_HEADERS,
});

export { corsMiddleware };
