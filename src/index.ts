import 'reflect-metadata';
import '@shared/types/modules';

import { Config } from '@config';
import { APP_NAME } from '@shared/constants';
import { DB } from '@db';
import logger from '@shared/logger';
import app from '@server';

process.on('unhandledRejection', function (reason, p) {
	logger.warn('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

// Connect to DB
DB.init()
	.then(() => {
		// Start the server
		const port = Number(Config.PORT);

		app.listen(port, () => {
			logger.info(`
	------------
	${APP_NAME} Server Started!

	URL: http://localhost:${port}
	Health: http://localhost:${port}/health
	API Doc: http://localhost:${port}/api-docs
	------------
			`);
		});
	})
	.catch((err) => {
		logger.error(err);
	});
