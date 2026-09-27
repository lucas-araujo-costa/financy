import { zodResolver } from '@hookform/resolvers/zod'
import { MailIcon, UserRoundIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { TextInput } from '@/components/ui/text-input'

import { type ProfileValues, profileSchema } from '../schemas/profile-schema'

interface ProfileFormProps {
  user: { name: string; email: string }
  onSubmit: (values: ProfileValues) => Promise<unknown> | void
  isSubmitting?: boolean
}

export function ProfileForm({
  user,
  onSubmit,
  isSubmitting = false,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name },
  })

  return (
    <form
      id="profile-form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <Field label="Nome completo" htmlFor="name" error={errors.name?.message}>
        <TextInput.Root invalid={Boolean(errors.name)}>
          <TextInput.Icon>
            <UserRoundIcon />
          </TextInput.Icon>
          <TextInput.Field
            id="name"
            autoComplete="name"
            placeholder="Seu nome completo"
            aria-invalid={Boolean(errors.name)}
            aria-describedby="name-message"
            {...register('name')}
          />
        </TextInput.Root>
      </Field>

      <Field
        label="E-mail"
        htmlFor="email"
        helper="O e-mail não pode ser alterado"
      >
        <TextInput.Root>
          <TextInput.Icon>
            <MailIcon />
          </TextInput.Icon>
          <TextInput.Field
            id="email"
            type="email"
            value={user.email}
            disabled
            readOnly
            aria-describedby="email-message"
          />
        </TextInput.Root>
      </Field>

      <Button type="submit" isLoading={isSubmitting} className="mt-4 w-full">
        Salvar alterações
      </Button>
    </form>
  )
}
