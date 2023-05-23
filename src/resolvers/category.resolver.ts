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
import CategoryService from '@services/category.service';
import { ApolloContext } from '@shared/types';
import { DishesArg, PaginatedDishes } from '@models/dish.model';
import { Category, CategoryInput } from '@models/category.model';

@Resolver(() => Category)
export class CategoryResolver {
  @Query(() => [Category])
  async categories(@Ctx() ctx: ApolloContext): Promise<Category[]> {
    const categoryService = ctx.scope.resolve<CategoryService>('categoryService');
    return categoryService.getAll();
  }

  @Query(() => Category)
  async category(@Arg('id') id: string, @Ctx() ctx: ApolloContext): Promise<Category> {
    const categoryService = ctx.scope.resolve<CategoryService>('categoryService');
    return categoryService.retrieve(id);
  }

  @Mutation(() => Category)
  async addCategory(
    @Arg('category') inp: CategoryInput,
    @Ctx() ctx: ApolloContext,
  ): Promise<Category> {
    const categoryService = ctx.scope.resolve<CategoryService>('categoryService');
    return categoryService.create(inp);
  }

  @Mutation(() => Category)
  async updateCategory(
    @Arg('id', { description: 'The id of the category' }) id: string,
    @Arg('category') inp: CategoryInput,
    @Ctx() ctx: ApolloContext,
  ): Promise<Category> {
    const categoryService = ctx.scope.resolve<CategoryService>('categoryService');
    return categoryService.update(id, inp);
  }

  @FieldResolver(() => PaginatedDishes)
  async dishes(
    @Root() category: Category,
    @Args() { limit, page }: DishesArg,
    @Ctx() ctx: ApolloContext,
  ): Promise<PaginatedDishes> {
    const categoryService = ctx.scope.resolve<CategoryService>('categoryService');

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
