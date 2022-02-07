import { Authentication } from '../../../domain/usecases/authentication';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, internalServerError } from '../../helpers/http';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../../protocols/emailValidator';

export class Login implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly authentication: Authentication;

  constructor(emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password'];
    try {
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { email, password } = req.body;

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'));
      }

      await this.authentication.auth(email, password);

      return Promise.resolve(null);
    } catch (error) {
      return internalServerError(error);
    }
  }
}
