import { z } from 'zod'

export const signInSchema = z.object({
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe sua senha'),
  remember: z.boolean(),
})

export type SignInValues = z.infer<typeof signInSchema>
