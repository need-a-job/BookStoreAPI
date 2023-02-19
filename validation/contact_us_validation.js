const joi = require("joi");

const contactUsSchema = joi.object({
  name: joi.string().max(225).required(),
  email: joi.string().email().max(255).required(),
  subject: joi.string().max(255).required(),
  content: joi.string().max(255).required(),
});

const contactUsValidation = (userData) => {
  return contactUsSchema.validateAsync(userData);
};

module.exports = contactUsValidation;
