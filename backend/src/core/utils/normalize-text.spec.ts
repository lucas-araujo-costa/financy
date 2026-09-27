import { describe, expect, it } from 'vitest'

import { normalizeText } from './normalize-text'

describe('normalizeText', () => {
  it('should remove accents and lowercase the text', () => {
    expect(normalizeText('ÁGUA, Café e Pão')).toBe('agua, cafe e pao')
  })

  it('should trim and collapse spaces', () => {
    expect(normalizeText('  Mercado   Livre ')).toBe('mercado livre')
  })

  it('should make accented and plain spellings equal', () => {
    expect(normalizeText('Saúde')).toBe(normalizeText('saude'))
  })
})
