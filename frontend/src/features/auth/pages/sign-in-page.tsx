import { AuthCard } from '../components/auth-card'
import { SignInForm } from '../components/sign-in-form'
import { useAuthenticate } from '../hooks/use-authenticate'

export function SignInPage() {
  const { signIn, isSubmitting } = useAuthenticate()

  return (
    <AuthCard
      title="Fazer login"
      description="Entre na sua conta para continuar"
    >
      <SignInForm onSubmit={signIn} isSubmitting={isSubmitting} />
    </AuthCard>
  )
}
