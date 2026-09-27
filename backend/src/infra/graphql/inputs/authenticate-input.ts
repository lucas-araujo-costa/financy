import { IsEmail, IsNotEmpty } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class AuthenticateInput {
  @Field(() => String)
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email!: string

  // Sem regra de tamanho aqui, para não dar pistas sobre as senhas.
  @Field(() => String)
  @IsNotEmpty({ message: 'Informe a senha.' })
  password!: string
}
