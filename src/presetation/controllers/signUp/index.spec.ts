import { SignUpController } from '.';

import {
  MissingParamError,
  InvalidParamError,
  ServerError,
} from '../../errors';

import {
  EmailValidator,
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
  Validation,
} from './protocol';

import { ok, internalServerError, badRequest } from '../../helpers/http';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAddAccount = async (): Promise<AddAccount> => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    }
  }
  return new AddAccountStub();
};

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

const makeSut = async (): Promise<SutTypes> => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = await makeAddAccount();
  const validationStub = makeValidation();
  return {
    sut: new SignUpController(
      emailValidatorStub,
      addAccountStub,
      validationStub
    ),
    emailValidatorStub,
    addAccountStub,
    validationStub,
  };
};

describe('Sign Up Controller', () => {
  test('Should return 400 if an invalid email is provided by request body', async () => {
    const { sut, emailValidatorStub } = await makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRes = await sut.handle(makeFakeRequest());

    expect(httpRes).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = await makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    await sut.handle(makeFakeRequest());

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = await makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRes = await sut.handle(makeFakeRequest());

    expect(httpRes).toEqual(internalServerError(new ServerError(null)));
  });

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = await makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');
    await sut.handle(makeFakeRequest());

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = await makeSut();
    jest
      .spyOn(addAccountStub, 'add')
      .mockImplementationOnce(() => Promise.reject(new Error()));
    const httpRes = await sut.handle(makeFakeRequest());

    expect(httpRes).toEqual(internalServerError(new ServerError(null)));
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = await makeSut();
    const httpRes = await sut.handle(makeFakeRequest());

    expect(httpRes).toEqual(ok(makeFakeAccount()));
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
