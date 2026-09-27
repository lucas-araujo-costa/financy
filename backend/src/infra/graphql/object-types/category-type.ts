import { Field, GraphQLISODateTime, ID, Int, ObjectType } from 'type-graphql'

@ObjectType('Category')
export class CategoryType {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String, { nullable: true })
  description!: string | null

  @Field(() => String, { description: 'Um dos 16 ícones Lucide do Figma.' })
  icon!: string

  @Field(() => String, { description: 'Uma das 7 cores do Figma.' })
  color!: string

  @Field(() => Int, { description: 'Transações da categoria, de sempre.' })
  transactionsCount!: number

  @Field(() => Int, {
    description: 'Soma dos valores (entradas e saídas), de sempre.',
  })
  totalInCents!: number

  @Field(() => GraphQLISODateTime)
  createdAt!: Date

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date
}
