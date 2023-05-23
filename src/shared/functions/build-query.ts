/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  And,
  FindManyOptions,
  FindOperator,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
} from 'typeorm';
import { FindOptionsOrder } from 'typeorm/find-options/FindOptionsOrder';
import { isObject } from './is';
import { ExtendedFindConfig, FindConfig } from '@shared/types';

/**
 * Used to build TypeORM queries.
 * @param selector The selector
 * @param config The config
 * @return The QueryBuilderConfig
 */
export function buildQuery<TWhereKeys extends object, TEntity = unknown>(
  selector: TWhereKeys,
  config: FindConfig<TEntity> = {},
): ExtendedFindConfig<TEntity> {
  const query: ExtendedFindConfig<TEntity> = {
    where: buildWhere<TWhereKeys, TEntity>(selector),
  };

  if ('deleted_at' in selector) {
    query.withDeleted = true;
  }

  if ('skip' in config) {
    (query as FindManyOptions<TEntity>).skip = config.skip;
  }

  if ('take' in config) {
    (query as FindManyOptions<TEntity>).take = config.take;
  }

  if (config.relations) {
    query.relations = buildRelations<TEntity>(config.relations);
  }

  if (config.select) {
    query.select = buildSelects<TEntity>(config.select as string[]);
  }

  if (config.order) {
    query.order = buildOrder<TEntity>(config.order);
  }

  return query;
}

/**
 * @param constraints
 *
 * @example
 * const q = buildWhere(
 *   {
 *     id: "1234",
 *     test1: ["123", "12", "1"],
 *     test2: Not("this"),
 *     date: { gt: date },
 *     amount: { gt: 10 },
 *   },
 *)
 *
 * // Output
 * {
 *    id: "1234",
 *    test1: In(["123", "12", "1"]),
 *    test2: Not("this"),
 *    date: MoreThan(date),
 *    amount: MoreThan(10)
 * }
 */
function buildWhere<TWhereKeys extends object, TEntity>(
  constraints: TWhereKeys,
): FindOptionsWhere<TEntity> {
  const where: FindOptionsWhere<TEntity> = {};

  for (const [key, value] of Object.entries(constraints) as [
    keyof FindOptionsWhere<TEntity>,
    unknown,
  ][]) {
    if (value === undefined) {
      continue;
    }

    if (value === null) {
      where[key] = IsNull() as any;
      continue;
    }

    if (value instanceof FindOperator) {
      where[key] = value as any;
      continue;
    }

    if (Array.isArray(value)) {
      where[key] = In(value) as any;
      continue;
    }

    if (typeof value === 'object') {
      Object.entries(value).forEach(([objectKey, objectValue]) => {
        let whereKey = (where[key] || []) as FindOperator<any>[];

        switch (objectKey) {
          case 'lt':
            whereKey.push(LessThan(objectValue));
            break;
          case 'gt':
            whereKey.push(MoreThan(objectValue));
            break;
          case 'lte':
            whereKey.push(LessThanOrEqual(objectValue));
            break;
          case 'gte':
            whereKey.push(MoreThanOrEqual(objectValue));
            break;
          default:
            if (objectValue != undefined && typeof objectValue === 'object') {
              whereKey = buildWhere<any, TEntity>(objectValue) as any;
              return;
            }
            whereKey = value as any;
        }

        where[key] = whereKey as any;

        return;
      });

      if (!Array.isArray(where[key])) {
        continue;
      }

      if ((where[key] as any[]).length === 1) {
        where[key] = (where[key] as any)[0];
      } else {
        where[key] = And(...(where[key] as any)) as any;
      }

      continue;
    }

    where[key] = value as any;
  }

  return where;
}

export function buildSelects<TEntity>(
  selectCollection: string[],
): FindOptionsSelect<TEntity> {
  return buildRelationsOrSelect(selectCollection) as FindOptionsSelect<TEntity>;
}

