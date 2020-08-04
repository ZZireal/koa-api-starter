const Joi = require('@hapi/joi');
const shortid = require('shortid');

const validate = require('middlewares/validate');
const writerService = require('resources/writer/writer.service');
const globalError = require('../globalError');

const ENUM = ['novel', 'poem', 'fantasy'];

const schema = Joi.object({
  books: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      genre: Joi.string().valid(...ENUM),
    }),
  ),
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
  const data = ctx.request.body.books;
  await writerService.atomic.update(
    { _id: ctx.params.writerId },
    {
      $set:
      {
        books: data.map((book) => ({
          _id: shortid.generate(),
          ...book,
        })),
      },
    },
  );
  ctx.body = await writerService.find({ _id: ctx.params.writerId });
}

module.exports.register = (router) => {
  router.put('/:writerId/book', validate(schema), validator, handler);
};
