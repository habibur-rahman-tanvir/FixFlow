import winston from "winston";
import { isNotProduction, isProduction } from "../utils/checkENV.js";

const logger = winston.createLogger();

if (isProduction()) {
  logger.add(
    new winston.transports.Console({
      // level: 'warn',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

if (isNotProduction()) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );

  logger.add(
    new winston.transports.File({
      dirname: "logs",
      filename: "error.log",
      level: "warn",
      format: winston.format.simple(),
    }),
  );
}

export { logger };
