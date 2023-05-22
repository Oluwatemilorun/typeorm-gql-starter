import { EntityManager } from 'typeorm';
import { CategoryRepository } from '@repositories/category.repository';
import { BaseService } from '@shared/service';

type InjectedDependencies = {
  manager: EntityManager;
  categoryRepository: typeof CategoryRepository;
};

/**
 * Provides layer to manipulate categories.
 */
export class CategoryService extends BaseService {
  protected readonly _repository: typeof CategoryRepository;

  constructor({ categoryRepository }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);

    this._repository = categoryRepository;
  }

  justTest() {
    console.log('dependency injection works');
  }
}

export default CategoryService;
