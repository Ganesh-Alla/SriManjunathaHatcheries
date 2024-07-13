import NavLinks from '@/app/ui/dashboard/nav-links';
import Name from '@/app/ui/display-name';
import { PowerIcon } from '@heroicons/react/24/outline';
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div
        className="mb-2 flex h-20 items-center justify-between rounded-md bg-blue-600 p-4 md:h-40"
      >
        <div className="w-3/2 text-white md:w-40">
          <Name />
        </div>
        <div className="md:w-40">
          <Image src="/smh-mini.png" alt="alt" width={50} height={50} />
        </div>
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form className='hidden md:block' action={async () => {
            'use server';
            const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
          }}>
          <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
