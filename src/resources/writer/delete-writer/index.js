const writerService = require('resources/writer/writer.service');
const globalError = require('../globalError');

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
  ctx.body = await writerService.remove({ _id: ctx.params.id });
}

module.exports.register = (router) => {
  router.delete('/:id', validator, handler);
};
