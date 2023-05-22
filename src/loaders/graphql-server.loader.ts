import { asValue } from 'awilix';
import { Express } from 'express';
import { DataSource } from 'typeorm';
import { ArgumentValidationError, buildSchema } from 'type-graphql';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { ApolloContext, AppContainer, ContainerStore, Loader } from '@shared/types';
import { Constants } from '@shared/constants';
import { BadRequestError } from '@shared/errors';
import { queryComplexityPlugin } from '@shared/functions';

type Opt = {
  app: Express;
  db: DataSource;
};

export default <Loader<void, Opt>>async function ({ container, app, db }) {
  const resolvers = container.resolve(ContainerStore.RESOLVERS);

  const schema = await buildSchema({
    resolvers,
    validate: {
      forbidUnknownValues: true,
    },
    globalMiddlewares: [
      async ({}, next): Promise<void> => {
        try {
          return await next();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          if (
            err instanceof ArgumentValidationError ||
            (err.message &&
              (err.message as string).toLowerCase().includes('validation error'))
          ) {
            throw new BadRequestError(err);
          }
        }
      },
    ],
  });

  const server = new ApolloServer<ApolloContext>({
    schema,
    plugins: [queryComplexityPlugin(schema)],
    // playground: process.env.NODE_ENV === 'development' ? true : false,
    // introspection: true,
    // tracing: true,
    // uploads: false,
  });

  await server.start();

  app.use(
    '/gq',
    expressMiddleware(server, {
      context: async ({ req }) => {
        container.register({ manager: asValue(db.manager) });
        return {
          // Inject the registered services into the apollo graphql server context
          scope: container.createScope() as AppContainer,
          // Inject the client remote address into the apollo graphql server context
          remoteAddress:
            (req as unknown as Record<string, string>)[
              Constants.REQUEST_ATTRIBUTES.IP_ADDRESS
            ] || 'localhost',
        };
      },
    }),
  );
};
