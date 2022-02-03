import request from 'supertest';
import app from '../../config/app';

describe('Sign Up Routes', () => {
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
