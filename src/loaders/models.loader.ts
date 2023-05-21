import glob from 'glob';
import path from 'path';
import { asClass, asValue } from 'awilix';
import { EntitySchema } from 'typeorm';
import { ClassConstructor, ContainerStore, Loader, Model } from '@shared/types';
import { formatRegistrationName } from '@shared/functions';

/**
 * Registers all models in the model directory
 */
export default <Loader<Model[]>>function ({ container }) {
  const modelsPath = path.join(__dirname, '../models/*.model.{ts,js}');
  const models: (ClassConstructor<unknown> | EntitySchema)[] = [];
  const foundModels = glob.sync(modelsPath, {
    cwd: __dirname,
  });

  foundModels.forEach((fn) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const loaded = require(fn) as ClassConstructor<unknown> | EntitySchema;
    if (loaded) {
      Object.entries(loaded).map(
        ([, val]: [string, ClassConstructor<unknown> | EntitySchema]) => {
          if (typeof val === 'function' || val instanceof EntitySchema) {
            const name = formatRegistrationName(fn);
            container.register({
              [name]: asClass(val as ClassConstructor<unknown>),
            });

            container.registerStore(ContainerStore.DB_ENTITIES, asValue(val));
          }

          models.push(val);
        },
      );
    }
  });

  return models;
};
