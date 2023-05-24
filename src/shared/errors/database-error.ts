import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { QueryFailedError } from 'typeorm';
import { ValidationError } from 'class-validator';

import { PostgresError } from '@shared/types';
import { Constants } from '@shared/constants';

export class DatabaseError extends GraphQLError {
  constructor(err: QueryFailedError) {
    const [msg, extensions] = DatabaseError._formatException(err);
    super(msg, { extensions, originalError: err });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected static _formatException(err: any): [string, Record<string, unknown>] {
    switch (err.code) {
      case PostgresError.DUPLICATE_ERROR:
        return [
          'Item already exist',
          {
            code: ApolloServerErrorCode.BAD_USER_INPUT,
            errors: [
              {
                property: '',
              },
            ] as ValidationError[],
          },
        ];

      case PostgresError.INVALID_UUID:
        return [
          'Invalid ID passed. ID must be a UUID',
          {
            code: ApolloServerErrorCode.BAD_USER_INPUT,
            errors: [
              {
                property: 'id',
                constraints: {
                  type: 'ID must be a valid UUID',
                },
              },
            ] as ValidationError[],
          },
        ];

      case PostgresError.NULL_VIOLATION:
        return [
          `${err?.column} cannot be null`,
          {
            code: ApolloServerErrorCode.BAD_USER_INPUT,
            errors: [
              {
                property: err?.column,
                constraints: {
                  type: 'Cannot be null',
                },
              },
            ] as ValidationError[],
          },
        ];

      case PostgresError.FOREIGN_KEY_ERROR:
        let msg: string;
        const matches =
          /Key \(([\w-\d]+)\)=\(([\w-\d]+)\) is not present in table "(\w+)"/g.exec(
            err.detail,
          );

        if (matches?.length !== 4) {
          msg = JSON.stringify(matches);
        }

        msg = `${matches?.[3]?.charAt?.(0).toUpperCase()}${matches?.[3]?.slice(1)} with ${
          matches?.[1]
        } ${matches?.[2]} does not exist.`;

        return [
          msg,
          {
            code: Constants.ERROR_CODES.NOT_FOUND,
          },
        ];

      default:
        return [
          err.message,
          {
            code: Constants.ERROR_CODES.SERVICE_UNAVAILABLE,
            http: {
              status: 503,
            },
            ...err,
          },
        ];
    }
  }
}
