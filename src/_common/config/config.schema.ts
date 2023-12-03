import * as Joi from 'joi';

export default () => {
  return Joi.object({
    PORT: Joi.number().port().required(),
    NODE_ENV: Joi.string().trim().valid('development', 'production', 'test').required(),
    DB_URL: Joi.string().trim().required(),
    DB_NAME: Joi.string().trim().required()
  });
};
