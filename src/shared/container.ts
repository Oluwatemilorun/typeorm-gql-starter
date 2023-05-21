import {
  AwilixContainer,
  ClassOrFunctionReturning,
  Resolver,
  asFunction,
  asValue,
  createContainer,
} from 'awilix';
import { AppContainer, ContainerStore } from './types';

function asArray(resolvers: (ClassOrFunctionReturning<unknown> | Resolver<unknown>)[]): {
  resolve: (container: AwilixContainer) => unknown[];
} {
  return {
    resolve: (container: AwilixContainer) =>
      resolvers.map((resolver) => container.build(resolver)),
  };
}

function registerStore(
  this: AppContainer,
  name: ContainerStore,
  registration: typeof asFunction | typeof asValue,
): AppContainer {
  const storeKey = name + '_STORE';

  if (this.registrations[storeKey] === undefined) {
    this.register(storeKey, asValue([] as Resolver<unknown>[]));
  }
  const store = this.resolve(storeKey) as (
    | ClassOrFunctionReturning<unknown>
    | Resolver<unknown>
  )[];

  if (this.registrations[name] === undefined) {
    this.register(name, asArray(store));
  }
  store.unshift(registration);

  return this;
}

export function createAppContainer(...args: []): AppContainer {
  const container = createContainer(...args) as AppContainer;

  (container.registerStore as unknown) = registerStore.bind(container);

  const originalScope = container.createScope;
  container.createScope = (): AppContainer => {
    const scoped = originalScope() as AppContainer;
    (scoped.registerStore as unknown) = registerStore.bind(scoped);

    return scoped;
  };

  return container;
}
