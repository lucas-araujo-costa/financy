// E-mail não diferencia maiúsculas: "Ana@Mail.com" e "ana@mail.com" são a
// mesma conta.
export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}
