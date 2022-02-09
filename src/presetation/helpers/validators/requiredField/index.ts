import { MissingParamError } from '../../../errors';
import { Validation } from '../../../protocols';

export class ValidationRequiredField implements Validation {
  private readonly fieldName: string;

  constructor(fieldName: string) {
    this.fieldName = fieldName;
  }

  validate(input: any): Error {
    if (!input[this.fieldName]) return new MissingParamError(this.fieldName);
  }
}
