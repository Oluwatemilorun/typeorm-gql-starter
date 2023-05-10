import { GraphQLError } from 'graphql';
import { Constants } from '../constants';
import { RateLimiterRes } from 'rate-limiter-flexible';

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
