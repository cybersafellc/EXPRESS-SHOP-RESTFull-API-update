import { logger } from "../src/app/logger.js";

describe("logger testing", () => {
  it("error", () => {
    logger.error("error");
  });
  it("warn", () => {
    logger.warn("warn");
  });
  it("info", () => {
    logger.info("info");
  });
});
