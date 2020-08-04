const Joi = require('@hapi/joi');

const validate = require('middlewares/validate');
const writerService = require('resources/writer/writer.service');
const globalError = require('../globalError');

const schema = Joi.object({
  firstName: Joi.string()
    .trim()
    .messages({
      'string.empty': 'First name is required',
    }),
  lastName: Joi.string()
    .trim()
    .messages({
      'string.empty': 'Last name is required',
    }),
  age: Joi.number()
    .messages({
      'string.empty': 'Age is required',
    }),
});

async function validator(ctx, next) {
  const isWriterExists = await writerService.exists({
    _id: ctx.params.writerId,
  });

  if (!isWriterExists) {
    ctx.body = globalError('This writer is not exists');
    ctx.throw(400);
  }

  await next();
}

async function handler(ctx) {
  const data = ctx.validatedData;

  await writerService.atomic.update(
    { _id: ctx.params.writerId },
    {
      $set: {
        ...data,
      },
    },
  );
  ctx.body = await writerService.find({ _id: ctx.params.writerId });
}

module.exports.register = (router) => {
  router.put('/update/:writerId', validate(schema), validator, handler);
};
