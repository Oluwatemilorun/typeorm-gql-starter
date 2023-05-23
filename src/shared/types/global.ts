import type { AwilixContainer } from 'awilix';
import {
  EntitySchema,
  FindManyOptions,
  FindOneOptions,
  FindOperator,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';
import { ContainerStore } from './enums';

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

export type DeleteResponse = {
  id: string;
  object: string;
  deleted: boolean;
};

export interface DateComparisonOperator {
  lt?: Date;
  gt?: Date;
  gte?: Date;
  lte?: Date;
}

export interface StringComparisonOperator {
  lt?: string;
  gt?: string;
  gte?: string;
  lte?: string;
}

export interface NumericalComparisonOperator {
  lt?: number;
  gt?: number;
  gte?: number;
  lte?: number;
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

export type QuerySelector<TEntity> = Selector<TEntity> & { q?: string };

export type Selector<TEntity> = {
  [key in keyof TEntity]?:
    | TEntity[key]
    | TEntity[key][]
    | DateComparisonOperator
    | StringComparisonOperator
    | NumericalComparisonOperator
    | FindOperator<TEntity[key][] | string | string[]>;
};

export interface FindConfig<Entity> {
  select?: (keyof Entity)[];
  skip?: number;
  take?: number;
  relations?: string[];
  order?: { [K: string]: 'ASC' | 'DESC' };
}

export type ExtendedFindConfig<TEntity> = (
  | Omit<FindOneOptions<TEntity>, 'where' | 'relations' | 'select'>
  | Omit<FindManyOptions<TEntity>, 'where' | 'relations' | 'select'>
) & {
  select?: FindOptionsSelect<TEntity>;
  relations?: FindOptionsRelations<TEntity>;
  where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[];
  order?: FindOptionsOrder<TEntity>;
  skip?: number;
  take?: number;
};
