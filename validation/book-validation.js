const joi = require("joi");

const bookSchema = joi.object({
  userId: joi.string().required(),
  name: joi.string().max(225).required(),
  author: joi.string().max(255).required(),
  price: joi.number().max(255).required(),
  sold: joi.number(),
  release_date: joi.string().required(),
  children: joi.boolean().required(),
  image: joi.string(),
});

const bookValidation = (userData) => {
  return bookSchema.validateAsync(userData);
};

module.exports = bookValidation;
