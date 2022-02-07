import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../../protocols/emailValidator';

export class Login implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const { email, password } = req.body;

    if (!email) {
      return badRequest(new MissingParamError('email'));
    }
    if (!password) {
      return badRequest(new MissingParamError('password'));
    }
    if (!this.emailValidator.isValid(email)) {
      return badRequest(new InvalidParamError('email'));
    }

    return Promise.resolve(null);
  }
}
