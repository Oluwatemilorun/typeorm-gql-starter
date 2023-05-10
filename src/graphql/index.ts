import { Express } from 'express';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

import { ApolloContext } from '@/shared/types';
import { Constants } from '@/shared/constants';

import { queryComplexityPlugin } from './plugins/queryComplexity';
import Resolvers from './resolvers';

export const SetupGraphqlServer = async (app: Express): Promise<void> => {
  const schema = await buildSchema({
    resolvers: Resolvers,
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
        return {
          remoteAddress:
            (req as unknown as Record<string, string>)[
              Constants.REQUEST_ATTRIBUTES.IP_ADDRESS
            ] || 'localhost',
        };
      },
    }),
  );
};
