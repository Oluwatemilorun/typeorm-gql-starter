import 'express-async-errors';

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import createError from 'http-errors';
import express, { Express } from 'express';
import health from 'express-ping';
import requestIp from 'request-ip';
import { NOT_FOUND } from 'http-status-codes';

import SetupV1Router from '@routes/v1';
import { Config } from '@config';
import { ErrorHandler } from '@shared/functions';
import { Constants } from '@shared/constants';
import { SetupGraphqlServer } from '@graphql';

const CreateServer = async (): Promise<Express> => {
  // Init express
  const app = express();

  // Set basic express settings
  app.use(
    cors({
      origin: true, // ['http://localhost'],
      optionsSuccessStatus: 200,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser(Config.COOKIE_SECRET));
  app.use(health.ping('/health'));

  // Show routes called in console during development
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Security
  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
    // Retrieve a request's IP address using the `constants.CLIENT_IP_ADDRESS_ATTRIBUTE`
    app.use(requestIp.mw({ attributeName: Constants.REQUEST_ATTRIBUTES.IP_ADDRESS }));
  }

  // Add APIs
  SetupV1Router(app);
  await SetupGraphqlServer(app);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(createError(NOT_FOUND));
  });

  // handle errors
  app.use(ErrorHandler);

  //  TODO: Add favicon.

  return app;
};

export default CreateServer;
