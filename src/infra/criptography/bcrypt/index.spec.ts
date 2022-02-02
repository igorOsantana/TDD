import bcrypt from 'bcrypt';

import { BcryptAdapter } from '../bcrypt';

const BCRYPT_SALT = 12;

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
});
