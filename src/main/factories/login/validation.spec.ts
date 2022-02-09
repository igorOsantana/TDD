import { makeLoginValidation } from './validation';
import { Validation } from '../../../presetation/protocols';
import { ValidationComposite } from '../../../presetation/helpers/validators/composite';
import { ValidationRequiredField } from '../../../presetation/helpers/validators/requiredField';
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

describe('Login Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new ValidationRequiredField(field));
    }

    validations.push(new ValidationEmail('email', makeEmailValidation()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
