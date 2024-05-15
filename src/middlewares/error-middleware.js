import { logger } from "../app/logger.js";
import Response from "../app/response.js";
import { ResponseError } from "../errors/response-error.js";

const pageNotFound = async (req, res, next) => {
  try {
    throw new ResponseError(404, "page not found");
  } catch (error) {
    next(error);
  }
};

const errorHandler = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json(new Response(err.status, err.message, null, null, true))
      .end();
  } else {
    res
      .status(500)
      .json(new Response(500, err.message, null, null, true))
      .end();

    logger.error(err.message);
  }
};

export default { errorHandler, pageNotFound };
