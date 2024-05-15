import Joi from "joi";

const create = Joi.object({
  user_id: Joi.number().required(),
  name: Joi.string().required(),
  address_1: Joi.string().required(),
  suite: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  phone_number: Joi.string().required(),
  zip_code: Joi.string().required(),
});

const get = Joi.object({
  user_id: Joi.number().required(),
});

const getById = Joi.object({
  user_id: Joi.number().required(),
  id: Joi.number().required(),
});

const updates = Joi.object({
  user_id: Joi.number().required(),
  id: Joi.number().required(),
  name: Joi.string().optional(),
  address_1: Joi.string().optional(),
  suite: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
  phone_number: Joi.string().optional(),
  zip_code: Joi.string().required(),
});

const deletes = Joi.object({
  id: Joi.number().required(),
  user_id: Joi.number().required(),
});

export default { create, get, getById, updates, deletes };
