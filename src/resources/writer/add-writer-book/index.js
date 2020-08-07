const Joi = require('@hapi/joi');
const shortid = require('shortid');

const validate = require('middlewares/validate');
const writerService = require('resources/writer/writer.service');
const globalError = require('../globalError');

const ENUM = ['novel', 'poem', 'fantasy'];

const schema = Joi.object({
  title: Joi.string().required(),
  genre: Joi.string().valid(...ENUM),
});

async function validator(ctx, next) {
  const isWriterExists = await writerService.exists({
    _id: ctx.params.id,
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
    { _id: ctx.params.id },
    {
      $push: {
        books: {
          _id: shortid.generate(),
          ...data,
        },
      },
    },
  );
  ctx.body = await writerService.find({ _id: ctx.params.id });
}

module.exports.register = (router) => {
  router.put('/:id', validate(schema), validator, handler);
};
