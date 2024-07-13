import { anton } from '@/app/ui/fonts';
import { poppins } from '@/app/ui/fonts';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
export default async function Page() {

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="flex h-screen md:min-h-screen flex-col p-6 no-scroll">
      <div className="flex h-15 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-32">
      <Image
            src="/smh-logo.svg"
            width={250}
            height={250}
            className="hidden md:block"
            alt="Logo"
          />
          <Image
           src="/smh-logo.svg"
            width={180}
            height={180}
            className="block md:hidden"
            alt="Logo"
          />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`${poppins.className} text-sm text-gray-800 md:text-xl md:leading-normal`}>
            <a href="http://www.srimanjunathahatcheries.com" className={`${anton.className} text-xl font-bold md:text-3xl text-blue-500`}>
            Sri Manjunatha Hatcheries
            </a><br/>
            Leading shrimp post larvae seed provider in the aquaculture industry.
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span>
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-6">
          <Image
            src="/Prawn.svg"
            width={450}
            height={450}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop and mobile versions"
          />
          <Image
           src="/Prawn.svg"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshot of the dashboard project showing mobile version"
          />
        </div>
      </div>
    </main>
  );
}
