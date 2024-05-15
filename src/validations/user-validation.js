import Joi from "joi";

const create = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const create2 = Joi.object({
  user_agent: Joi.string().required(),
});

const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  user_agent: Joi.string().required(),
});

const refreshToken = Joi.object({
  user_id: Joi.number().required(),
});

const resetPassword = Joi.object({
  username: Joi.string().required(),
});

const newPassword = Joi.object({
  reset_password_token: Joi.string().required(),
  new_password: Joi.string().required(),
  confirm_password: Joi.string().required(),
});

export default {
  create,
  create2,
  login,
  refreshToken,
  resetPassword,
  newPassword,
};
