import { ValidationComposite } from '../../../presetation/helpers/validators/composite';
import { ValidationRequiredField } from '../../../presetation/helpers/validators/requiredField';
import { ValidationCompareField } from '../../../presetation/helpers/validators/compareField';
import { Validation } from '../../../presetation/helpers/validators/validation';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new ValidationRequiredField(field));
  }
  validations.push(
    new ValidationCompareField('password', 'passwordConfirmation')
  );
  return new ValidationComposite(validations);
};
