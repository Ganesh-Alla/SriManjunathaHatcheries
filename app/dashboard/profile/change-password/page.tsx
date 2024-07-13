import Breadcrumbs from '@/app/ui/profile/breadcrumbs'
import ChangePassword from '@/app/ui/profile/changePassword'
import React from 'react'

const EditName = () => {
  return (
    <main>
         <Breadcrumbs
        breadcrumbs={[
          { label: 'Profile', href: '/dashboard/profile' },
          {
            label: 'Change Password',
            href: '/dashboard/profile/change-password',
            active: true,
          },
        ]}
      />
      <ChangePassword/>
    </main>
  )
}

export default EditName