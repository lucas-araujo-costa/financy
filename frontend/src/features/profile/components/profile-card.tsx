import { LogOutIcon } from 'lucide-react'

import { UserAvatar } from '@/components/shared/user-avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSignOut } from '@/features/auth'

import type { ProfileValues } from '../schemas/profile-schema'
import { ProfileForm } from './profile-form'

interface ProfileCardProps {
  user: { name: string; email: string }
  onSubmit: (values: ProfileValues) => Promise<unknown> | void
  isSubmitting?: boolean
}

/** Card do Figma "Perfil": avatar, nome e e-mail, formulário e "Sair da conta". */
export function ProfileCard({
  user,
  onSubmit,
  isSubmitting,
}: ProfileCardProps) {
  const signOut = useSignOut()

  return (
    <Card className="flex animate-in flex-col gap-8 p-8 duration-slow ease-out fade-in-0">
      <header className="flex flex-col items-center gap-6 text-center">
        <UserAvatar name={user.name} className="size-16 text-2xl leading-10" />
        <div className="flex w-full flex-col gap-0.5">
          <h1 className="truncate text-xl leading-7 font-semibold text-gray-800">
            {user.name}
          </h1>
          <p className="truncate text-base leading-6 text-gray-500">
            {user.email}
          </p>
        </div>
      </header>

      <div className="h-px w-full bg-gray-200" />

      <div className="flex flex-col gap-4">
        <ProfileForm
          user={user}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
        <Button variant="outline" className="w-full" onClick={signOut}>
          <LogOutIcon aria-hidden className="text-danger" />
          Sair da conta
        </Button>
      </div>
    </Card>
  )
}

/** Mesmo formato do card, para não haver salto quando os dados chegam (AGENTS.md › Movimento). */
export function ProfileCardSkeleton() {
  return (
    <Card aria-busy className="flex flex-col gap-8 p-8">
      <span className="sr-only">Carregando perfil</span>
      <div className="flex flex-col items-center gap-6">
        <Skeleton className="size-16 rounded-full" />
        <div className="flex w-full flex-col items-center gap-0.5">
          <Skeleton className="my-1 h-5 w-40" />
          <Skeleton className="my-1 h-4 w-48" />
        </div>
      </div>
      <div className="h-px w-full bg-gray-200" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-4 w-44" />
        </div>
        <Skeleton className="mt-4 h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </Card>
  )
}
