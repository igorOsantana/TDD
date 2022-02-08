import { ValidationRequiredField } from '.';
import { MissingParamError } from '../../../errors';

interface SutTypes {
  sut: ValidationRequiredField;
}

const makeSut = (): SutTypes => {
  return {
    sut: new ValidationRequiredField('any_field'),
  };
};

describe('Required Field Validationn', () => {
  test('Should return MissingParamError if validation fails', () => {
    const { sut } = makeSut();
    const error = sut.validate({});

    expect(error).toEqual(new MissingParamError('any_field'));
  });

  test('Should return falsy value on success validation', () => {
    const { sut } = makeSut();
    const error = sut.validate({ any_field: 'any_value' });

    expect(error).toBeFalsy();
  });
});
