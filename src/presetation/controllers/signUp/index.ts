import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
} from '../../protocols';

import { MissingParamError, InvalidParamError } from '../../errors';

import { badRequest, internalServerError } from '../../helpers/http';
import { AddAccount } from '../../../domain/usecases/add-account';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }
  handle(httpReq: HttpRequest): HttpResponse {
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];
    try {
      for (const field of requiredFields) {
        if (!httpReq.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { name, email, password, passwordConfirmation } = httpReq.body;

      if (password.length < 6) {
        return badRequest(new InvalidParamError('password'));
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'));
      }

      this.addAccount.add({ name, email, password });
    } catch (error) {
      console.error('sign_up_controller_handle_error: ', error);
      return internalServerError();
    }
  }
}
