import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Config } from '../config';

const datasource = new DataSource({
  type: 'postgres',
  url: Config.DB_URL,
  entities: ['src/models/*.model.{js,ts}'],
  migrations: ['src/db/migrations/*.{js,ts}'],
  namingStrategy: new SnakeNamingStrategy(),
});

export default datasource;
