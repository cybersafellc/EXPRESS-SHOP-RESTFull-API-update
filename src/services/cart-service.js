import validate from "../validations/validate.js";
import cartValidation from "../validations/cart-validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import GenereteID from "../app/genereteId.js";
import Response from "../app/response.js";

const create = async (request) => {
  const result = await validate(cartValidation.create, request);
  const cart = await prismaClient.cart.findFirst({
    where: {
      user_id: result.user_id,
      product_id: result.product_id,
    },
  });
  if (cart) {
    if (result.qty <= 0) throw new ResponseError(400, "qty 0");
    const update = await prismaClient.cart.update({
      data: {
        qty: cart.qty + result.qty,
      },
      where: {
        user_id: result.user_id,
        id: cart.id,
      },
      select: {
        id: true,
        product_id: true,
        qty: true,
      },
    });

    return await new Response(
      200,
      "successfully add to cart",
      update,
      null,
      false
    );
  }
  const prodcut = await prismaClient.product.count({
    where: {
      id: result.product_id,
    },
  });
  if (!prodcut) throw new ResponseError(400, "product id doesn't exist");
  if (result.qty <= 0) throw new ResponseError(400, "qty 0");
  result.id = await new GenereteID(prismaClient.cart).run();

  const addToCart = await prismaClient.cart.create({
    data: result,
    select: {
      id: true,
      product_id: true,
      qty: true,
    },
  });

  return await new Response(
    200,
    "successfully add to cart",
    addToCart,
    null,
    false
  );
};

const get = async (request) => {
  const result = await validate(cartValidation.get, request);
  const carts = await prismaClient.cart.findMany({
    where: result,
  });

  for (let i = 0; i < carts.length; i++) {
    const product = await prismaClient.product.findFirst({
      where: {
        id: carts[i].product_id,
      },
    });
    carts[i].product = await product;
    carts[i].product.qty = await carts[i].qty;
    carts[i].product.product_id = await carts[i].product_id;
    carts[i].product.id = await carts[i].id;
    await delete carts[i].id;
    await delete carts[i].product_id;
    await delete carts[i].qty;
    await delete carts[i].user_id;
    carts[i] = await carts[i].product;
    await delete carts[i].product;
  }

  return await new Response(200, "successfully response", carts, null, false);
};

const getById = async (request) => {
  const result = await validate(cartValidation.getById, request);
  let cart = await prismaClient.cart.findFirst({
    where: result,
  });
  if (!cart) throw new ResponseError(400, `id ${result.id} on cart notfound`);

  const product = await prismaClient.product.findFirst({
    where: {
      id: cart.product_id,
    },
  });

  cart.product = await product;
  cart.product.qty = await cart.qty;
  cart.product.product_id = await cart.product_id;
  cart.product.id = await cart.id;
  await delete cart.id;
  await delete cart.product_id;
  await delete cart.qty;
  await delete cart.user_id;
  cart = await cart.product;
  await delete cart.product;

  return await new Response(200, "successfully response", cart, null, false);
};

const update = async (request) => {
  const result = await validate(cartValidation.update, request);
  if (result.qty <= 0) throw new ResponseError(400, "qty 0");
  const count = await prismaClient.cart.count({
    where: {
      id: result.id,
      user_id: result.user_id,
    },
  });
  if (!count) throw new ResponseError(400, `id ${result.id} on cart notfound`);
  const updates = await prismaClient.cart.update({
    where: {
      id: result.id,
      user_id: result.user_id,
    },
    data: {
      qty: result.qty,
    },
    select: {
      id: true,
      product_id: true,
      qty: true,
    },
  });

  return await new Response(200, "successfully update", updates, null, false);
};

const deletes = async (request) => {
  const result = await validate(cartValidation.deletes, request);
  const count = await prismaClient.cart.count({
    where: result,
  });
  if (!count)
    throw new ResponseError(400, `id ${result.id} on your cart not found`);
  const deleted = await prismaClient.cart.delete({
    where: result,
    select: {
      id: true,
    },
  });

  return await new Response(200, "successfully delete", deleted, null, false);
};

const deleteClear = async (request) => {
  const result = await validate(cartValidation.deleteClear, request);
  const count = await prismaClient.cart.count({
    where: result,
  });
  if (!count) throw new ResponseError(400, "your cart 0 item");
  const clear = await prismaClient.cart.deleteMany({
    where: result,
  });
  return await new Response(
    200,
    "successfully clear your cart",
    clear,
    null,
    false
  );
};

export default { create, get, getById, update, deletes, deleteClear };
