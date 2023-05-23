import { EntityManager } from 'typeorm';
import { CategoryRepository } from '@repositories/category.repository';
import { isDefined } from 'class-validator';

import { Category, CategoryInput, UpdateCategoryInput } from '@models/category.model';
import { BaseService } from '@shared/service';
import { Selector } from '@shared/types';
import { buildQuery } from '@shared/functions';
import { NotFoundError } from '@shared/errors';

type InjectedDependencies = {
  manager: EntityManager;
  categoryRepository: typeof CategoryRepository;
};

/**
 * Provides layer to manipulate categories.
 */
export class CategoryService extends BaseService {
  protected readonly _categoryRepository: typeof CategoryRepository;

  constructor({ categoryRepository }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);

    this._categoryRepository = categoryRepository;
  }

  /**
   * Gets a category by selector.
   * Throws in case of DB Error and if product was not found.
   * @param selector - selector object
   */
  private async _get(selector: Selector<Category>): Promise<Category> {
    const manager = this._activeManager;
    const categoryRepo = manager.withRepository(this._categoryRepository);

    const query = buildQuery(selector);

    const category = await categoryRepo.findOne(query);

    if (category === null) {
      throw new NotFoundError('Menu not found');
    }

    return category;
  }

  /**
   * Gets a category by id.
   * Throws in case of DB Error and if the menu was not found.
   * @param menuId - id of the product to get.
   * @return the result of the find one operation.
   */
  async retrieve(productId: string): Promise<Category> {
    return await this._get({ id: productId });
  }

  async create(categoryObj: CategoryInput): Promise<Category> {
    return await this._atomicPhase(async (mananger) => {
      const catgRepo = mananger.withRepository(this._categoryRepository);

      const category = catgRepo.create(categoryObj);

      await catgRepo.save(category);

      return category;
    });
  }

  async update(id: string, categoryObj: UpdateCategoryInput): Promise<Category> {
    const category = await this._get({ id });

    for (const [key, value] of Object.entries(categoryObj) as [
      keyof UpdateCategoryInput,
      string,
    ][]) {
      if (isDefined(value)) {
        category[key] = value;
      }
    }

    return this._categoryRepository.save(category);
  }

  async getAll(): Promise<Category[]> {
    return this._categoryRepository.find();
  }
}

export default CategoryService;
