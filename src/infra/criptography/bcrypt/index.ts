import bcrypt from 'bcrypt';

import { Encrypter } from '../../../data/protocols/encrypter';

export class BcryptAdapter implements Encrypter {
  private readonly salt: number = 12;

  constructor(salt: number) {
    this.salt = salt;
  }

  async encrypt(value: string): Promise<string> {
    return bcrypt.hash(value, this.salt);
  }
}
