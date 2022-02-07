import { LogControllerDecorator } from '.';
import { LogErrorRepository } from '../../../data/protocols';

import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../../presetation/protocols';
import { internalServerError } from '../../../presetation/helpers/http';

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(req: HttpRequest): Promise<HttpResponse> {
      const httpRes = {
        statusCode: 200,
        body: {
          name: 'any_name',
          email: 'any_mail@mail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password',
        },
      };
      return Promise.resolve(httpRes);
    }
  }
  return new ControllerStub();
};

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return new Promise(resolve => resolve(null));
    }
  }
  return new LogErrorRepositoryStub();
};

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub();
  const logErrorRepositoryStub = makeLogErrorRepository();
  return {
    sut: new LogControllerDecorator(controllerStub, logErrorRepositoryStub),
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe('Log Controller Decorator', () => {
  test('Should call controller handle method', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const httpReq = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    await sut.handle(httpReq);
    expect(handleSpy).toHaveBeenCalledWith(httpReq);
  });

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut();
    const httpReq = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpRes = await sut.handle(httpReq);
    expect(httpRes).toEqual({
      statusCode: 200,
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    });
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = 'any_stack';

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(internalServerError(fakeError)));

    const httpReq = {
      body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    await sut.handle(httpReq);
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
