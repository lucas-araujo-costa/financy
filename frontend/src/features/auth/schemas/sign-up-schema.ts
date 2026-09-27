import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome completo'),
  email: z.email('Informe um e-mail válido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

export type SignUpValues = z.infer<typeof signUpSchema>
