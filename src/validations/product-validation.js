import Joi from "joi";

const create = Joi.object({
  name: Joi.string().required(),
  stocks: Joi.number().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
  sold: Joi.number().required(),
  rating: Joi.number().required(),
  img_url: Joi.string().required(),
});

const uploadImage = Joi.object().required();

const getById = Joi.number().required();

const getByQuery = Joi.string().required();

const update = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().optional(),
  stocks: Joi.number().optional(),
  price: Joi.number().optional(),
  description: Joi.string().optional(),
  sold: Joi.number().optional(),
  rating: Joi.number().optional(),
  img_url: Joi.string().optional(),
});

const deletes = Joi.object({
  id: Joi.number().required(),
});

export default { uploadImage, create, getById, getByQuery, update, deletes };
