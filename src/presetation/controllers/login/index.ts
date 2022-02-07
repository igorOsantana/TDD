import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';

export class Login implements Controller {
  async handle(req: HttpRequest): Promise<HttpResponse> {
    if (!req.body.email) {
      return badRequest(new MissingParamError('email'));
    }
    if (!req.body.password) {
      return badRequest(new MissingParamError('password'));
    }
    return Promise.resolve(null);
  }
}
