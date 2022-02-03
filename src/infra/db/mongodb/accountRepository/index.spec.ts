import { AccountMongoRepository } from '.';
import { MongoHelper } from '../helpers';

interface SutTypes {
  sut: AccountMongoRepository;
}

const makeSut = (): SutTypes => {
  return {
    sut: new AccountMongoRepository(),
  };
};

describe('Account MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await MongoHelper.getCollection('accounts').deleteMany({});
  });

  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    });
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email@mail.com');
    expect(account.password).toBe('any_password');
  });
});
