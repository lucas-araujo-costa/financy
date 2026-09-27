import { Field, GraphQLISODateTime, ID, ObjectType } from 'type-graphql'

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  email!: string

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date
}
