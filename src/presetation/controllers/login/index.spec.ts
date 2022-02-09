import { Login } from '.';
import { MissingParamError } from '../../errors';
import {
  badRequest,
  internalServerError,
  unauthorized,
  ok,
} from '../../helpers/http';

import {
  HttpRequest,
  Authentication,
  Validation,
  AuthenticationModel,
} from './protocols';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return Promise.resolve('any_token');
    }
  }
  return new AuthenticationStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};
interface SutTypes {
  sut: Login;
  authenticationStub: Authentication;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidation();

  return {
    sut: new Login(authenticationStub, validationStub),
    authenticationStub,
    validationStub,
  };
};

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(makeFakeRequest());
    const { email, password } = makeFakeRequest().body;

    expect(authSpy).toHaveBeenCalledWith({ email, password });
  });

  test('Should return 401 if invalid credencials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(Promise.resolve(null));
    const httpRes = await sut.handle(makeFakeRequest());

    expect(httpRes).toEqual(unauthorized());
  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(Promise.reject(new Error()));
    const httpRes = await sut.handle(makeFakeRequest());

    expect(httpRes).toEqual(internalServerError(new Error()));
  });

  test('Should return 200 if valiid credencials are provided', async () => {
    const { sut } = makeSut();

    const httpRes = await sut.handle(makeFakeRequest());

    expect(httpRes).toEqual(ok({ accessToken: 'any_token' }));
  });

  test('Should call Validation with correct value ', async () => {
    const { sut, validationStub } = await makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpReq = makeFakeRequest();
    await sut.handle(httpReq);

    expect(validateSpy).toHaveBeenCalledWith(httpReq.body);
  });

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = await makeSut();
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'));
    const httpRes = await sut.handle(makeFakeRequest());

    expect(httpRes).toEqual(badRequest(new MissingParamError('any_field')));
  });
});
