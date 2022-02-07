import { ValidationComposite } from '../../../presetation/helpers/validators/composite';
import { ValidationRequiredField } from '../../../presetation/helpers/validators/requiredField';
import { ValidationCompareField } from '../../../presetation/helpers/validators/compareField';
import { Validation } from '../../../presetation/helpers/validators/validation';
import { ValidationEmail } from '../../../presetation/helpers/validators/email';
import { EmailValidatorAdapter } from '../../../utils/emailValidatorAdapter';

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
