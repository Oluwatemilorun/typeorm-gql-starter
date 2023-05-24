import { GraphQLError, GraphQLErrorOptions } from 'graphql';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { ArgumentValidationError } from 'type-graphql';
import { Constants } from '@shared/constants';

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
    const opts: GraphQLErrorOptions = {
      extensions: {
        code: ApolloServerErrorCode.BAD_USER_INPUT,
        errors: err.validationErrors,
      },
    };
    super(err.message, opts);
  }
}

export class NotFoundError extends GraphQLError {
  constructor(msg: string) {
    const opts: GraphQLErrorOptions = {
      extensions: {
        code: Constants.ERROR_CODES.NOT_FOUND,
      },
    };

    super(msg, opts);
  }
}
