import { Field, ObjectType } from 'type-graphql'

import { UserType } from './user-type'

@ObjectType('AuthPayload')
export class AuthPayloadType {
  @Field(() => String, { description: 'JWT para `Authorization: Bearer`.' })
  accessToken!: string

  @Field(() => UserType)
  user!: UserType
}
