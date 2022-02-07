import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  AddAccount,
} from './protocol';
import { InvalidParamError } from '../../errors';
import { badRequest, internalServerError, ok } from '../../helpers/http';
import { Validation } from '../../helpers/validators/validation';
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;
  private readonly validation: Validation;

  constructor(
    emailValidator: EmailValidator,
    addAccount: AddAccount,
    validation: Validation
  ) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
    this.validation = validation;
  }

  async handle(httpReq: HttpRequest): Promise<HttpResponse> {
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];
    try {
      const error = this.validation.validate(httpReq.body);
      if (error) {
        return badRequest(error);
      }
      const { name, email, password, passwordConfirmation } = httpReq.body;

      if (password.length < 6) {
        return badRequest(new InvalidParamError('password'));
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = await this.addAccount.add({ name, email, password });
      return ok(account);
    } catch (error) {
      console.error('sign_up_controller_handle_error: ', error);
      return internalServerError(error);
    }
  }
}
