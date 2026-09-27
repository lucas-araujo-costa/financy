import { zodResolver } from '@hookform/resolvers/zod'
import { LogInIcon, MailIcon, UserRoundIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link as RouterLink } from 'react-router'

import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Field } from '@/components/ui/field'
import { TextInput } from '@/components/ui/text-input'

import { type SignUpValues, signUpSchema } from '../schemas/sign-up-schema'
import { PasswordInput } from './password-input'

interface SignUpFormProps {
  onSubmit: (values: SignUpValues) => Promise<unknown> | void
  isSubmitting?: boolean
}

export function SignUpForm({
  onSubmit,
  isSubmitting = false,
}: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        <Field
          label="Nome completo"
          htmlFor="name"
          error={errors.name?.message}
        >
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

        <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
          <TextInput.Root invalid={Boolean(errors.email)}>
            <TextInput.Icon>
              <MailIcon />
            </TextInput.Icon>
            <TextInput.Field
              id="email"
              type="email"
              autoComplete="email"
              placeholder="mail@exemplo.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby="email-message"
              {...register('email')}
            />
          </TextInput.Root>
        </Field>

        <Field
          label="Senha"
          htmlFor="password"
          helper="A senha deve ter no mínimo 8 caracteres"
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Digite sua senha"
            invalid={Boolean(errors.password)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby="password-message"
            {...register('password')}
          />
        </Field>
      </div>

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Cadastrar
      </Button>

      <Divider>ou</Divider>

      <div className="flex flex-col gap-4">
        <p className="text-center text-sm leading-5 text-gray-600">
          Já tem uma conta?
        </p>
        <Button asChild variant="outline" className="w-full">
          <RouterLink to="/" viewTransition>
            <LogInIcon aria-hidden />
            Fazer login
          </RouterLink>
        </Button>
      </div>
    </form>
  )
}
