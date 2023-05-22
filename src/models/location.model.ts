import { Entity, Column, OneToOne } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { BaseSchema } from '@shared/entity';

import { Restaurant } from './restaurant.model';
import { User } from './user.model';

export abstract class Location extends BaseSchema {
  @Field()
  @Column({ length: 50 })
  address: string;

  @Field()
  @Column({ length: 50 })
  street: string;

  @Field()
  @Column({ length: 50 })
  city: string;

  @Field()
  @Column({ length: 50 })
  state: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  postalCode?: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column('jsonb', { nullable: true })
  latlng?: { lng: number; lat: number };
}

@Entity()
@ObjectType()
export class RestaurantLocation extends Location {
  @Field(() => Restaurant)
  @OneToOne(() => Restaurant, (restaurant) => restaurant.location)
  restaurant: Restaurant;
}

@Entity()
@ObjectType()
export class UserLocation extends Location {
  @OneToOne(() => User, (user) => user.location)
  user: User;
}
