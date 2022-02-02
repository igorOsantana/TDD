import { SignUpController } from '.';

import {
  MissingParamError,
  InvalidParamError,
  ServerError,
} from '../../errors/';

import { EmailValidator } from '../../protocols';
import { AccountModel } from '../../../domain/models/account';
import {
  AddAccount,
  AddAccountModel,
} from '../../../domain/usecases/add-account';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      };
      return fakeAccount;
    }
  }
  return new AddAccountStub();
};

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  return {
    sut: new SignUpController(emailValidatorStub, addAccountStub),
    emailValidatorStub,
    addAccountStub,
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

  test('Should return 400 if password length is less than six character', () => {
    const { sut } = makeSut();
    const httpReq = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_p',
        passwordConfirmation: 'any_p',
      },
    };
    const httpRes = sut.handle(httpReq);
    expect(httpRes.statusCode).toBe(400);
    expect(httpRes.body).toEqual(new InvalidParamError('password'));
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

  test('Should return 400 if password confirmation fails', () => {
    const { sut } = makeSut();
    const httpReq = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    };
    const httpRes = sut.handle(httpReq);
    expect(httpRes.statusCode).toBe(400);
    expect(httpRes.body).toEqual(new InvalidParamError('passwordConfirmation'));
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

  test('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpReq = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpRes = sut.handle(httpReq);
    expect(httpRes.statusCode).toBe(500);
    expect(httpRes.body).toEqual(new ServerError());
  });

  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    const httpReq = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    sut.handle(httpReq);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });
});
