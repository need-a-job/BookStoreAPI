const joi = require("joi");

const registerSchema = joi.object({
  name: joi.string().required().min(2).max(225).trim(),
  email: joi.string().email().min(7).max(255).required(),
  password: joi.string().min(8).max(225).required(),
  isBizz: joi.boolean().default(false).required(),
});

const registerValidation = (userData) => {
  return registerSchema.validateAsync(userData);
};

module.exports = registerValidation;
