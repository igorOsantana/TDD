import { HttpRequest, HttpResponse } from '../../protocols/http';
import { Controller } from '../../protocols/controller';
import { EmailValidator } from '../../protocols/email-validator';

import { MissingParamError, InvalidParamError } from '../../errors';

import { badRequest } from '../../helpers/http';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }
  handle(httpReq: HttpRequest): HttpResponse {
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];
    for (const field of requiredFields) {
      if (!httpReq.body[field]) return badRequest(new MissingParamError(field));
    }

    if (!this.emailValidator.isValid(httpReq.body.email))
      return badRequest(new InvalidParamError('email'));
  }
}
