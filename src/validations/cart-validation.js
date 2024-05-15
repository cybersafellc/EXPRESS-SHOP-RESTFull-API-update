import Joi from "joi";

const create = Joi.object({
  user_id: Joi.number().required(),
  product_id: Joi.number().required(),
  qty: Joi.number().required(),
});

const get = Joi.object({
  user_id: Joi.number().required(),
});

const getById = Joi.object({
  id: Joi.number().required(),
  user_id: Joi.number().required(),
});

const update = Joi.object({
  id: Joi.number().required(),
  user_id: Joi.number().required(),
  qty: Joi.number().required(),
});

const deletes = Joi.object({
  id: Joi.number().required(),
  user_id: Joi.number().required(),
});

const deleteClear = Joi.object({
  user_id: Joi.number().required(),
});

export default { create, get, getById, update, deletes, deleteClear };
