import dropTables from './dropTables';
import init from './init';

export default async (testDb?: boolean) => {
  await dropTables(testDb);
  await init(testDb);
};
