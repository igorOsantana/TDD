import { AddAccountRepository } from '../../../../data/protocols/addAccountRepository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/addAccount';
import { MongoHelper } from '../helpers';

export class AccountMongoRepository implements AddAccountRepository {
  async add(data: AddAccountModel): Promise<AccountModel> {
    const { insertedId } = await MongoHelper.getCollection(
      'accounts'
    ).insertOne(data);

    const findAccount = insertedId
      ? await MongoHelper.getCollection('accounts').findOne({ _id: insertedId })
      : null;

    if (findAccount === null) return null;

    const { _id, ...account } = findAccount;
    return { id: String(_id), ...(account as AccountModel) };
  }
}
