import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  AddAccount,
} from './protocol';
import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, internalServerError, ok } from '../../helpers/http';
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;

  constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }
  async handle(httpReq: HttpRequest): Promise<HttpResponse> {
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

      const account = await this.addAccount.add({ name, email, password });
      return ok(account);
    } catch (error) {
      console.error('sign_up_controller_handle_error: ', error);
      return internalServerError();
    }
  }
}
