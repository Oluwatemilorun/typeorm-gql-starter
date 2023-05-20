import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ArgsType, Field, ID, Int, ObjectType } from 'type-graphql';
import { Min } from 'class-validator';

export abstract class BaseSchema {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  @Field()
  @UpdateDateColumn()
  updatedAt: string;
}

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 1 })
  @Min(1)
  page?: number = 1;

  @Field(() => Int, {
    defaultValue: 10,
    description: 'The max number of items to return.',
  })
  @Min(1)
  limit?: number = 10;
}

@ObjectType()
export class PaginationInfo {
  @Field()
  perPage: number;

  @Field()
  totalPages: number;

  @Field()
  hasNextPage: boolean;
}

@ObjectType()
export class PaginationResult {
  @Field(() => PaginationInfo)
  pageInfo: PaginationInfo;

  @Field({ description: 'The total item count.' })
  count: number;
}
