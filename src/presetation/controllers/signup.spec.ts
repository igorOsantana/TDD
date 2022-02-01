import { SignUpController } from './signup';

describe('Sign Up Controller', () => {
  test('Should return 400 if name is not provided by request body', () => {
    const sut = new SignUpController();
    const httpReq = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpRes = sut.handle(httpReq);
    expect(httpRes.statusCode).toBe(400);
    expect(httpRes.body).toEqual(new Error('Missing "name" in request body'));
  });

  test('Should return 400 if email is not provided by request body', () => {
    const sut = new SignUpController();
    const httpReq = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpRes = sut.handle(httpReq);
    expect(httpRes.statusCode).toBe(400);
    expect(httpRes.body).toEqual(new Error('Missing "email" in request body'));
  });
});
