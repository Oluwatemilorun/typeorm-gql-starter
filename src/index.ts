import 'reflect-metadata';
import '@shared/types/modules';

import { Config } from '@config';
import { Constants } from '@shared/constants';
import { GracefulShutdownServer } from '@shared/functions';
import logger from '@shared/logger';
import loaders from '@loaders';
import CreateServer from '@server';

process.on('unhandledRejection', function (reason, p) {
  logger.warn('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

(async (): Promise<void> => {
  async function start(): Promise<void> {
    const app = await CreateServer();

    try {
      const { db } = await loaders({ app });
      const port = Number(Config.PORT);

      const server = GracefulShutdownServer.create(
        app.listen(port, () => {
          logger.info(`
  ------------
  🚀 ${Constants.APP_NAME} Server Started!

  URL: http://localhost:${port}
  Health: http://localhost:${port}/health
  API Doc: http://localhost:${port}/api-docs
  ------------
              `);
        }),
      );

      // Handle graceful shutdown of database and server
      const gracefulShutDown = (): void => {
        Promise.all([db.destroy(), server.shutdown()])
          .then(() => {
            logger.info('Gracefully stopping the server.');
            process.exit(0);
          })
          .catch((e) => {
            logger.error('Error received when shutting down the server.', e);
            process.exit(1);
          });
      };

      process.on('SIGTERM', gracefulShutDown);
      process.on('SIGINT', gracefulShutDown);
    } catch (err) {
      logger.error('Error starting server', err);
      process.exit(1);
    }
  }

  await start();
})();
