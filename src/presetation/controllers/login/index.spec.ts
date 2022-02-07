import { Login } from '.';
import { Authentication } from '../../../domain/usecases/authentication';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, internalServerError } from '../../helpers/http';
import { HttpRequest } from '../../protocols';
import { EmailValidator } from '../../protocols/emailValidator';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return '';
    }
  }
  return new AuthenticationStub();
};
interface SutTypes {
  sut: Login;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticationStub = makeAuthentication();

  return {
    sut: new Login(emailValidatorStub, authenticationStub),
    emailValidatorStub,
    authenticationStub,
  };
};

describe('Login Controller', () => {
  test('Should return 400 if email is not provided by request body', async () => {
    const { sut } = makeSut();
    const HttpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpRes = await sut.handle(HttpRequest);

    expect(httpRes).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if password is not provided by request body', async () => {
    const { sut } = makeSut();
    const HttpRequest = {
      body: {
        email: 'any_email@mail.com',
      },
    };
    const httpRes = await sut.handle(HttpRequest);

    expect(httpRes).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    await sut.handle(makeFakeRequest());
    expect(isValidSpy).toHaveBeenCalledWith(makeFakeRequest().body.email);
  });

  test('Should return 400 if an invalid email is provided by request body', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRes = await sut.handle(makeFakeRequest());

    expect(httpRes).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRes = await sut.handle(makeFakeRequest());

    expect(httpRes).toEqual(internalServerError(new Error()));
  });

  test('Should call Authentucation with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(makeFakeRequest());
    const { email, password } = makeFakeRequest().body;
    expect(authSpy).toHaveBeenCalledWith(email, password);
  });
});
