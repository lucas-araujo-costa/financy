import { describe, expect, it } from 'vitest'

import { type Either, left, right } from './either'

function divide(a: number, b: number): Either<string, number> {
  if (b === 0) {
    return left('division by zero')
  }

  return right(a / b)
}

describe('Either', () => {
  it('should return a right value on success', () => {
    const result = divide(10, 2)

    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)
    expect(result.value).toBe(5)
  })

  it('should return a left value on failure', () => {
    const result = divide(10, 0)

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)
    expect(result.value).toBe('division by zero')
  })

  it('should narrow the value type through the type guards', () => {
    const result = divide(9, 3)

    if (result.isRight()) {
      const quotient: number = result.value
      expect(quotient).toBe(3)
    } else {
      expect.unreachable()
    }
  })
})
