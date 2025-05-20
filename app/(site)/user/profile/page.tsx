import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { auth } from '@/auth'
import ProfileForm from '@/components/user/profile/ProfileForm'

const ProfilePage = async () => {
  const session = await auth()
  return (
    <div className="relative z-10 container mx-auto w-full max-w-screen-xl px-4 py-4 md:px-16">
      <Card>
        <CardContent>
          <ProfileForm user={session?.user} />
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
