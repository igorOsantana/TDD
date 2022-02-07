import { makeSignUpValidation } from './validation';
import { Validation } from '../../../presetation/helpers/validators/validation';
import { ValidationComposite } from '../../../presetation/helpers/validators/composite';
import { ValidationRequiredField } from '../../../presetation/helpers/validators/requiredField';
import { ValidationCompareField } from '../../../presetation/helpers/validators/compareField';
import { EmailValidator } from '../../../presetation/protocols/emailValidator';
import { ValidationEmail } from '../../../presetation/helpers/validators/email';

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
