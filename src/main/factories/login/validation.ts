import { ValidationComposite } from '../../../presetation/helpers/validators/composite';
import { ValidationRequiredField } from '../../../presetation/helpers/validators/requiredField';
import { Validation } from '../../../presetation/helpers/validators/validation';
import { ValidationEmail } from '../../../presetation/helpers/validators/email';
import { EmailValidatorAdapter } from '../../../utils/emailValidatorAdapter';

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['email', 'password']) {
    validations.push(new ValidationRequiredField(field));
  }

  validations.push(new ValidationEmail('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
