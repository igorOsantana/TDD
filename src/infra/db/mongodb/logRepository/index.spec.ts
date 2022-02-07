import { Collection } from 'mongodb';
import { LogMongoRepository } from '.';
import { MongoHelper } from '../helpers';

interface SutTypes {
  sut: LogMongoRepository;
}

const makeSut = (): SutTypes => {
  return {
    sut: new LogMongoRepository(),
  };
};

describe('Log MongoDB Repository', () => {
  let errorCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });

  test('Should create an error log on success', async () => {
    const { sut } = makeSut();
    await sut.logError('any_error');
    const count = await errorCollection.countDocuments();

    expect(count).toBe(1);
  });
});
