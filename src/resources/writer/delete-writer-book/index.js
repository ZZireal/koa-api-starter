const writerService = require('resources/writer/writer.service');
const globalError = require('../globalError');

async function validator(ctx, next) {
  const isWriterExists = await writerService.exists({
    _id: ctx.params.writerId,
  });
  const isBookExists = await writerService.exists({
    'books._id': ctx.params.bookId,
  });

  if (!isWriterExists) {
    ctx.body = globalError('This writer is not exists');
    ctx.throw(400);
  }

  if (!isBookExists) {
    ctx.body = globalError('This book is not exists');
    ctx.throw(400);
  }

  await next();
}

async function handler(ctx) {
  ctx.body = await writerService.atomic.update(
    { _id: ctx.params.writerId },
    {
      $pull: {
        books: {
          _id: ctx.params.bookId,
        },
      },
    },
  );
}

module.exports.register = (router) => {
  router.delete('/:writerId/book/:bookId', validator, handler);
};
