import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  clearAuthToken,
  getAuthToken,
  setAuthToken,
  subscribeAuthToken,
} from './auth-token'

describe('auth-token', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('com "Lembrar-me" guarda no localStorage', () => {
    setAuthToken('abc', true)
    expect(localStorage.length).toBe(1)
    expect(sessionStorage.length).toBe(0)
    expect(getAuthToken()).toBe('abc')
  })

  it('sem "Lembrar-me" guarda no sessionStorage', () => {
    setAuthToken('abc', false)
    expect(localStorage.length).toBe(0)
    expect(sessionStorage.length).toBe(1)
    expect(getAuthToken()).toBe('abc')
  })

  it('um novo login substitui o token anterior do outro storage', () => {
    setAuthToken('old', true)
    setAuthToken('new', false)
    expect(localStorage.length).toBe(0)
    expect(getAuthToken()).toBe('new')
  })

  it('clearAuthToken limpa os dois storages', () => {
    setAuthToken('abc', true)
    clearAuthToken()
    expect(getAuthToken()).toBeNull()
  })
})

describe('subscribeAuthToken', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('avisa quem assinou quando o token entra e sai', () => {
    const listener = vi.fn()
    const unsubscribe = subscribeAuthToken(listener)

    setAuthToken('abc', true)
    clearAuthToken()
    expect(listener).toHaveBeenCalledTimes(2)

    unsubscribe()
    setAuthToken('abc', true)
    expect(listener).toHaveBeenCalledTimes(2)
  })

  it('não avisa ao limpar quando já não havia token', () => {
    const listener = vi.fn()
    subscribeAuthToken(listener)

    clearAuthToken()
    expect(listener).not.toHaveBeenCalled()
  })
})
