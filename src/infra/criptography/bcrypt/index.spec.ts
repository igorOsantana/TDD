import bcrypt from 'bcrypt';

import { BcryptAdapter } from '../bcrypt';

const BCRYPT_SALT = 12;

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return Promise.resolve('hash');
  },
  async compare(): Promise<boolean> {
    return Promise.resolve(true);
  },
}));

interface SutTypes {
  sut: BcryptAdapter;
}

const makeSut = (): SutTypes => {
  return {
    sut: new BcryptAdapter(BCRYPT_SALT),
  };
};

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct values', async () => {
    const { sut } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', BCRYPT_SALT);
  });

  test('Should return a valid hash on hash success', async () => {
    const { sut } = makeSut();
    const hash = await sut.hash('any_value');

    expect(hash).toBe('hash');
  });

  test('Should throw if Bcrypt throws', async () => {
    const { sut } = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
      return Promise.reject(new Error());
    });
    const promise = sut.hash('any_value');

    await expect(promise).rejects.toThrow();
  });

  test('Should call compare with correct values', async () => {
    const { sut } = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'any_hash');

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });

  test('Should return true when compare succeeds', async () => {
    const { sut } = makeSut();
    const isValid = await sut.compare('any_value', 'any_hash');

    expect(isValid).toBe(true);
  });

  test('Should return false when compare fails', async () => {
    const { sut } = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => {
      return Promise.resolve(false);
    });
    const isValid = await sut.compare('any_value', 'any_hash');

    expect(isValid).toBe(false);
  });
});
