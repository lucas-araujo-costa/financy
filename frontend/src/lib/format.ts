/*
 * Formatação em pt-BR com Intl, sem dependência.
 * Datas de transação são dias de calendário ("YYYY-MM-DD", escalar Date do
 * contrato). `new Date("2025-11-30")` é meia-noite UTC, então a formatação é
 * sempre em UTC, para o dia não "voltar" no fuso de Brasília.
 */

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const decimalFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  timeZone: 'UTC',
})

const longDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

const localDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  timeZone: 'UTC',
})

/** 123456 → "R$ 1.234,56" */
export function formatCurrency(amountInCents: number) {
  return currencyFormatter.format(amountInCents / 100)
}

/** 123456 → "1.234,56" (campo Valor, que tem o prefixo R$ ao lado) */
export function formatDecimal(amountInCents: number) {
  return decimalFormatter.format(amountInCents / 100)
}

/** "YYYY-MM-DD" ou ISO → "30/11/25" (tabela e lista de recentes) */
export function formatShortDate(date: string | Date) {
  return shortDateFormatter.format(new Date(date))
}

/** "YYYY-MM-DD" ou ISO → "30/11/2025" */
export function formatDate(date: string | Date) {
  return longDateFormatter.format(new Date(date))
}

/** Date local do calendário → "30/11/2025" (sem converter para UTC) */
export function formatLocalDate(date: Date) {
  return localDateFormatter.format(date)
}

/** (11, 2025) → "Novembro / 2025" */
export function formatPeriod(month: number, year: number) {
  const name = monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)))
  return `${capitalize(name)} / ${year}`
}

/** "R$ 1.234,56" ou "1234,56" → 123456. Retorna null se não for um valor. */
export function parseCurrencyToCents(value: string) {
  const digits = value.replace(/[^\d,]/g, '').replace(',', '.')
  if (digits === '' || Number.isNaN(Number(digits))) return null
  return Math.round(Number(digits) * 100)
}

/** Dia escolhido no calendário (Date local) → "YYYY-MM-DD" do escalar Date */
export function toCalendarDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** "YYYY-MM-DD" → Date local no mesmo dia (para o calendário) */
export function fromCalendarDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** "Conta Teste da Silva" → "CS" (avatar do header e do perfil) */
export function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''

  const first = words[0].charAt(0)
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : ''
  return (first + last).toUpperCase()
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
