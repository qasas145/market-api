const Joi = require('joi');
const { buildSchema, idRegex, featuresFields } = require('../../utils/validator');

const createReviewSchema = buildSchema({
  message: Joi.string().required(),
  numStars: Joi.number().integer().min(1).max(5).required(),

  date: Joi.date().forbidden()
});

const ReviewSchemaQuery = buildSchema({
  ...featuresFields,
  _id : Joi.string().regex(idRegex),
  userId: Joi.string().regex(idRegex),
  productId: Joi.string().regex(idRegex),
  numStars: Joi.number().integer().min(1).max(5)
});

const updateReviewSchema = buildSchema({
  message: Joi.string(),
  numStars: Joi.number().integer().min(1).max(5)
});

module.exports = {
  createReviewSchema,
  ReviewSchemaQuery,
  updateReviewSchema
};
