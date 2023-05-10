import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Field, ID } from 'type-graphql';

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
