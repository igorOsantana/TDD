import { Login } from '.';
import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http';
import { EmailValidator } from '../../protocols/emailValidator';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
interface SutTypes {
  sut: Login;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  return { sut: new Login(emailValidatorStub), emailValidatorStub };
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
    const HttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };
    await sut.handle(HttpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(HttpRequest.body.email);
  });
});
