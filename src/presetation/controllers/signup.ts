import { HttpRequest, HttpResponse } from '../protocols/http';

export class SignUpController {
  handle(httpReq: HttpRequest): HttpResponse {
    if (!httpReq.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing "name" in request body'),
      };
    }

    if (!httpReq.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing "email" in request body'),
      };
    }
  }
}
