import { Arg, Args, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Category, CategoryInput, DishesArg, PaginatedDishes } from '@models';

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
  ): Promise<PaginatedDishes> {
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
