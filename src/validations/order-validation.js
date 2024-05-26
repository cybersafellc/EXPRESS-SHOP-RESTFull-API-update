import Joi from "joi";

const cekout = Joi.object({
  user_id: Joi.string().required(),
  cart_id: Joi.array().items(Joi.number().required()).required(),
  address_id: Joi.number().required(),
});

const weebhookMidtrans = Joi.object().required();

const getAll = Joi.object({
  user_id: Joi.string().required(),
});

const getByOrderId = Joi.object({
  user_id: Joi.string().required(),
  order_id: Joi.string().required(),
});

export default { cekout, weebhookMidtrans, getAll, getByOrderId };
