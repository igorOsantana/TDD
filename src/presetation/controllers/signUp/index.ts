import { badRequest, internalServerError, ok } from '../../helpers/http';

import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
  Validation,
} from './protocol';
export class SignUpController implements Controller {
  private readonly addAccount: AddAccount;
  private readonly validation: Validation;

  constructor(addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount;
    this.validation = validation;
  }

  async handle(httpReq: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpReq.body);
      if (error) return badRequest(error);

      const { name, email, password } = httpReq.body;

      const account = await this.addAccount.add({ name, email, password });
      return ok(account);
    } catch (error) {
      return internalServerError(error);
    }
  }
}
