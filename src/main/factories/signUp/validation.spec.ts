import { makeSignUpValidation } from './validation';
import { Validation } from '../../../presetation/protocols';
import {
  ValidationEmail,
  ValidationComposite,
  ValidationRequiredField,
  ValidationCompareField,
} from '../../../presetation/helpers/validators';
import { EmailValidator } from '../../../presetation/protocols/emailValidator';

jest.mock('../../../presetation/helpers/validators/composite');

const makeEmailValidation = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe('SignUp Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new ValidationRequiredField(field));
    }

    validations.push(
      new ValidationCompareField('password', 'passwordConfirmation')
    );
    validations.push(new ValidationEmail('email', makeEmailValidation()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
