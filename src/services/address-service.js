import validate from "../validations/validate.js";
import addressValidation from "../validations/address-validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import GenereteID from "../app/genereteId.js";
import Response from "../app/response.js";

const create = async (request) => {
  const result = await validate(addressValidation.create, request);
  const count = await prismaClient.address.count({
    where: result,
  });
  if (count) throw new ResponseError(400, "address already exist");
  result.id = await new GenereteID(prismaClient.address).run();
  const created = await prismaClient.address.create({
    data: result,
    select: {
      id: true,
      name: true,
      address_1: true,
      suite: true,
      city: true,
      state: true,
      country: true,
      phone_number: true,
      zip_code: true,
    },
  });
  return await new Response(200, "successfully create", created, null, false);
};

const get = async (request) => {
  const result = await validate(addressValidation.get, request);
  const address = await prismaClient.address.findMany({
    where: result,
    select: {
      id: true,
      name: true,
      address_1: true,
      suite: true,
      city: true,
      state: true,
      zip_code: true,
      country: true,
      phone_number: true,
    },
  });
  return await new Response(200, "successfully response", address, null, false);
};

const getById = async (request) => {
  const result = await validate(addressValidation.getById, request);
  const address = await prismaClient.address.findFirst({
    where: result,
    select: {
      id: true,
      name: true,
      address_1: true,
      suite: true,
      city: true,
      state: true,
      zip_code: true,
      country: true,
      phone_number: true,
    },
  });
  if (!address) throw new ResponseError(400, "address notfound");
  return await new Response(200, "successfullu response", address, null, false);
};

const updates = async (request) => {
  const result = await validate(addressValidation.updates, request);
  const count = await prismaClient.address.count({
    where: {
      id: result.id,
      user_id: result.user_id,
    },
  });
  if (!count) throw new ResponseError(400, "address doesn't exist");
  const update = await prismaClient.address.update({
    data: result,
    where: {
      id: result.id,
      user_id: result.user_id,
    },
    select: {
      id: true,
      name: true,
      address_1: true,
      suite: true,
      city: true,
      state: true,
      zip_code: true,
      country: true,
      phone_number: true,
    },
  });

  return await new Response(200, "successfully update", update, null, false);
};

const deletes = async (request) => {
  const result = await validate(addressValidation.deletes, request);
  const count = await prismaClient.address.count({
    where: result,
  });
  if (!count) throw new ResponseError(400, "address id doesn't exits");
  const deleted = await prismaClient.address.delete({
    where: result,
    select: {
      id: true,
      name: true,
      address_1: true,
      suite: true,
      city: true,
      state: true,
      zip_code: true,
      country: true,
      phone_number: true,
    },
  });

  return await new Response(200, "successfully delete", deleted, null, false);
};

export default { create, get, getById, updates, deletes };
