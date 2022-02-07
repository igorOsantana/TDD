import { SignUpController } from '../../../presetation/controllers/signUp';
import { EmailValidatorAdapter } from '../../../utils/emailValidatorAdapter';
import { DbAddAccount } from '../../../data/usecases/addAccount/dbAddAccount';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt';
import { AccountMongoRepository } from '../../../infra/db/mongodb/accountRepository';
import { LogMongoRepository } from '../../../infra/db/mongodb/logRepository';
import { LogControllerDecorator } from '../../decorators/log';
import { Controller } from '../../../presetation/protocols';
import { makeSignUpValidation } from './validation';

export const makeSignUpController = (): Controller => {
  const SALT = 12;

  const bcryptAdapter = new BcryptAdapter(SALT);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const emailValidatorAdapter = new EmailValidatorAdapter();

  const signUpController = new SignUpController(
    emailValidatorAdapter,
    dbAddAccount,
    makeSignUpValidation()
  );
  const logMongoRepository = new LogMongoRepository();

  return new LogControllerDecorator(signUpController, logMongoRepository);
};
