import { GraphQLError, GraphQLErrorOptions } from 'graphql';
import { RateLimiterRes } from 'rate-limiter-flexible';
import { Constants } from '@shared/constants';

export class MaxQueryComplexityReached extends GraphQLError {
  constructor(msg: string, limiterRes?: RateLimiterRes) {
    const opts: GraphQLErrorOptions = {
      extensions: {
        code: Constants.ERROR_CODES.MAX_QUERY_COMPLEXITY_EXCEEDED,
        http: {
          status: 429,
          headers: limiterRes
            ? new Map([['Retry-After', String(limiterRes.msBeforeNext / 1000)]])
            : null,
        },
      },
    };
    super(msg, opts);
  }
}
