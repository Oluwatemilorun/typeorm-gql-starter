import { DataSource } from 'typeorm';
import { Config } from '@config';
import { User } from '@models';

class DB {
  public get dataSource(): DataSource {
    return new DataSource({
      type: 'postgres',
      url: Config.DB_URL,
      migrationsRun: true,
      entities: [User],
      migrations: ['./migrations/*.ts'],
    });
  }

  public async init(): Promise<DataSource> {
    return this.dataSource.initialize();
  }
}

export default new DB();
