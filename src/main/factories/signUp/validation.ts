import { EmailValidatorAdapter } from '../../../utils/emailValidatorAdapter';
import { Validation } from '../../../presetation/protocols';
import {
  ValidationEmail,
  ValidationComposite,
  ValidationRequiredField,
  ValidationCompareField,
} from '../../../presetation/helpers/validators';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new ValidationRequiredField(field));
  }
  validations.push(
    new ValidationCompareField('password', 'passwordConfirmation')
  );

  validations.push(new ValidationEmail('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
