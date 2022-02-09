import { AddAccountRepository } from '../../../../data/protocols/db/addAccountRepository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/addAccount';
import { MongoHelper } from '../helpers';

export class AccountMongoRepository implements AddAccountRepository {
  async add(data: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const { insertedId } = await accountCollection.insertOne(data);

    const findAccount = insertedId
      ? await accountCollection.findOne({ _id: insertedId })
      : null;

    if (findAccount === null) return null;

    return MongoHelper.map<AccountModel>(findAccount);
  }
}
