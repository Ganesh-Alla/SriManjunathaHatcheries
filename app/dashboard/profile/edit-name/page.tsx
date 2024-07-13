import Breadcrumbs from '@/app/ui/profile/breadcrumbs'
import EditUsername from '@/app/ui/profile/editName'
import React from 'react'

const EditName = () => {
  return (
    <main>
         <Breadcrumbs
        breadcrumbs={[
          { label: 'Profile', href: '/dashboard/profile' },
          {
            label: 'User Name',
            href: '/dashboard/profile/edit-name',
            active: true,
          },
        ]}
      />
      <EditUsername/>
    </main>
  )
}

export default EditName