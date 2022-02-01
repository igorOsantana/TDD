import { SignUpController } from '.';
import { MissingParamError, InvalidParamError } from '../../errors/';
import { EmailValidator } from '../../protocols/email-validator';

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  return {
    sut: new SignUpController(emailValidatorStub),
    emailValidatorStub,
  };
};

describe('Sign Up Controller', () => {
  test('Should return 400 if name is not provided by request body', () => {
    const { sut } = makeSut();
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
    const { sut } = makeSut();
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
    const { sut } = makeSut();
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
    const { sut } = makeSut();
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

  test('Should return 400 if an invalid email is provided by request body', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpReq = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpRes = sut.handle(httpReq);
    expect(httpRes.statusCode).toBe(400);
    expect(httpRes.body).toEqual(new InvalidParamError('email'));
  });

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpReq = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    sut.handle(httpReq);
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
