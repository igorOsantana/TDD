import { ValidationEmail } from '.';
import { EmailValidator } from '../../../protocols/emailValidator';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

interface SutTypes {
  sut: ValidationEmail;
  emailValidationStub: EmailValidator;
}

const makeSut = async (): Promise<SutTypes> => {
  const emailValidationStub = makeEmailValidator();
  return {
    sut: new ValidationEmail('email', emailValidationStub),
    emailValidationStub,
  };
};

describe('Email Validation', () => {
  test('Should call EmailValidation with correct email', async () => {
    const { sut, emailValidationStub } = await makeSut();
    const isValidSpy = jest.spyOn(emailValidationStub, 'isValid');
    sut.validate({ email: 'any_email@mail.com' });

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw if EmailValidation throws', async () => {
    const { sut, emailValidationStub } = await makeSut();
    jest.spyOn(emailValidationStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
