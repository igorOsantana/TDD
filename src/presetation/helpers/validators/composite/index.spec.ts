import { ValidationComposite } from '.';
import { InvalidParamError } from '../../../errors';
import { Validation } from '../validation';

interface SutTypes {
  sut: ValidationComposite;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub();
  return {
    sut: new ValidationComposite([validationStub]),
    validationStub,
  };
};

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return new InvalidParamError('field');
    }
  }

  return new ValidationStub();
};

describe('Composite Validation', () => {
  test('Should return an error if any validation fails', () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new InvalidParamError('field'));
  });
});
