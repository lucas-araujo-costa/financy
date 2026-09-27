import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  type LucideIcon,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
} from 'lucide-react'

import type { TagColor } from '@/components/ui/tag'

/*
 * Listas fixas do contrato (docs/api-contract.md › Listas fixas): os valores de `icon` e `color` que o
 * backend aceita, na ordem do modal "Nova categoria" do Figma.
 * Ficam em shared porque dashboard, transações e categorias usam.
 */

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

export type CategoryIconName = (typeof CATEGORY_ICONS)[number]

export const categoryIconComponents: Record<CategoryIconName, LucideIcon> = {
  'briefcase-business': BriefcaseBusiness,
  'car-front': CarFront,
  'heart-pulse': HeartPulse,
  'piggy-bank': PiggyBank,
  'shopping-cart': ShoppingCart,
  ticket: Ticket,
  'tool-case': ToolCase,
  utensils: Utensils,
  'paw-print': PawPrint,
  house: House,
  gift: Gift,
  dumbbell: Dumbbell,
  'book-open': BookOpen,
  'baggage-claim': BaggageClaim,
  mailbox: Mailbox,
  'receipt-text': ReceiptText,
}

export const CATEGORY_COLORS = [
  'green',
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
] as const

export type CategoryColorName = (typeof CATEGORY_COLORS)[number]

/** Classes do tema por cor. Escritas por extenso para o Tailwind encontrá-las. */
export const categoryColorClasses: Record<
  CategoryColorName,
  { tag: TagColor; iconBackground: string; icon: string; swatch: string }
> = {
  green: {
    tag: 'green',
    iconBackground: 'bg-green-light',
    icon: 'text-green-base',
    swatch: 'bg-green-base',
  },
  blue: {
    tag: 'blue',
    iconBackground: 'bg-blue-light',
    icon: 'text-blue-base',
    swatch: 'bg-blue-base',
  },
  purple: {
    tag: 'purple',
    iconBackground: 'bg-purple-light',
    icon: 'text-purple-base',
    swatch: 'bg-purple-base',
  },
  pink: {
    tag: 'pink',
    iconBackground: 'bg-pink-light',
    icon: 'text-pink-base',
    swatch: 'bg-pink-base',
  },
  red: {
    tag: 'red',
    iconBackground: 'bg-red-light',
    icon: 'text-red-base',
    swatch: 'bg-red-base',
  },
  orange: {
    tag: 'orange',
    iconBackground: 'bg-orange-light',
    icon: 'text-orange-base',
    swatch: 'bg-orange-base',
  },
  yellow: {
    tag: 'yellow',
    iconBackground: 'bg-yellow-light',
    icon: 'text-yellow-base',
    swatch: 'bg-yellow-base',
  },
}

/* O contrato tipa icon e color como string. Um valor fora da lista cai no padrão. */

export function toCategoryIcon(value: string): CategoryIconName {
  return (CATEGORY_ICONS as readonly string[]).includes(value)
    ? (value as CategoryIconName)
    : CATEGORY_ICONS[0]
}

export function toCategoryColor(value: string): CategoryColorName {
  return (CATEGORY_COLORS as readonly string[]).includes(value)
    ? (value as CategoryColorName)
    : CATEGORY_COLORS[0]
}
