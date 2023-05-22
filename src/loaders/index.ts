import { asValue } from 'awilix';
import { DataSource } from 'typeorm';
import { Express, NextFunction, Request, Response } from 'express';
import { createAppContainer } from '@shared/container';
import { AppContainer } from '@shared/types';

import modelsLoader from './models.loader';
import databaseLoader from './database.loader';
import repositoriesLoader from './repositories.loader';
import servicesLoader from './services.loader';
import resolversLoader from './resolvers.loader';
import graphqlServerLoader from './graphql-server.loader';

type Options = {
  app: Express;
};

export default async ({
  app,
}: Options): Promise<{ container: AppContainer; db: DataSource }> => {
  const container = createAppContainer();

  modelsLoader({ container });
  const db = await databaseLoader({ container });

  repositoriesLoader({ container });

  container.register({ manager: asValue(db.manager) });
  servicesLoader({ container });

  resolversLoader({ container });
  await graphqlServerLoader({ container, app, db });

  // Add the registered services to the request scope
  app.use((req: Request, res: Response, next: NextFunction) => {
    container.register({ manager: asValue(db.manager) });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).scope = container.createScope();
    next();
  });

  return { container, db };
};
