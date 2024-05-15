import { prismaClient } from "../app/database.js";
import GenereteID from "../app/genereteId.js";
import Response from "../app/response.js";
import { ResponseError } from "../errors/response-error.js";
import productValidation from "../validations/product-validation.js";
import validate from "../validations/validate.js";

const imageUpload = async (file) => {
  if (!file)
    throw new ResponseError(
      400,
      "image declined, Please upload image (png, jpg, jpeg)"
    );
  const result = await validate(productValidation.uploadImage, file);

  return await new Response(
    200,
    "image successfuly upload",
    {
      img_url: `http://localhost:5100/products/images/${result.originalname}`,
    },
    null,
    false
  );
};

const create = async (request) => {
  const result = await validate(productValidation.create, request);
  const count = await prismaClient.product.count({
    where: {
      name: result.name,
    },
  });
  if (count) throw new ResponseError(400, "this product already exist");
  result.id = await new GenereteID(prismaClient.product).run();
  const product = await prismaClient.product.create({
    data: result,
  });
  return await new Response(200, "successfully create", product, null, false);
};

const getAll = async () => {
  const products = await prismaClient.product.findMany();
  return await new Response(
    200,
    "successfully response",
    products,
    null,
    false
  );
};

const getById = async (id) => {
  const result = await validate(productValidation.getById, id);
  const product = await prismaClient.product.findUnique({
    where: {
      id: result,
    },
  });
  return await new Response(200, "succesfully response", product, null, false);
};

const getByQuery = async (query) => {
  const result = await validate(productValidation.getByQuery, query);
  const products = await prismaClient.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: result,
          },
        },
        {
          description: {
            contains: result,
          },
        },
      ],
    },
  });

  return await new Response(
    200,
    "successfully response",
    products,
    null,
    false
  );
};

const update = async (request) => {
  const result = await validate(productValidation.update, request);
  const count = await prismaClient.product.count({
    where: {
      id: result.id,
    },
  });
  if (!count) throw new ResponseError(400, "product id doesn't exist");

  const updates = await prismaClient.product.update({
    where: {
      id: result.id,
    },
    data: result,
  });

  return await new Response(200, "successfully update", updates, null, false);
};

const deletes = async (request) => {
  const result = await validate(productValidation.deletes, request);
  const count = await prismaClient.product.count({
    where: result,
  });
  if (!count) throw new ResponseError(400, "product doesn't exist");
  const deletes = await prismaClient.product.delete({
    where: result,
  });
  return await new Response(200, "successfully delete", deletes, null, false);
};

export default {
  imageUpload,
  create,
  getAll,
  getById,
  getByQuery,
  update,
  deletes,
};
