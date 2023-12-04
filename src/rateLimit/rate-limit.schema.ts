import * as Joi from 'joi';

const commonSchema = {
  windowMs: Joi.number().integer().optional(),
  max: Joi.number().integer().optional(),
  message: Joi.string()
    .max(200)
    .regex(/^.*[a-zA-Z\u0600-\u06FF].*/)
    .trim()
    .required()
};

const schema = {
  editRateLimit: Joi.object({
    ...commonSchema
  })
};

export default schema;
