const Joi = require('@hapi/joi');

const writerService = require('resources/writer/writer.service');

async function validator(ctx, next) {
  const isWriterExists = await writerService.exists({
    _id: Number(ctx.params.id)
  });

  if (!isWriterExists) {
    ctx.body = {
      errors: {
        _global: ['This writer is not exists'],
      },
    };
    ctx.throw(400);
  }

  await next();
}

async function handler(ctx) {
  ctx.body = await writerService.find({ _id: Number(ctx.params.id) });
}

module.exports.register = (router) => {
  router.get('/:id', validator, handler);
};
