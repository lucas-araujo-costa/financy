// A descrição da categoria é opcional: vazia ou só com espaços vira null.
export function normalizeDescription(description?: string | null) {
  const trimmed = description?.trim()

  return trimmed || null
}
