import {
  Authentication,
  AuthenticationModel,
} from '../../../../domain/usecases/authentication';
import { HashComparer } from '../../../protocols/criptography/hashComparer';
import { LoadAccountByEmailRepository } from '../../../protocols/db/loadAccountByEmailRepository';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
  private readonly hashComparer: HashComparer;

  constructor(
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
  }

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    );

    if (account) {
      this.hashComparer.compare(authentication.password, account.password);
    }

    return null;
  }
}
