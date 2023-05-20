import { GraphQLError } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { RateLimiterRes } from 'rate-limiter-flexible';
import { ArgumentValidationError } from 'type-graphql';

import { Constants } from '../constants';

export class MaxQueryComplexityReached extends GraphQLError {
  constructor(msg: string, limiterRes?: RateLimiterRes) {
    super(msg, null, null, null, null, null, {
      code: Constants.ERROR_CODES.MAX_QUERY_COMPLEXITY_EXCEEDED,
      http: {
        status: 429,
        headers: limiterRes
          ? new Map([['Retry-After', String(limiterRes.msBeforeNext / 1000)]])
          : null,
      },
    });
  }
}

export class BadRequestError extends GraphQLError {
  /**
   * This is used with for validation errord and
   * returns a formatted response in this format;
   ```json
    {
      "errors": [
        {
          "message": "Argument Validation Error",
          "locations": [
            {
              "line": 4,
              "column": 5
            }
          ],
          "path": [
            "category",
            "dishes"
          ],
          "extensions": {
            "code": "BAD_USER_INPUT",
            "errors": [
              {
                "target": {
                  "page": 0,
                  "limit": 10
                },
                "value": 0,
                "property": "page",
                "children": [],
                "constraints": {
                  "min": "page must not be less than 1"
                }
              }
            ],
            "stacktrace": [
              "GraphQLError: Argument Validation Error",
            ]
          }
        }
      ],
      "data": null
    }
    ```
  */
  constructor(err: ArgumentValidationError) {
    super(err.message, null, null, null, null, null, {
      code: ApolloServerErrorCode.BAD_USER_INPUT,
      errors: err.validationErrors,
    });
  }
}
