/**
 * Forma de comparação de textos digitados pelo usuário: sem acentos, em
 * minúsculas e com os espaços colapsados. "  Saúde  e Bem-Estar" vira
 * "saude e bem-estar".
 */
export function normalizeText(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}
