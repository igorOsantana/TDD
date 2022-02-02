import { EmailValidator } from '../../presetation/protocols/emailValidator';

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return false;
  }
}
