import validate from "../validations/validate.js";
import userValidation from "../validations/user-validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import GenereteID from "../app/genereteId.js";
import Response from "../app/response.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import sendEmail from "../app/sendEmail.js";

const create = async (requestUsers, requestDevice) => {
  const result = await validate(userValidation.create, requestUsers);
  const resultDevice = await validate(userValidation.create2, requestDevice);

  const count = await prismaClient.user.count({
    where: {
      username: result.username,
    },
  });
  if (count) throw new ResponseError(400, "username already exist");

  result.status_account = "active";
  result.id = await new GenereteID(prismaClient.user).run();
  result.password = await bcrypt.hash(result.password, 10);
  const resultCreate = await prismaClient.user.create({
    data: result,
  });

  resultDevice.id = await new GenereteID(prismaClient.device).run();
  resultDevice.user_id = await resultCreate.id;
  await prismaClient.device.create({
    data: resultDevice,
  });

  const responseObject = await new Response(
    200,
    "successfuly created",
    {
      username: resultCreate.username,
    },
    null,
    false
  );

  return responseObject;
};

const login = async (request) => {
  const result = await validate(userValidation.login, request);
  const data = await prismaClient.user.findFirst({
    where: {
      username: result.username,
      status_account: "active",
    },
  });
  if (!data) {
    const isLockedOrAny = await prismaClient.user.findFirst({
      where: {
        username: result.username,
      },
    });
    if (isLockedOrAny)
      throw new ResponseError(
        400,
        `Your account ${isLockedOrAny.status_account}`
      );

    throw new ResponseError(400, "username doesn't exist");
  }

  if (await bcrypt.compare(result.password, data.password)) {
    const device = await prismaClient.device.findFirst({
      where: {
        user_id: data.id,
      },
    });

    if (device.user_agent !== result.user_agent) {
      await prismaClient.user.update({
        data: {
          status_account: "locked",
        },
        where: data,
      });

      new sendEmail().unusualActivity(data.username, result.user_agent);

      throw new ResponseError(
        400,
        "your account has been locked. Please contact CS for unlocked your account"
      );
    }

    const access_token = await Jwt.sign({ id: data.id }, process.env.USER_AT, {
      expiresIn: "5m",
    });
    const refresh_token = await Jwt.sign({ id: data.id }, process.env.USER_RT, {
      expiresIn: "7d",
    });
    return await new Response(
      200,
      "successfuly login",
      {
        access_token,
        refresh_token,
      },
      null,
      false
    );
  } else {
    throw new ResponseError(400, "password incorect");
  }
};

const refreshToken = async (request) => {
  const result = await validate(userValidation.refreshToken, request);
  const userActived = await prismaClient.user.count({
    where: {
      id: result.user_id,
      status_account: "active",
    },
  });

  if (!userActived)
    throw new ResponseError(
      400,
      "Issue with your account, Please contact Customer Service"
    );

  const access_token = await Jwt.sign(
    { id: result.user_id },
    process.env.USER_AT,
    {
      expiresIn: "5m",
    }
  );

  return await new Response(
    200,
    "new access_token successfully genereted",
    {
      access_token,
    },
    null,
    false
  );
};

const resetPassword = async (request) => {
  const result = await validate(userValidation.resetPassword, request);
  const data = await prismaClient.user.findFirst({
    where: {
      username: result.username,
      status_account: "active",
    },
  });

  if (!data) {
    const isLockedOrAny = await prismaClient.user.findFirst({
      where: {
        username: result.username,
      },
    });
    if (isLockedOrAny)
      throw new ResponseError(
        400,
        `Your account ${isLockedOrAny.status_account}`
      );

    throw new ResponseError(400, "username doesn't exist");
  }

  const reset_password_token = await Jwt.sign(
    { id: data.id },
    process.env.USER_RESET_PASSWORD,
    { expiresIn: "5m" }
  );
  new sendEmail().send(result.username, reset_password_token);
  return await new Response(
    200,
    "we have sent a link for reset your password, check your email",
    null,
    null,
    false
  );
};

const newPassword = async (request) => {
  const result = await validate(userValidation.newPassword, request);

  const reset_password_token = await Jwt.verify(
    result.reset_password_token,
    process.env.USER_RESET_PASSWORD,
    (err, decode) => {
      if (err) throw new ResponseError(400, "reset_password_token invalid");
      return decode;
    }
  );

  if (!reset_password_token)
    throw new ResponseError(400, "reset_password_token invalid");
  if (result.new_password !== result.confirm_password)
    throw new ResponseError(400, "password not match");

  result.confirm_password = await bcrypt.hash(result.confirm_password, 10);
  try {
    const newPassUpdate = await prismaClient.user.update({
      data: {
        password: result.confirm_password,
      },
      where: {
        id: reset_password_token.id,
        status_account: "active",
      },
      select: {
        username: true,
      },
    });

    return await new Response(
      200,
      "password successfuly update",
      {
        username: newPassUpdate.username,
      },
      null,
      false
    );
  } catch (error) {
    throw new ResponseError(
      "Issue with your account, Please contact Customer Service"
    );
  }
};

export default { create, login, refreshToken, resetPassword, newPassword };
