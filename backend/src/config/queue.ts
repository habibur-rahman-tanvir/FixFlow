// import { Queue } from "bullmq";
// import { logger } from "./logger.js";
// import { AppError } from "../error/App.error.js";

// const host = process.env.REDIS_HOST;
// const port = process.env.REDIS_PORT;
// const username = process.env.REDIS_USERNAME;
// const password = process.env.REDIS_PASSWORD;

// if (!host) {
//   logger.error("ENVERR");
//   throw new AppError("ENVERR");
// }
// if (!port) {
//   logger.error("ENVERR");
//   throw new AppError("ENVERR");
// }
// if (!username) {
//   logger.error("ENVERR");
//   throw new AppError("ENVERR");
// }
// if (!password) {
//   logger.error("ENVERR");
//   throw new AppError("ENVERR");
// }

// const connection = {
//   host,
//   port,
//   username,
//   password,
// };

// const emailQueue = new Queue("email", { connection });

// export { connection, emailQueue };
