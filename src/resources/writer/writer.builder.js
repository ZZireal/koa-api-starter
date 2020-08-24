const faker = require('faker');
const shortid = require('shortid');

const db = require('tests/db');
const { WRITER } = require('tests/constants');
const BaseBuilder = require('tests/base.builder');
const validateSchema = require('./writer.schema');

const writerService = db.createService(WRITER.COLLECTION, { validateSchema });

class WriterBuilder extends BaseBuilder {
  constructor({
    _id = shortid.generate(),
    firstName = faker.name.firstName(),
    lastName = faker.name.lastName(),
    age = faker.random.number(),
    createdOn = new Date(),
    books = [
      {
        _id: shortid.generate(),
        title: faker.company.companyName(),
        genre: 'novel',
      },
    ],
  } = {}) {
    super(writerService);

    this.data = {
      ...this.data,
      _id,
      firstName,
      lastName,
      age,
      createdOn,
      books,
    };
  }
}

module.exports = WriterBuilder;
