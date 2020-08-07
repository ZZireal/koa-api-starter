const Joi = require('@hapi/joi');
const shortid = require('shortid');

const validate = require('middlewares/validate');
const writerService = require('resources/writer/writer.service');
const globalError = require('../globalError');

const ENUM = ['novel', 'poem', 'fantasy'];

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
  books: Joi.array().items(
    Joi.object({
      title: Joi.string().required(),
      genre: Joi.string().valid(...ENUM),
    }),
  ),
});

async function validator(ctx, next) {
  const { firstName, lastName } = ctx.validatedData;

  const isWriterExists = await writerService.exists({
    firstName,
    lastName,
  });

  if (isWriterExists) {
    ctx.body = globalError('This writer is already exists');
    ctx.throw(400);
  }

  await next();
}

async function handler(ctx) {
  const data = ctx.validatedData;

  await writerService.create({
    _id: shortid.generate(),
    firstName: data.firstName,
    lastName: data.lastName,
    age: data.age,
    books: data.books.map((book) => ({
      _id: shortid.generate(),
      ...book,
    })),
  });
}

module.exports.register = (router) => {
  router.post('/', validate(schema), validator, handler);
};
