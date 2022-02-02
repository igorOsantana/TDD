import { Encrypter } from '../../protocols';
import { DbAddAccount } from './dbAddAccount';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'));
    }
  }
  return new EncrypterStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  return {
    sut: new DbAddAccount(encrypterStub),
    encrypterStub,
  };
};

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const account = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };
    await sut.add(account);
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(async () => {
      return new Promise((_, reject) => reject(new Error()));
    });
    const account = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    };
    const promise = sut.add(account);
    await expect(promise).rejects.toThrow();
  });

  // test('Should returns 500 if Encrypter throws', async () => {
  //   const { sut, encrypterStub } = makeSut();
  //   jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(async () => {
  //     return new Promise((_, reject) => reject(new Error()));
  //   });
  //   const account = {
  //     name: 'valid_name',
  //     email: 'valid_email@mail.com',
  //     password: 'valid_password',
  //   };
  //   const httpRes = await sut.add(account);
  //   expect(httpRes.statusCode).toBe(500);

  // });
});
