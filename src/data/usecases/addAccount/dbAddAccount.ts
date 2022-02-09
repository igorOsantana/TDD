import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
  Hasher,
} from './dbAddAccountProtocols';
export class DbAddAccount implements AddAccount {
  private readonly hasher: Hasher;
  private readonly addAccountRepository: AddAccountRepository;

  constructor(hasher: Hasher, addAccountRepository: AddAccountRepository) {
    this.hasher = hasher;
    this.addAccountRepository = addAccountRepository;
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password);
    const accountAdded = await this.addAccountRepository.add({
      ...account,
      password: hashedPassword,
    });
    return accountAdded;
  }
}
