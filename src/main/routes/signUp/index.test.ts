import request from 'supertest';

import app from '../../config/app';

import { MongoHelper } from '../../../infra/db/mongodb/helpers';

describe('Sign Up Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  test('Should return a new account on success', async () => {
    await request(app)
      .post('/api/sign-up')
      .send({
        name: 'Igor',
        email: 'igor@mail.com',
        password: '123456',
        passwordConfirmation: '123456',
      })
      .expect(200);
  });
});
