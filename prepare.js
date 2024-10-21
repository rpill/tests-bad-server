import fs from 'fs';
import { acquireAccount } from './src/utils.js';

(async () => {
  const [admin, user] = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
  await Promise.all([
    acquireAccount(admin.email, admin.password),
    acquireAccount(user.email, user.password),
  ]);
})();
