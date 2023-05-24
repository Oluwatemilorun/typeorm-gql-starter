import { QueryFailedError } from 'typeorm';
import { ArgumentValidationError } from 'type-graphql';

export const isValidationError = (err: unknown): err is ArgumentValidationError => {
  return (
    err instanceof ArgumentValidationError ||
    (!!(err as Error).message &&
      (err as Error).message.toLowerCase().includes('validation error'))
  );
};

export const isQueryFailedError = (err: unknown): err is QueryFailedError =>
  err instanceof QueryFailedError;
