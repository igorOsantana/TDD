import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../../protocols/emailValidator';

export class Login implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    if (!req.body.email) {
      return badRequest(new MissingParamError('email'));
    }
    if (!req.body.password) {
      return badRequest(new MissingParamError('password'));
    }
    this.emailValidator.isValid(req.body.email);

    return Promise.resolve(null);
  }
}
