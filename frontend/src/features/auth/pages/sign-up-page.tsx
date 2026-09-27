import { AuthCard } from '../components/auth-card'
import { SignUpForm } from '../components/sign-up-form'
import { useRegister } from '../hooks/use-register'

export function SignUpPage() {
  const { signUp, isSubmitting } = useRegister()

  return (
    <AuthCard
      title="Criar conta"
      description="Comece a controlar suas finanças ainda hoje"
    >
      <SignUpForm onSubmit={signUp} isSubmitting={isSubmitting} />
    </AuthCard>
  )
}
