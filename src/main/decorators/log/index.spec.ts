import { LogControllerDecorator } from '.';
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../../presetation/protocols';

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(req: HttpRequest): Promise<HttpResponse> {
      return {
        statusCode: 200,
        body: {
          name: 'any_name',
          email: 'any_mail@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password',
        },
      };
    }
  }
  return new ControllerStub();
};

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub();
  return {
    sut: new LogControllerDecorator(controllerStub),
    controllerStub,
  };
};

describe('Log Controller Decorator', () => {
  test('Should call controller handle method', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const httpRes = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    await sut.handle(httpRes);
    expect(handleSpy).toHaveBeenCalledWith(httpRes);
  });
});
