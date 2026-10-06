import { appDatabase } from '../src/db/index';
import { runAppMigrations } from '../src/db/migrations';
import { runSeed } from '../src/db/seed';

const applied = await runAppMigrations();
console.log('migrations applied:', applied);
await runSeed();
const users = await appDatabase.sql`SELECT id, username, full_name, home_path FROM "user"`;
console.log('users:', JSON.stringify(users.rows));
const menus = await appDatabase.sql`SELECT count(*) AS c FROM menu`;
console.log('menus:', JSON.stringify(menus.rows));
const perms = await appDatabase.sql`SELECT count(*) AS c FROM permission`;
console.log('perms:', JSON.stringify(perms.rows));
await appDatabase.close();
console.log('OK');
