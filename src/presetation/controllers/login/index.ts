import { InvalidParamError, MissingParamError } from '../../errors';

import {
  badRequest,
  internalServerError,
  unauthorized,
} from '../../helpers/http';

import {
  EmailValidator,
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
} from './protocol';

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

      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) return unauthorized();

      return Promise.resolve(null);
    } catch (error) {
      return internalServerError(error);
    }
  }
}
