// As 7 cores do color picker do modal "Nova categoria", na ordem do Figma.
export const CATEGORY_COLORS = [
  'green',
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
] as const

export type CategoryColor = (typeof CATEGORY_COLORS)[number]
