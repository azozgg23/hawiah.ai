'use client'

import { useProfile } from '@/hooks/use-profile'
import { ProfileForm } from '@/components/account/profile-form'

export default function AccountPage() {
  const { profile, loading, error, mutate } = useProfile()

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">Account Settings</h1>
        <p className="mt-4 text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">Account Settings</h1>
        <p className="mt-4 text-destructive">
          {error || 'Failed to load profile'}
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Account Settings</h1>
      <ProfileForm profile={profile} onUpdate={mutate} />
    </div>
  )
}
