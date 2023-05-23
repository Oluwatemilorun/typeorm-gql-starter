import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Field, InputType, ObjectType } from 'type-graphql';
import { IsOptional, IsUrl, Length } from 'class-validator';
import { BaseSchema } from '@shared/entity';

import { Dish } from './dish.model';

@Entity()
@ObjectType()
export class Category extends BaseSchema {
  static dishCategoryJoinTable = 'dish_category_dish';

  @Field()
  @PrimaryColumn({ length: 50 })
  name: string;

  @Field()
  @Column({ length: 150 })
  description: string;

  @Field({ nullable: true })
  @Column({ length: 1000, nullable: true })
  coverUrl?: string;

  @Field({ nullable: true })
  @Column({ length: 1000, nullable: true })
  iconUrl?: string;

  @ManyToMany(() => Dish, (dish) => dish.categories)
  dishes: Dish[];
}

@InputType({ description: 'Add a new category' })
export class CategoryInput implements Partial<Category> {
  @Field()
  @Length(3, 50)
  name: string;

  @Field()
  @Length(3, 150)
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  coverUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  iconUrl?: string;
}

@InputType({ description: 'Update a category' })
export class UpdateCategoryInput implements Partial<Category> {
  @Field({ nullable: true })
  @Length(3, 50)
  name?: string;

  @Field({ nullable: true })
  @Length(3, 150)
  description?: string;

  @Field({ nullable: true })
  @IsUrl()
  coverUrl?: string;

  @Field({ nullable: true })
  @IsUrl()
  iconUrl?: string;
}
