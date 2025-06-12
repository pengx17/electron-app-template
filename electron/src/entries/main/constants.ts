import { join } from 'node:path';

export const mainHost = '.';
export const anotherHost = 'another-host';

export const mainWindowOrigin =
  process.env.DEV_SERVER_URL || `file://${mainHost}`;
export const anotherOrigin = `file://${anotherHost}`;

// Resources path
export const resourcesPath = join(__dirname, `../resources`);
