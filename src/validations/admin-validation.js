import Joi from "joi";

const login = Joi.object({
  username: Joi.string().min(1).max(30).required(),
  password: Joi.string().min(1).max(30).required(),
});

const refreshToken = Joi.object({
  admin_id: Joi.number().required(),
});

const lockedUsers = Joi.object({
  user_id: Joi.string().required(),
  status: Joi.boolean().required(),
});

export default { login, refreshToken, lockedUsers };
