import { DbAuthentication } from '.';
import { AccountModel } from '../../../../domain/models/account';
import { AuthenticationModel } from '../../../../domain/usecases/authentication';
import { HashComparer } from '../../../protocols/criptography/hashComparer';
import { TokenGenerator } from '../../../protocols/criptography/tokenGenerator';
import { LoadAccountByEmailRepository } from '../../../protocols/db/loadAccountByEmailRepository';
import { UpdateAccessTokenRepository } from '../../../protocols/db/updateAccessTokenRepository';

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
});

const makeFakeAuthetication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async load(email: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true);
    }
  }
  return new HashComparerStub();
};

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(accountId: string): Promise<string> {
      return Promise.resolve('any_token');
    }
  }
  return new TokenGeneratorStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      return Promise.resolve(null);
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashComparerStub = makeHashComparer();
  const tokenGeneratorStub = makeTokenGenerator();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    await sut.auth(makeFakeAuthetication());

    expect(loadSpy).toHaveBeenCalledWith(makeFakeAuthetication().email);
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.auth(makeFakeAuthetication());

    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(null);

    const accessToken = await sut.auth(makeFakeAuthetication());

    expect(accessToken).toBeNull();
  });

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const loadSpy = jest.spyOn(hashComparerStub, 'compare');

    await sut.auth(makeFakeAuthetication());

    expect(loadSpy).toHaveBeenCalledWith(
      makeFakeAuthetication().password,
      makeFakeAccount().password
    );
  });

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.auth(makeFakeAuthetication());

    await expect(promise).rejects.toThrow();
  });

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false));

    const accessToken = await sut.auth(makeFakeAuthetication());

    expect(accessToken).toBeNull();
  });

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');

    await sut.auth(makeFakeAuthetication());

    expect(generateSpy).toHaveBeenCalledWith(makeFakeAccount().id);
  });

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest
      .spyOn(tokenGeneratorStub, 'generate')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.auth(makeFakeAuthetication());

    await expect(promise).rejects.toThrow();
  });

  test('Should return a token on success', async () => {
    const { sut } = makeSut();

    const accessToken = await sut.auth(makeFakeAuthetication());

    expect(accessToken).toBe('any_token');
  });

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update');

    await sut.auth(makeFakeAuthetication());

    expect(updateSpy).toHaveBeenCalledWith(makeFakeAccount().id, 'any_token');
  });

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'update')
      .mockReturnValueOnce(Promise.reject(new Error()));

    const promise = sut.auth(makeFakeAuthetication());

    await expect(promise).rejects.toThrow();
  });
});
