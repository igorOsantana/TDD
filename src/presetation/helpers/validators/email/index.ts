import { InvalidParamError } from '../../../errors';
import { EmailValidator } from '../../../protocols/emailValidator';
import { Validation } from '../validation';

export class ValidationEmail implements Validation {
  private readonly fieldName: string;
  private readonly emailValidator: EmailValidator;

  constructor(fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName;
    this.emailValidator = emailValidator;
  }

  validate(input: any): Error {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
