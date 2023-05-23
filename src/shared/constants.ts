const requestBodyAttributes = {
  /** The request key/attribute name holding the client's IP address */
  IP_ADDRESS: 'clientIpAddress',
} as const;

const errorCodes = {
  /** The maximum query complexity has been exceeded, 429 */
  MAX_QUERY_COMPLEXITY_EXCEEDED: 'MAX_QUERY_COMPLEXITY_EXCEEDED',
  /** The resource was not found */
  NOT_FOUND: 'NOT_FOUND',
} as const;

export const Constants = {
  APP_NAME: 'Saare',
  SALT_ROUNDS: 10,
  OTP_LENGTH: 6,
  OTP_LNG_LENGTH: 12,
  /** This is the maximum query complexity level per second */
  MAX_QUERY_COMPLEXITY: 1000,
  /** This is the maximum query complexity per request */
  MAX_QUERY_COMPLEXITY_PER_REQUEST: 100,
  /** The request body attributes */
  REQUEST_ATTRIBUTES: requestBodyAttributes,
  /** The error codes to use with custom Graphql error handler */
  ERROR_CODES: errorCodes,
} as const;
