import { asValue } from 'awilix';
import path from 'path';
import glob from 'glob';
import { Loader } from '@shared/types';
import { formatRegistrationName } from '@shared/functions';

/**
 * Registers all repositories in the repositories directory
 */
export default <Loader<void>>function ({ container }) {
  const repositoriesPath = path.join(__dirname, '../repositories/*.repository.{ts,js}');

  const foundRepositories = glob.sync(repositoriesPath, { cwd: __dirname });
  foundRepositories.forEach((fn) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loaded = require(fn).default;

    if (typeof loaded === 'object') {
      const name = formatRegistrationName(fn);
      container.register({
        [name]: asValue(loaded),
      });
    }
  });
};
