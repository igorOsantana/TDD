import env from './config/env';
import { MongoHelper } from '../infra/db/mongodb/helpers';

const URL = env.mongoUrl;
const PORT = env.port;

console.log(`Connecting to ${URL}`);
console.log(`Listening on port ${PORT}`);

MongoHelper.connect(URL)
  .then(async () => {
    const app = (await import('./config/app')).default;
    app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
  })
  .catch(console.error);
