import { makeSignUpValidation } from './validation';
import { Validation } from '../../../presetation/helpers/validators/validation';
import { ValidationComposite } from '../../../presetation/helpers/validators/composite';
import { ValidationRequiredField } from '../../../presetation/helpers/validators/requiredField';
import { ValidationCompareField } from '../../../presetation/helpers/validators/compareField';

jest.mock('../../../presetation/helpers/validators/composite');

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
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
