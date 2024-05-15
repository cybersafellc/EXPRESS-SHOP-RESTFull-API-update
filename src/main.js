import http from "http";
import dotenv from "dotenv";
import web from "./app/web.js";
import { logger } from "./app/logger.js";
dotenv.config();

const server = http.createServer(web);
server.listen(process.env.APP_PORT || 5100, () => {
  logger.info("server running on port : 5100");
});
