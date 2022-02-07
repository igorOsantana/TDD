import { Login } from '.';
import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http';

interface SutTypes {
  sut: Login;
}

const makeSut = (): SutTypes => {
  return { sut: new Login() };
};

describe('Login Controller', () => {
  test('Should return 400 if email is not provided by request body', async () => {
    const { sut } = makeSut();
    const HttpRequest = {
      body: {
        password: 'any_password',
      },
    };
    const httpRes = await sut.handle(HttpRequest);
    expect(httpRes).toEqual(badRequest(new MissingParamError('email')));
  });
});
