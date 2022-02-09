import { EmailValidatorAdapter } from '../../../../utils/emailValidatorAdapter';
import { Validation } from '../../../../presetation/protocols';
import {
  ValidationEmail,
  ValidationRequiredField,
  ValidationComposite,
} from '../../../../presetation/helpers/validators';

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['email', 'password']) {
    validations.push(new ValidationRequiredField(field));
  }

  validations.push(new ValidationEmail('email', new EmailValidatorAdapter()));

  return new ValidationComposite(validations);
};
