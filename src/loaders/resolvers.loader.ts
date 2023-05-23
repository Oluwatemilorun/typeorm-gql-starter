import { asValue } from 'awilix';
import path from 'path';
import glob from 'glob';
import { ClassConstructor, ContainerStore, Loader } from '@shared/types';

/**
 * Registers all resolvers in the resolvers directory
 */
export default <Loader<ClassConstructor<unknown>[]>>function ({ container }) {
  const resolversPath = path.join(__dirname, '../resolvers/*.resolver.{ts,js}');
  const resolvers: ClassConstructor<unknown>[] = [];

  const foundResolvers = glob.sync(resolversPath, { cwd: __dirname });
  foundResolvers.forEach((fn) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loaded = require(fn) as ClassConstructor<unknown>;

    if (loaded) {
      Object.entries(loaded).map(([, val]: [string, ClassConstructor<unknown>]) => {
        if (typeof val === 'function') {
          container.registerStore(ContainerStore.RESOLVERS, asValue(val));
        }

        resolvers.push(val);
      });
    }
  });

  return resolvers;
};
