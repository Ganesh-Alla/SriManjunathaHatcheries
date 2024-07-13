

import { createClient } from '@/utils/supabase/server';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Metadata } from 'next';
import { Suspense, useState } from 'react';
import LogOut from '@/app/ui/profile/LogOut';
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();



    return (
      <Suspense fallback={<p>Loading...</p>}>
        <main className="w-full h-full">
    <LogOut/>

  <div className='flex flex-col gap-10'>
  <div className="flex flex-col gap-4 p-4 rounded-lg shadow-lg w-full max-w-md ">
    <div className='mt-4 w-full flex h-10 items-center rounded-lg bg-blue-700 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50'
    >
      <h2 className="text-xl font-medium">
        {user?.email}
       </h2>
      </div>
      </div>
  <Link href="/dashboard/profile/edit-name" className="flex flex-col gap-4 p-4 rounded-lg shadow-lg w-full max-w-md ">
  <div className='flex items-center justify-between'>
  <h3>Change Username</h3> <ArrowRightIcon className=" h-5 w-5 text-black" />
      </div>
      </Link>
  <Link href="/dashboard/profile/change-password"  className="flex flex-col gap-4 p-4 rounded-lg shadow-lg w-full max-w-md " >
  <div className='flex items-center justify-between'>
    <h3>Change Password</h3> <ArrowRightIcon className=" h-5 w-5 text-black" />
      </div>
    </Link>
    </div>
  </main>
      </Suspense>
    )
}