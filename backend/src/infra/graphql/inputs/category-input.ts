import { IsIn, IsOptional, Matches, MaxLength } from 'class-validator'
import { Field, InputType } from 'type-graphql'

import {
  CATEGORY_COLORS,
  type CategoryColor,
} from '@/domain/finance/enterprise/types/category-color'
import {
  CATEGORY_ICONS,
  type CategoryIcon,
} from '@/domain/finance/enterprise/types/category-icon'

@InputType()
export class CategoryInput {
  @Field(() => String)
  @Matches(/\S/, { message: 'Informe o título.' })
  @MaxLength(50)
  title!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(200)
  description?: string | null

  @Field(() => String, { description: CATEGORY_ICONS.join(', ') })
  @IsIn(CATEGORY_ICONS, { message: 'Ícone inválido.' })
  icon!: CategoryIcon

  @Field(() => String, { description: CATEGORY_COLORS.join(', ') })
  @IsIn(CATEGORY_COLORS, { message: 'Cor inválida.' })
  color!: CategoryColor
}
