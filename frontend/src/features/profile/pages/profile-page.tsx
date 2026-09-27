import { useSession } from '@/features/auth'

import { ProfileCard, ProfileCardSkeleton } from '../components/profile-card'
import { useEditProfile } from '../hooks/use-edit-profile'

export function ProfilePage() {
  const { user } = useSession()
  const { save, isSubmitting } = useEditProfile()

  return (
    <div className="mx-auto w-full max-w-[448px]">
      {user ? (
        <ProfileCard user={user} onSubmit={save} isSubmitting={isSubmitting} />
      ) : (
        <ProfileCardSkeleton />
      )}
    </div>
  )
}
