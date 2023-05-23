import { EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

export abstract class BaseService {
  protected _manager: EntityManager;
  protected _transactionManager: EntityManager | undefined;

  protected get _activeManager(): EntityManager {
    return this._transactionManager ?? this._manager;
  }

  protected constructor(
    protected readonly __container__: any,
    protected readonly __moduleDeclaration__?: Record<string, unknown>,
  ) {
    this._manager = __container__.manager;
  }

  withTransaction(transactionManager?: EntityManager): this {
    if (!transactionManager) {
      return this;
    }

    const cloned = new (this.constructor as any)(
      this.__container__,
      this.__moduleDeclaration__,
    );

    cloned._manager = transactionManager;
    cloned._transactionManager = transactionManager;

    return cloned;
  }

  protected _shouldRetryTransaction(
    err: { code: string } | Record<string, unknown>,
  ): boolean {
    if (!(err as { code: string })?.code) {
      return false;
    }
    const code = (err as { code: string })?.code;
    return code === '40001' || code === '40P01';
  }

  /**
   * Wraps some work within a transactional block. If the service already has
   * a transaction manager attached this will be reused, otherwise a new
   * transaction manager is created.
   * @param work - the transactional work to be done
   * @param isolationOrErrorHandler - the isolation level to be used for the work.
   * @param maybeErrorHandlerOrDontFail Potential error handler
   * @return the result of the transactional work
   */
  protected async _atomicPhase<TResult, TError>(
    work: (transactionManager: EntityManager) => Promise<TResult | never>,
    isolationOrErrorHandler?:
      | IsolationLevel
      | ((error: TError) => Promise<never | TResult | void>),
    maybeErrorHandlerOrDontFail?: (error: TError) => Promise<never | TResult | void>,
  ): Promise<never | TResult> {
    let errorHandler = maybeErrorHandlerOrDontFail;
    let isolation:
      | IsolationLevel
      | ((error: TError) => Promise<never | TResult | void>)
      | undefined
      | null = isolationOrErrorHandler;
    let dontFail = false;
    if (typeof isolationOrErrorHandler === 'function') {
      isolation = null;
      errorHandler = isolationOrErrorHandler;
      dontFail = !!maybeErrorHandlerOrDontFail;
    }

    if (this._transactionManager) {
      const doWork = async (m: EntityManager): Promise<never | TResult> => {
        this._manager = m;
        this._transactionManager = m;
        try {
          return await work(m);
        } catch (error) {
          if (errorHandler) {
            const queryRunner = this._transactionManager.queryRunner;
            if (queryRunner && queryRunner.isTransactionActive) {
              await queryRunner.rollbackTransaction();
            }

            await errorHandler(error as TError);
          }
          throw error;
        }
      };

      return await doWork(this._transactionManager);
    } else {
      const temp = this._manager;
      const doWork = async (m: EntityManager): Promise<never | TResult> => {
        this._manager = m;
        this._transactionManager = m;
        try {
          const result = await work(m);
          this._manager = temp;
          this._transactionManager = undefined;
          return result;
        } catch (error) {
          this._manager = temp;
          this._transactionManager = undefined;
          throw error;
        }
      };

      if (isolation && this._manager) {
        let result;
        try {
          result = await this._manager.transaction(
            isolation as IsolationLevel,
            async (m) => doWork(m),
          );
          return result;
        } catch (error) {
          if (this._shouldRetryTransaction(error as Record<string, unknown>)) {
            return this._manager.transaction(
              isolation as IsolationLevel,
              async (m): Promise<never | TResult> => doWork(m),
            );
          } else {
            if (errorHandler) {
              await errorHandler(error as TError);
            }
            throw error;
          }
        }
      }

      try {
        return await this._manager.transaction(async (m) => doWork(m));
      } catch (error) {
        if (errorHandler) {
          const result = await errorHandler(error as TError);
          if (dontFail) {
            return result as TResult;
          }
        }

        throw error;
      }
    }
  }
}
