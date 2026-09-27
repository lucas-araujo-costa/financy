import { describe, expect, it } from 'vitest'

import {
  formatCurrency,
  formatDate,
  formatDecimal,
  formatLocalDate,
  formatPeriod,
  formatShortDate,
  getInitials,
  fromCalendarDate,
  parseCurrencyToCents,
  toCalendarDate,
} from './format'

// Intl usa espaço não separável entre "R$" e o número
const nbsp = (value: string) => value.replace(/\u00a0/g, ' ')

describe('formatCurrency', () => {
  it('formata centavos em reais', () => {
    expect(nbsp(formatCurrency(123456))).toBe('R$ 1.234,56')
    expect(nbsp(formatCurrency(0))).toBe('R$ 0,00')
    expect(nbsp(formatCurrency(5))).toBe('R$ 0,05')
  })
})

describe('formatShortDate / formatDate', () => {
  it('formata o dia em UTC, sem voltar um dia no fuso local', () => {
    expect(formatShortDate('2025-11-30T00:00:00.000Z')).toBe('30/11/25')
    expect(formatDate('2025-11-01T00:00:00.000Z')).toBe('01/11/2025')
  })
})

describe('formatPeriod', () => {
  it('escreve o mês por extenso com inicial maiúscula', () => {
    expect(formatPeriod(11, 2025)).toBe('Novembro / 2025')
    expect(formatPeriod(3, 2026)).toBe('Março / 2026')
  })
})

describe('parseCurrencyToCents', () => {
  it('converte o valor digitado em centavos', () => {
    expect(parseCurrencyToCents('R$ 1.234,56')).toBe(123456)
    expect(parseCurrencyToCents('10')).toBe(1000)
    expect(parseCurrencyToCents('0,1')).toBe(10)
  })

  it('retorna null quando não há valor', () => {
    expect(parseCurrencyToCents('')).toBeNull()
    expect(parseCurrencyToCents('R$ ')).toBeNull()
  })
})

describe('datas de calendário', () => {
  it('ida e volta mantêm o mesmo dia, no formato do escalar Date', () => {
    const picked = new Date(2025, 10, 30, 23, 45)
    const value = toCalendarDate(picked)
    expect(value).toBe('2025-11-30')

    const back = fromCalendarDate(value)
    expect(back.getFullYear()).toBe(2025)
    expect(back.getMonth()).toBe(10)
    expect(back.getDate()).toBe(30)
  })

  it('formata o dia do escalar Date sem voltar um dia', () => {
    expect(formatShortDate('2025-11-30')).toBe('30/11/25')
  })
})

describe('formatLocalDate', () => {
  it('formata a data local do calendário sem passar por UTC', () => {
    expect(formatLocalDate(new Date(2025, 10, 30, 0, 0))).toBe('30/11/2025')
  })
})

describe('getInitials', () => {
  it('usa a primeira letra do primeiro e do último nome', () => {
    expect(getInitials('Conta Teste')).toBe('CT')
    expect(getInitials('  maria da silva ')).toBe('MS')
    expect(getInitials('Lucas')).toBe('L')
    expect(getInitials('')).toBe('')
  })
})

describe('formatDecimal', () => {
  it('formata centavos sem o símbolo da moeda', () => {
    expect(formatDecimal(123456)).toBe('1.234,56')
    expect(formatDecimal(5)).toBe('0,05')
  })
})
