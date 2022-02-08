import { ValidationCompareField } from '.';
import { InvalidParamError } from '../../../errors';

interface SutTypes {
  sut: ValidationCompareField;
}

const makeSut = (): SutTypes => {
  return {
    sut: new ValidationCompareField('any_field', 'any_field_to_compare'),
  };
};

describe('Compare Field Validation', () => {
  test('Should return InvalidParamError if validation fails', () => {
    const { sut } = makeSut();
    const error = sut.validate({
      any_field: 'any_value',
      any_field_to_compare: 'other_value',
    });

    expect(error).toEqual(new InvalidParamError('any_field_to_compare'));
  });
});
