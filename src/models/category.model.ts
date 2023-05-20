import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Field, InputType, ObjectType } from 'type-graphql';
import { IsOptional, IsUrl, Length } from 'class-validator';
import { BaseSchema } from '@shared/entity';

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
