import fs from 'fs';
import { acquireAccount, delay } from './src/utils.js';

(async () => {
  const [admin, user] = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
  await acquireAccount(admin.email, admin.password)
  await delay(3000)
  await acquireAccount(user.email, user.password)
})();
