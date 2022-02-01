import { SignUpController } from '.';
import { MissingParamError } from '../../errors/missing-param';

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
    expect(httpRes.body).toEqual(new MissingParamError('name'));
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
    expect(httpRes.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if password is not provided by request body', () => {
    const sut = new SignUpController();
    const httpReq = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    };
    const httpRes = sut.handle(httpReq);
    expect(httpRes.statusCode).toBe(400);
    expect(httpRes.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 if password confirmation is not provided by request body', () => {
    const sut = new SignUpController();
    const httpReq = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };
    const httpRes = sut.handle(httpReq);
    expect(httpRes.statusCode).toBe(400);
    expect(httpRes.body).toEqual(new MissingParamError('passwordConfirmation'));
  });
});
