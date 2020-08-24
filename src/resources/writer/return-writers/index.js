const writerService = require('resources/writer/writer.service');

async function handler(ctx) {
  ctx.body = await writerService.find();
  ctx.status = 200;
}

module.exports.register = (router) => {
  router.get('/', handler);
};
