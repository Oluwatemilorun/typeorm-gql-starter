import 'express-async-errors';

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import createError from 'http-errors';
import express from 'express';
import health from 'express-ping';
import { NOT_FOUND } from 'http-status-codes';

import SetupV1Router from '@routes/v1';
import { Config } from '@config';
import { APP_NAME } from '@shared/constants';
import { ErrorHandler } from '@shared/functions';

// Init express
const app = express();

// Set basic express settings
app.use(
	cors({
		origin: true, // ['http://localhost'],
		optionsSuccessStatus: 200,
		credentials: true,
	})
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
}

// Add APIs
SetupV1Router(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(NOT_FOUND));
});

// handle errors
app.use(ErrorHandler);

//  TODO: Add favicon.

// Export express instance
export default app;
