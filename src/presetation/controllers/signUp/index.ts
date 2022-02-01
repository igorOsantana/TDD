import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
} from '../../protocols';

import { MissingParamError, InvalidParamError } from '../../errors';

import { badRequest, internalServerError } from '../../helpers/http';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }
  handle(httpReq: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];
      for (const field of requiredFields) {
        if (!httpReq.body[field])
          return badRequest(new MissingParamError(field));
      }

      if (!this.emailValidator.isValid(httpReq.body.email))
        return badRequest(new InvalidParamError('email'));
    } catch (error) {
      console.error('sign_up_controller_handle_error: ', error);
      return internalServerError();
    }
  }
}
