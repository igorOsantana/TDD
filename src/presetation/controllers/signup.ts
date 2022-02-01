import { MissingParamError } from '../errors/missing-param';
import { HttpRequest, HttpResponse } from '../protocols/http';
import { badRequest } from '../helpers/http-helper';

export class SignUpController {
  handle(httpReq: HttpRequest): HttpResponse {
    if (!httpReq.body.name) {
      return badRequest(new MissingParamError('name'));
    }
    if (!httpReq.body.email) {
      return badRequest(new MissingParamError('email'));
    }
  }
}
