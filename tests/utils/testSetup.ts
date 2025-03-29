import { buildApp } from '../../src/app';
import { resetTestDatabase } from '../utils/testSeeds';

let appInstance: any;
let users: any;

export async function setupTestApp() {
  if (!appInstance) {
    users = await resetTestDatabase();
    appInstance = buildApp();
    await appInstance.ready();
  }
  return { app: appInstance, users };
}

export async function closeTestApp() {
  if (appInstance) {
    await appInstance.close();
    appInstance = undefined;
  }
}
