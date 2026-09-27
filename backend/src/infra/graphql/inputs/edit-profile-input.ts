import { Matches, MaxLength } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class EditProfileInput {
  @Field(() => String)
  @Matches(/\S/, { message: 'Informe o nome.' })
  @MaxLength(100)
  name!: string
}
