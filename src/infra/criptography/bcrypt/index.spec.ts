import bcrypt from 'bcrypt';

import { BcryptAdapter } from '../bcrypt';

const BCRYPT_SALT = 12;

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hash'));
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
  test('Should call bcrypt with correct values', async () => {
    const { sut } = makeSut();
    const hashspy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashspy).toHaveBeenCalledWith('any_value', BCRYPT_SALT);
  });

  test('Should return a hash on success', async () => {
    const { sut } = makeSut();
    const hash = await sut.encrypt('any_value');
    expect(hash).toBe('hash');
  });
});
