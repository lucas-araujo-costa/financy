import { describe, expect, it } from 'vitest'

import { ValueObject } from './value-object'

class Money extends ValueObject<{ amountInCents: number; currency: string }> {
  static create(amountInCents: number, currency = 'BRL') {
    return new Money({ amountInCents, currency })
  }
}

describe('ValueObject', () => {
  it('should be equal to another value object with the same values', () => {
    expect(Money.create(100).equals(Money.create(100))).toBe(true)
  })

  it('should not be equal when any value differs', () => {
    expect(Money.create(100).equals(Money.create(200))).toBe(false)
    expect(Money.create(100).equals(Money.create(100, 'USD'))).toBe(false)
  })
})
