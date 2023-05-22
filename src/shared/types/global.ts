import type { AwilixContainer } from 'awilix';
import { EntitySchema } from 'typeorm';

export interface ApolloContext {
  remoteAddress: string;
  scope: AppContainer;
}

export interface PaginationOptions {
  limit: number;
  page: number;
}

export interface PaginationResult<D> {
  limit: number;
  page: number;
  totalPages: number;
  items: D[];
}

export enum ContainerStore {
  DB_ENTITIES = 'DB_ENTITIES',
  RESOLVERS = 'RESOLVERS',
}

export type AppContainer = AwilixContainer & {
  registerStore: <T>(name: ContainerStore, registration: T) => AppContainer;
  createScope: () => AppContainer;
};

export type Loader<T, O = object> = (
  opt: { container: AppContainer } & O,
) => T | Promise<T>;

export type ClassConstructor<T> = {
  new (...args: unknown[]): T;
};

export type Model = ClassConstructor<unknown> | EntitySchema;
