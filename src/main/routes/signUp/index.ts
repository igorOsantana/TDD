import { Router } from 'express';

export default (router: Router): void => {
  router.post('/sign-up', async (_req, res) => {
    res.send({ ok: 'ok' });
  });
};
