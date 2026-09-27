import { z } from 'zod'

// No Figma só o nome é editável ("O e-mail não pode ser alterado")
export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome completo'),
})

export type ProfileValues = z.infer<typeof profileSchema>
