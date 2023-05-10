import 'reflect-metadata';
import '@shared/types/modules';

import { Config } from '@config';
import { Constants } from '@shared/constants';
import { DB } from '@db';
import logger from '@shared/logger';
import CreateServer from '@server';

process.on('unhandledRejection', function (reason, p) {
  logger.warn('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

// Connect to DB
DB.init()
  .then(async (source) => {
    // Start the server
    const app = await CreateServer();
    const port = Number(Config.PORT);

    const server = app.listen(port, () => {
      logger.info(`
	------------
	🚀 ${Constants.APP_NAME} Server Started!

	URL: http://localhost:${port}
	Health: http://localhost:${port}/health
	API Doc: http://localhost:${port}/api-docs
	------------
			`);
    });

    // Handle graceful shutdown
    const gracefulShutDown = (): void => {
      server.close((err) => {
        if (err) {
          logger.error('Error received when shutting down the server.', err);
          process.exit(1);
        }

        // Close the connection with the database
        source
          .destroy()
          .then(() => logger.info('Gracefully stopping the DB'))
          .catch((e) => logger.error('Error received when shutting down the DB', e));

        logger.info('Gracefully stopping the server.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutDown);
    process.on('SIGINT', gracefulShutDown);
  })
  .catch((err) => {
    console.log(err);
    logger.error(err);
  });
