import LoginForm from '@/app/ui/login-form';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function LoginPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-center rounded-lg bg-blue-500 p-3 md:h-36">
      <Image src="/smh-logo.svg" alt="alt" width={250} height={250} />
        </div>
        <LoginForm />
      </div>
    </main>
  );
}