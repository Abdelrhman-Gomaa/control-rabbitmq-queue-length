import * as Joi from 'joi';
import { messageTypeEnum } from './send-message.enum';

const commonSchema = {
  to: Joi.string()
    .max(200)
    .regex(/^.*[a-zA-Z\u0600-\u06FF].*/)
    .trim()
    .required(),
  from: Joi.string()
    .max(200)
    .regex(/^.*[a-zA-Z\u0600-\u06FF].*/)
    .trim()
    .required(),
  content: Joi.string()
    .max(1000)
    .regex(/^.*[a-zA-Z\u0600-\u06FF].*/)
    .trim()
    .required(),
  type: Joi.string()
    .optional()
    .valid(...Object.values(messageTypeEnum))
    .default('Pending'),
  isPublished: Joi.boolean().optional(),
  categoryId: Joi.number().integer().optional(),
  resolvedAt: Joi.date().optional()
};

const schema = {
  addMessage: Joi.object({
    ...commonSchema
  }),
  editMessage: Joi.object({
    ...commonSchema
  }),
  deleteMessages: Joi.object({
    ids: Joi.array().items(Joi.number()).required()
  }),
  listMessages: Joi.object({
    page: Joi.number().min(-1).optional().default(1),
    pageSize: Joi.number().optional(),
    q: Joi.string().max(200).allow('').optional(),
    messages: Joi.array().items(Joi.number()).optional(),
    filterByIsPublished: Joi.boolean().optional(),
    order: Joi.array()
      .items(
        Joi.object({
          field: Joi.string().max(200).trim().valid('to', 'from', 'content', 'type').required(),
          orderType: Joi.string().max(200).trim().valid('asc', 'desc').required()
        })
      )
      .optional()
  })
};

export default schema;
