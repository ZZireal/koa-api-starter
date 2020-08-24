/* eslint-disable */
const _ = require('lodash');
const chai = require('chai');
const supertest = require('supertest');
const config = require('config');
const db = require('tests/db');
const expect = chai.expect;

const server = require('app');
const { WRITER, ERRORS } = require('tests/constants');
const testsHelper = require('tests/tests.helper');

const WriterBuilder = require('./writer.builder');
const writerSchema = require('./writer.schema');

const app = server.listen();
const writerService = db.createService(WRITER.COLLECTION, writerSchema);

const VALID_WRITER = {
  _id: "1",
  firstName: "Kain",
  lastName: "from Odisseya",
  age: 25,
  books: [
      {
          _id: "1",
          "title": "Some day",
          "genre": "poem"
      },
      {
          _id: "2",
          "title": "Some hell",
          "genre": "novel"
      }
  ]
};

describe('/writers', async () => {
  let newWriter;
  let dbWriters;
  const ok = supertest.agent(app);

  beforeEach(async () => {
    newWriter = await new WriterBuilder().build();
    dbWriters = await writerService.findOne();
  });

  afterEach(async () => {
    await db.get(WRITER.COLLECTION).drop();
  })

  it('should successfully return data of writer', (done) => {
    testsHelper.test(done, async () => {
      const dbWriters = await writerService.findOne();
      expect(dbWriters).to.have.all.keys('_id' , 'createdOn', 'firstName', 'lastName', 'age', 'books');
    });
  });

  it('should return error if writer age is not a number', (done) => {
    testsHelper.test(done, async () => {
      const dbWriters = await writerService.findOne();
      expect(dbWriters.age).to.be.a('number');
    });
  });

  it('should return error if writer firstName is not a string', (done) => {
    testsHelper.test(done, async () => {
      const dbWriters = await writerService.findOne();
      expect(dbWriters.firstName).to.be.a('string');
    });
  });

  it('should return error if writer lastName is not a string', (done) => {
    testsHelper.test(done, async () => {
      const dbWriters = await writerService.findOne();
      expect(dbWriters.lastName).to.be.a('string');
    });
  });

  it('should return error if writer books is not a array', (done) => {
    testsHelper.test(done, async () => {
      const dbWriters = await writerService.findOne();
      expect(dbWriters.books).to.be.a('array');
    });
  });  

  it('should return error if writer books title is not a string', (done) => {
    testsHelper.test(done, async () => {
      const dbWriters = await writerService.findOne();
      expect(dbWriters.books[0].title).to.be.a('string');
    });
  });  

  it('should return error if writer books genre is not a string', (done) => {
    testsHelper.test(done, async () => {
      const dbWriters = await writerService.findOne();
      expect(dbWriters.books[0].genre).to.be.a('string');
    });
  });  

  it('should return error if client did not has data', (done) => {
    testsHelper.test(done, async () => {
      const response = await ok.get('/writer')
      .expect(200);
    });
  });

  it('should successfully create writer', (done) => {
    testsHelper.test(done, async () => {
      const response = await ok.post('/writer')
        .send(VALID_WRITER)
        .expect(200);
    });
  });

  it('should return an error that writer is already exists', (done) => {
      testsHelper.test(done, async () => {
        const response = await ok.post('/writer')
          .send({ ...dbWriters, firstName: 'uniqueName'})
          .expect(200);
      });
  });

  it('should return an error that writer is not exists', (done) => {
    testsHelper.test(done, async () => {
      bWriters = await writerService.create(VALID_WRITER);
      const responseDelete = await ok.delete('/writer/1')
        .expect(200);
    });
  });

  it('should successfully update writer', (done) => {
    testsHelper.test(done, async () => {
      dbWriters = await writerService.create(VALID_WRITER);
      const responseUpdate = await ok.put('/writer/update/1')
        .send({ firstName: 'uniqueName' })
        .expect(200);
    });
  });
});
