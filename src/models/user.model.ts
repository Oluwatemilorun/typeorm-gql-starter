import { Field, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseSchema } from '@shared/entity';
import { UserLocation } from './location.model';

/**
 * User schema
 */
@Entity('users')
@ObjectType()
export class User extends BaseSchema {
  @Column()
  @Field(() => String)
  firstName: string;

  @Column()
  middleName?: string;

  @Column()
  lastName: string;

  @Column({ select: false })
  password: string;

  @Field(() => UserLocation)
  @OneToOne(() => UserLocation, (location) => location.user)
  @JoinColumn()
  location: UserLocation;
}
