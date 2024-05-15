import Response from "../app/response.js";
import userService from "../services/user-service.js";

const create = async (req, res, next) => {
  try {
    const userAgent = { user_agent: await req.headers["user-agent"] };
    const result = await userService.create(req.body, userAgent);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    req.body.user_agent = await req.headers["user-agent"];
    const result = await userService.login(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    req.body.user_id = await req.id;
    const result = await userService.refreshToken(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const result = await userService.resetPassword(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

const newPassword = async (req, res, next) => {
  try {
    req.body.reset_password_token = await req.headers["authorization"]?.split(
      " "
    )[1];
    const result = await userService.newPassword(req.body);
    res.status(200).json(result).end();
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  login,
  refreshToken,
  resetPassword,
  newPassword,
};
