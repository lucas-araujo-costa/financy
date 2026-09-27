// Os 16 ícones (nomes do Lucide) da grade 8x2 do modal "Nova categoria", na
// ordem do Figma.
export const CATEGORY_ICONS = [
  'briefcase-business',
  'car-front',
  'heart-pulse',
  'piggy-bank',
  'shopping-cart',
  'ticket',
  'tool-case',
  'utensils',
  'paw-print',
  'house',
  'gift',
  'dumbbell',
  'book-open',
  'baggage-claim',
  'mailbox',
  'receipt-text',
] as const

export type CategoryIcon = (typeof CATEGORY_ICONS)[number]
