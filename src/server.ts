import dotenv from 'dotenv';
dotenv.config();

import { validateEnv } from './config/validateEnv';
import { buildApp } from './app';

validateEnv([
  'PORT',
  'DATABASE_URL',
  'MAIL_HOST',
  'MAIL_PORT',
  'MAIL_FROM_NAME',
  'MAIL_FROM_EMAIL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
]);

const app = buildApp();

app.listen({ port: Number(process.env.PORT) || 4000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info('Server running at ' + address);
});