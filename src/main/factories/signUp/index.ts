import { SignUpController } from '../../../presetation/controllers/signUp';
import { EmailValidatorAdapter } from '../../../utils/emailValidatorAdapter';
import { DbAddAccount } from '../../../data/usecases/addAccount/dbAddAccount';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt';
import { AccountMongoRepository } from '../../../infra/db/mongodb/accountRepository';

export const makeSignUpController = (): SignUpController => {
  const SALT = 12;

  const bcryptAdapter = new BcryptAdapter(SALT);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const emailValidatorAdapter = new EmailValidatorAdapter();

  return new SignUpController(emailValidatorAdapter, dbAddAccount);
};