export function buildRelations<TEntity>(
  relationCollection: string[],
): FindOptionsRelations<TEntity> {
  return buildRelationsOrSelect(relationCollection) as FindOptionsRelations<TEntity>;
}

export function addOrderToSelect<TEntity>(
  order: FindOptionsOrder<TEntity>,
  select: FindOptionsSelect<TEntity>,
): void {
  for (const orderBy of Object.keys(
    order,
  ) as unknown as (keyof FindOptionsOrder<TEntity>)[]) {
    if (isObject(order[orderBy])) {
      select[orderBy] = (
        select[orderBy] && isObject(select[orderBy]) ? select[orderBy] : {}
      ) as any;

      addOrderToSelect(order[orderBy] as any, select[orderBy] as any);
      continue;
    }

    select[orderBy] = (
      isObject(select[orderBy]) ? { ...select[orderBy], id: true, [orderBy]: true } : true
    ) as any;
  }
}

/**
 * Convert an collection of dot string into a nested object
 * @example
 * input: [
 *    order,
 *    order.items,
 *    order.swaps,
 *    order.swaps.additional_items,
 *    order.discounts,
 *    order.discounts.rule,
 *    order.claims,
 *    order.claims.additional_items,
 *    additional_items,
 *    additional_items.variant,
 *    return_order,
 *    return_order.items,
 *    return_order.shipping_method,
 *    return_order.shipping_method.tax_lines
 * ]
 * output: {
 *   "order": {
 *     "items": true,
 *     "swaps": {
 *       "additional_items": true
 *     },
 *     "discounts": {
 *       "rule": true
 *     },
 *     "claims": {
 *       "additional_items": true
 *     }
 *   },
 *   "additional_items": {
 *     "variant": true
 *   },
 *   "return_order": {
 *     "items": true,
 *     "shipping_method": {
 *       "tax_lines": true
 *     }
 *   }
 * }
 * @param collection
 */
export function buildRelationsOrSelect<TEntity>(
  collection: string[],
): FindOptionsRelations<TEntity> | FindOptionsSelect<TEntity> {
  const output: Record<string, any> = {};

  for (const relation of collection) {
    if (relation.indexOf('.') > -1) {
      const nestedRelations = relation.split('.');

      let parent = output;

      while (nestedRelations.length > 1) {
        const nestedRelation = nestedRelations.shift() as string;
        parent = parent[nestedRelation] =
          parent[nestedRelation] !== true && typeof parent[nestedRelation] === 'object'
            ? parent[nestedRelation]
            : {};
      }

      parent[nestedRelations[0]] = true;

      continue;
    }

    output[relation] = output[relation] ?? true;
  }

  return output;
}

/**
 * Convert an order of dot string into a nested object
 * @example
 * input: { id: "ASC", "items.title": "ASC", "items.variant.title": "ASC" }
 * output: {
 *   "id": "ASC",
 *   "items": {
 *     "id": "ASC",
 *     "variant": {
 *        "title": "ASC"
 *     }
 *   },
 * }
 * @param orderBy
 */
function buildOrder<TEntity>(orderBy: {
  [k: string]: 'ASC' | 'DESC';
}): FindOptionsOrder<TEntity> {
  const output: Record<string, any> = {};

  const orderKeys = Object.keys(orderBy);

  for (const order of orderKeys) {
    if (order.indexOf('.') > -1) {
      const nestedOrder = order.split('.');

      let parent = output;

      while (nestedOrder.length > 1) {
        const nestedRelation = nestedOrder.shift() as string;
        parent = parent[nestedRelation] = parent[nestedRelation] ?? {};
      }

      parent[nestedOrder[0]] = orderBy[order];

      continue;
    }

    output[order] = orderBy[order];
  }

  return output;
}

export function nullableValue(value: any): FindOperator<any> {
  if (value === null) {
    return IsNull();
  } else {
    return value;
  }
}
