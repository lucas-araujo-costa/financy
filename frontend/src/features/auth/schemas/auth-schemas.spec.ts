import { describe, expect, it } from 'vitest'

import { signInSchema } from './sign-in-schema'
import { signUpSchema } from './sign-up-schema'

describe('signInSchema', () => {
  it('aceita e-mail e senha preenchidos', () => {
    const result = signInSchema.safeParse({
      email: 'conta@teste.com',
      password: 'qualquer',
      remember: false,
    })
    expect(result.success).toBe(true)
  })

  it('recusa e-mail inválido e senha vazia', () => {
    const result = signInSchema.safeParse({
      email: 'conta',
      password: '',
      remember: false,
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual([
      'email',
      'password',
    ])
  })
})

describe('signUpSchema', () => {
  it('exige senha com no mínimo 8 caracteres', () => {
    const base = { name: 'Conta Teste', email: 'conta@teste.com' }
    expect(
      signUpSchema.safeParse({ ...base, password: '1234567' }).success,
    ).toBe(false)
    expect(
      signUpSchema.safeParse({ ...base, password: '12345678' }).success,
    ).toBe(true)
  })

  it('recusa nome só com espaços e remove os espaços das pontas', () => {
    const base = { email: 'conta@teste.com', password: '12345678' }
    expect(signUpSchema.safeParse({ ...base, name: '   ' }).success).toBe(false)
    expect(signUpSchema.parse({ ...base, name: '  Conta  ' }).name).toBe(
      'Conta',
    )
  })
})
