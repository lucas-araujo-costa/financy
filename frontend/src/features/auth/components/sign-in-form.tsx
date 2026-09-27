import { zodResolver } from '@hookform/resolvers/zod'
import { MailIcon, UserRoundPlusIcon } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { Link as RouterLink } from 'react-router'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Divider } from '@/components/ui/divider'
import { Field } from '@/components/ui/field'
import { Link } from '@/components/ui/link'
import { TextInput } from '@/components/ui/text-input'

import { type SignInValues, signInSchema } from '../schemas/sign-in-schema'
import { PasswordInput } from './password-input'

interface SignInFormProps {
  onSubmit: (values: SignInValues) => Promise<unknown> | void
  isSubmitting?: boolean
}

export function SignInForm({
  onSubmit,
  isSubmitting = false,
}: SignInFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
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
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            invalid={Boolean(errors.password)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby="password-message"
            {...register('password')}
          />
        </Field>

        <div className="flex items-center justify-between gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm leading-5 text-gray-700">
            <Controller
              control={control}
              name="remember"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              )}
            />
            Lembrar-me
          </label>

          {/* Fora dos requisitos: o link aparece como no Figma, sem fluxo (docs/decisions.md, ADR-13) */}
          <Link asChild>
            <button
              type="button"
              onClick={() => toast.info('Recuperação de senha em breve.')}
            >
              Recuperar senha
            </button>
          </Link>
        </div>
      </div>

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Entrar
      </Button>

      <Divider>ou</Divider>

      <div className="flex flex-col gap-4">
        <p className="text-center text-sm leading-5 text-gray-600">
          Ainda não tem uma conta?
        </p>
        <Button asChild variant="outline" className="w-full">
          <RouterLink to="/cadastro" viewTransition>
            <UserRoundPlusIcon aria-hidden />
            Criar conta
          </RouterLink>
        </Button>
      </div>
    </form>
  )
}
