import validate from "../validations/validate.js";
import adminValidation from "../validations/admin-validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import Response from "../app/response.js";

const login = async (request) => {
  const result = await validate(adminValidation.login, request);
  const data = await prismaClient.admin.findFirst({
    where: {
      username: result.username,
    },
  });

  if (data && (await bcrypt.compare(result.password, data.password))) {
    const access_token = await Jwt.sign({ id: data.id }, process.env.ADMIN_AT, {
      expiresIn: "5m",
    });
    const refresh_token = await Jwt.sign(
      { id: data.id },
      process.env.ADMIN_RT,
      { expiresIn: "7d" }
    );
    return await new Response(
      200,
      "login success",
      {
        access_token,
        refresh_token,
      },
      null,
      false
    );
  } else {
    throw new ResponseError(400, "username or password invalid");
  }
};

const refreshToken = async (request) => {
  const result = await validate(adminValidation.refreshToken, request);
  const access_token = await Jwt.sign(
    { id: result.admin_id },
    process.env.ADMIN_AT,
    {
      expiresIn: "5m",
    }
  );
  return await new Response(
    200,
    "new access_token succesfully genereted",
    { access_token },
    null,
    false
  );
};

const getUsers = async () => {
  const datas = await prismaClient.user.findMany({
    select: {
      id: true,
      username: true,
      status_account: true,
    },
  });
  return await new Response(
    200,
    "successfuly respound",
    { datas },
    null,
    false
  );
};

const lockedUsers = async (request) => {
  const result = validate(adminValidation.lockedUsers, request);
  if (result.status) {
    result.status = await "active";
  } else {
    result.status = await "locked";
  }
  const update = await prismaClient.user.update({
    data: {
      status_account: result.status,
    },
    where: {
      id: result.user_id,
    },
    select: {
      username: true,
      status_account: true,
    },
  });

  return await new Response(
    200,
    "successfully update",
    { update },
    null,
    false
  );
};

export default { login, refreshToken, getUsers, lockedUsers };
