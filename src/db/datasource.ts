import { DataSource } from 'typeorm';
import { Config } from '../config';

const datasource = new DataSource({
  type: 'postgres',
  url: Config.DB_URL,
  entities: ['src/models/*.model.{js,ts}'],
  migrations: ['src/db/migrations/*.{js,ts}'],
});

export default datasource;
