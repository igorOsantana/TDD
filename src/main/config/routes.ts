import { Express, Router } from 'express';
import fastGloby from 'fast-glob';

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);

  fastGloby
    .sync('**/src/main/routes/**/*.ts', {
      ignore: ['**/src/main/routes/**/*test.ts'],
    })
    .map(async file => (await import(`../../../${file}`)).default(router));
};
