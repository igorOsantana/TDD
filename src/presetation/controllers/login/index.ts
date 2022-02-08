import {
  badRequest,
  internalServerError,
  unauthorized,
  ok,
} from '../../helpers/http';

import {
  Authentication,
  Controller,
  HttpRequest,
  HttpResponse,
  Validation,
} from './protocol';

export class Login implements Controller {
  private readonly authentication: Authentication;
  private readonly validation: Validation;

  constructor(authentication: Authentication, validation: Validation) {
    this.authentication = authentication;
    this.validation = validation;
  }

  async handle(req: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(req.body);
      if (error) return badRequest(error);

      const { email, password } = req.body;

      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) return unauthorized();

      return ok({ accessToken });
    } catch (error) {
      return internalServerError(error);
    }
  }
}
