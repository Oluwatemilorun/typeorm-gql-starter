import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Category, CategoryInput, DishesArg, PaginatedDishes } from '@models';
import CategoryService from '@/services/category.service';
import { ApolloContext } from '@shared/types';

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => [Category])
  async categories() {
    // return await this.recipesCollection;
  }

  @Query(() => Category)
  async category(@Arg('id') id: string) {
    // return await this.recipesCollection;
    return {
      name: '',
      // dishes: [],
    };
  }

  @Mutation(() => Category)
  async addCategory(@Arg('category') inp: CategoryInput) {
    // ===
  }

  @Mutation(() => Category)
  async updateCategory(
    @Arg('id', { description: 'The id of the category' }) id: string,
    @Arg('category') inp: CategoryInput,
  ) {
    // ===
  }

  @FieldResolver(() => PaginatedDishes)
  async dishes(
    @Root() category: Category,
    @Args() { limit, page }: DishesArg,
    @Ctx() ctx: ApolloContext,
  ): Promise<PaginatedDishes> {
    const service = ctx.scope.resolve<CategoryService>('categoryService');

    service.justTest();

    return {
      count: 10,
      items: [],
      pageInfo: {
        hasNextPage: false,
        perPage: 10,
        totalPages: 1,
      },
    };
  }
}
