const joi = require("joi");

const loginSchema = joi.object({
  email: joi.string().email().min(7).max(255).required(),
  password: joi.string().min(8).max(225).required(),
  isBizz: joi.boolean().default(false).required(),
});

const loginValidation = (userData) => {
  return loginSchema.validateAsync(userData);
};

module.exports = loginValidation;
