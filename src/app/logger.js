import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  handleExceptions: true,
  handleRejections: true,
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: "ALL-%DATE%.log",
      zippedArchive: true,
      maxSize: "500m",
      maxFiles: "14d",
    }),
    new winston.transports.DailyRotateFile({
      level: "error",
      filename: "ERR-%DATE%.log",
      zippedArchive: true,
      maxSize: "500m",
      maxFiles: "14d",
    }),
  ],
});
