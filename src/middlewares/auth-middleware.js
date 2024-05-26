import Jwt from "jsonwebtoken";
import { ResponseError } from "../errors/response-error.js";

const user = async (req, res, next) => {
  try {
    const access_token = await req.headers["authorization"]?.split(" ")[1];
    if (!access_token) throw new ResponseError(400, "access_token required");

    const token = await Jwt.verify(
      access_token,
      process.env.USER_AT,
      (err, decode) => {
        if (err) throw new ResponseError(400, "access_token invalid");
        return decode;
      }
    );

    if (!token) throw new ResponseError(400, "access_token invalid");
    req.id = await token.id;
    next();
  } catch (error) {
    next(error);
  }
};

const userRefreshToken = async (req, res, next) => {
  try {
    const refresh_token = await req.headers["authorization"]?.split(" ")[1];
    if (!refresh_token) throw new ResponseError(400, "refreh_token required");
    await Jwt.verify(refresh_token, process.env.USER_RT, (err, decode) => {
      if (err) throw new ResponseError(400, "refreh_token invalid");
      req.id = decode.id;
      next();
    });
  } catch (error) {
    next(error);
  }
};

const admin = async (req, res, next) => {
  try {
    const access_token = await req.headers["authorization"]?.split(" ")[1];
    if (!access_token) throw new ResponseError(400, "access_token required");
    const token = await Jwt.verify(
      access_token,
      process.env.ADMIN_AT,
      (err, decode) => {
        if (err) throw new ResponseError(400, "access_token invalid");
        return decode;
      }
    );

    if (!token) throw new ResponseError(400, "access_token invalid");
    req.id = await token.id;
    next();
  } catch (error) {
    next(error);
  }
};

const adminRefreshToken = async (req, res, next) => {
  try {
    const refresh_token = await req.headers["authorization"]?.split(" ")[1];
    if (!refresh_token) throw new ResponseError(400, "refreh_token required");
    await Jwt.verify(refresh_token, process.env.ADMIN_RT, (err, decode) => {
      if (err) throw new ResponseError(400, "refreh_token invalid");
      req.id = decode.id;
      next();
    });
  } catch (error) {
    next(error);
  }
};

const resePasswordToken = async (req, res, next) => {
  try {
    const reset_password_token = await req.headers["authorization"]?.split(
      " "
    )[1];

    if (!reset_password_token)
      throw new ResponseError(400, "reset_password_token required");
    await Jwt.verify(
      reset_password_token,
      process.env.USER_RESET_PASSWORD,
      (err, decode) => {
        if (err) throw new ResponseError(400, "reset_password_token invalid");
        next();
      }
    );
  } catch (error) {
    next(error);
  }
};

export default {
  user,
  admin,
  userRefreshToken,
  adminRefreshToken,
  resePasswordToken,
};
