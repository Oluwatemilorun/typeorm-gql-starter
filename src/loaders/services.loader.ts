import glob from 'glob';
import path from 'path';
import { asFunction } from 'awilix';
import { Loader } from '@shared/types';
import { formatRegistrationName } from '@shared/functions';

/**
 * Registers all services in the services directory
 */
export default <Loader<void>>function ({ container }) {
  const servicesPath = path.join(__dirname, '../services/*.service.{ts,js}');
  const foundServices = glob.sync(servicesPath, {
    cwd: __dirname,
  });

  foundServices.forEach((fn) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loaded = require(fn).default;
    if (loaded) {
      const name = formatRegistrationName(fn);
      container.register({
        [name]: asFunction((cradle) => new loaded(cradle)).singleton(),
      });
    }
  });
};
