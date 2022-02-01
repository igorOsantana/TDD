import { MissingParamError } from '../../errors/missing-param';
import { HttpRequest, HttpResponse } from '../../protocols/http';
import { badRequest } from '../../helpers/http';

export class SignUpController {
  handle(httpReq: HttpRequest): HttpResponse {
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation',
    ];
    for (const field of requiredFields) {
      if (!httpReq.body[field]) return badRequest(new MissingParamError(field));
    }
  }
}
