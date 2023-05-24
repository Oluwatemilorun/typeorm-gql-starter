import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Config } from '@config';
import { ContainerStore, Loader } from '@/shared/types';

export let db: DataSource;

export default <Loader<DataSource>>async function ({ container }) {
  const entities = container.resolve(ContainerStore.DB_ENTITIES);

  db = new DataSource({
    type: 'postgres',
    url: Config.DB_URL,
    migrationsRun: true,
    entities,
    namingStrategy: new SnakeNamingStrategy(),
  });

  try {
    await db.initialize();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // database name does not exist
    if (err.code === '3D000') {
      throw new Error(
        `Specified database does not exist. Please create it and try again.\n${err.message}`,
      );
    }

    throw err;
  }

  return db;
};
