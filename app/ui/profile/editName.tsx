"use client";
import { lusitana } from '@/app/ui/fonts';
import {
  UserIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useFormState } from 'react-dom';
import { useEffect, useState } from 'react';
import { createClient, supabaseAnon } from '@/utils/supabase/client';
import { SubmitButton } from '../submit-button';
import { Spin } from 'antd';
import { redirect } from 'next/navigation';

export default function EditUsername() {
  const [code, action] = useFormState(authenticate, undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const supabase = createClient();

  async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      if (!username) {
        return 'No username';
      }

      const { data, error } = await supabase
      .from('users')
      .update({ name: username })
      .eq('email',email)
      .select()

      if (error) {
        console.error('Error updating data:', error);
        return 'Error updating data';
      } else {
        window.location.reload();
        return "Changed";
      }
    } catch (error) {
      console.log(error);
      return 'Error updating data';
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.email) {
        setEmail(session.user.email);
        const { data: users, error } = await supabase
          .from('users')
          .select('name')
          .eq('email', session.user.email);

        if (error) {
          console.error('Error fetching data:', error);
        } else if (users && users.length > 0) {
          setUsername(users[0].name);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

 if(code === "Changed"){
     redirect('/dashboard/profile');
 }

  if (loading) {
    return <Spin className="flex items-center justify-center" />;
  } else {
    return (
      <form className="space-y-3" >
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>Edit Your Name</h1>
          <div className="w-full">
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <SubmitButton
            formAction={action}
            className="mt-4 w-full flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
            pendingText="Saving..."
          >
            Save <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </SubmitButton>
          <div className="flex h-8 items-end space-x-1">
            {code === 'No username'  && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p aria-live="polite" className="text-sm text-red-500">
                  Please Enter Your Name!
                </p>
              </>
            )}
          </div>
        </div>
      </form>
    );
  }
}
