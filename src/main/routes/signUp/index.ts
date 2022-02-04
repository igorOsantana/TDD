import { Router } from 'express';
import { makeSignUpController } from '../../factories/signUp';
import { adapterRoute } from '../../adapters/express/routes';

export default (router: Router): void => {
  router.post('/sign-up', adapterRoute(makeSignUpController()));
};
