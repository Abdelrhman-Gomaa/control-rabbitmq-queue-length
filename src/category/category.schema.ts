import * as Joi from 'joi';

const commonSchema = {
  enTitle: Joi.string()
    .max(200)
    .regex(/^.*[a-zA-Z].*/)
    .trim()
    .required(),
  arTitle: Joi.string()
    .max(200)
    .regex(/^.*[a-zA-Z].*/)
    .trim()
    .required(),
  enDescription: Joi.string()
    .max(200)
    .regex(/^.*[a-zA-Z].*/)
    .trim()
    .required(),
  arDescription: Joi.string()
    .max(200)
    .regex(/^.*[a-zA-Z].*/)
    .trim()
    .required(),
  isPublished: Joi.boolean().default(true)
};

const schema = {
  addCategory: Joi.object({
    ...commonSchema
  }),
  editCategory: Joi.object({
    ...commonSchema
  }),
  deleteCategories: Joi.object({
    ids: Joi.array().items(Joi.number()).required()
  }),
  listCategories: Joi.object({
    page: Joi.number().min(-1).required(),
    pageSize: Joi.number().optional(),
    q: Joi.string().max(200).allow('').optional(),
    categories: Joi.array().items(Joi.number()).optional(),
    filterByIsPublished: Joi.boolean().optional(),
    order: Joi.array()
      .items(
        Joi.object({
          field: Joi.string()
            .max(200)
            .trim()
            .valid('enTitle', 'arTitle', 'enDescription', 'arDescription')
            .required(),
          orderType: Joi.string().max(200).trim().valid('asc', 'desc').required()
        })
      )
      .optional()
  })
};

export default schema;
