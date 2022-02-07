import { ValidationComposite } from '../../../presetation/helpers/validators/composite';
import { ValidationRequiredField } from '../../../presetation/helpers/validators/requiredField';
import { Validation } from '../../../presetation/helpers/validators/validation';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['name', 'email', 'passord', 'passwordConfirmation']) {
    validations.push(new ValidationRequiredField(field));
  }
  return new ValidationComposite(validations);
};
