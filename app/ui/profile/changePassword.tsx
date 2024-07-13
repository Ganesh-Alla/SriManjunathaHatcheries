"use client"
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useFormState, useFormStatus } from 'react-dom';

import { redirect } from "next/navigation";
import { SubmitButton } from "../submit-button";
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

export default function ResetForm() {

  const [code, action] = useFormState(authenticate, undefined);
  const [api, contextHolder] = notification.useNotification();


  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: 'Success',
      description:
        'Password Updated successfully',
    });
  };

  async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try{
        const OldPassword = formData.get("OldPassword") as string;
        const NewPassword = formData.get("NewPassword") as string;

        const supabase = createClient();
        const {
            data: { session },
          } = await supabase.auth.getSession();
        const {data:login, error:loginErr } = await supabase.auth.signInWithPassword({
            email:session?.user?.email as string,
            password:OldPassword,
          });
if(login.user){

    if(OldPassword === NewPassword){
        return "Mismatch"
    }
    const {data, error } = await supabase.auth.updateUser({
          password:NewPassword,
        });
        if(data.user){
                openNotificationWithIcon('success');
                await new Promise((resolve) => setTimeout(resolve, 2000));
          return "login";
        }

        if(error){
          console.log('Error resetting', error);
          return "CredentialSignin"
        }
}else{
    return "Invalid credentials"
}
    }catch(error){
      console.log(error)
    }
  }




  if(code === 'login') {
    redirect('/dashboard');
  }


  return (
    <form className="space-y-3">
        {contextHolder}
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
         Change Your Password
        </h1>
        <div className="w-full">
          <div>
          <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="OldPassword"
            >
              Old Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="OldPassword"
                type="password"
                name="OldPassword"
                placeholder="Enter Old Password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="NewPassword"
            >
             New Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="NewPassword"
                type="password"
                name="NewPassword"
                placeholder="New Your Password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

        </div>
        <SubmitButton
        formAction={action}
        className='mt-4 w-full flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50'
        pendingText="Saving..."
        >
        Save <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </SubmitButton>
        <div className="flex h-8 items-end space-x-1">
            {code === "Mismatch" && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p aria-live="polite" className="text-sm text-red-500">
               Password Cannot be Previous One.
              </p>
            </>
          )
            }
          { code ==='Invalid credentials' && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p aria-live="polite" className="text-sm text-red-500">
               Old Password is Wrong
              </p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
