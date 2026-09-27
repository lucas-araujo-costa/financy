import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class RegisterInput {
  @Field(() => String)
  @Matches(/\S/, { message: 'Informe o nome.' })
  @MaxLength(100)
  name!: string

  @Field(() => String)
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email!: string

  @Field(() => String)
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  @MaxLength(72, { message: 'A senha deve ter no máximo 72 caracteres.' })
  password!: string
}
