import { HttpRequest, HttpResponse } from './http';

export interface Controller {
  handle(httpReq: HttpRequest): HttpResponse;
}
