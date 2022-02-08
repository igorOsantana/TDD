import { ValidationComposite } from '.';
import { InvalidParamError } from '../../../errors';
import { Validation } from '../validation';

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: Validation[];
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidationStub(), makeValidationStub()];
  return {
    sut: new ValidationComposite(validationStubs),
    validationStubs,
  };
};

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

describe('Composite Validation', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new InvalidParamError('field'));
    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new InvalidParamError('field'));
  });

  test('Should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new InvalidParamError('field'));

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new Error());
  });
});
