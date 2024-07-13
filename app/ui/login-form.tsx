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
import { SubmitButton } from "./submit-button";
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try{
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const supabase = createClient();
      const {data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if(data.user){
        return "dashboard"
      }
      if(error){
        console.log('Error signing in', error);
        return "CredentialSignin"
      }
  }catch(error){
    console.log("Error",error)
  }
}
async function resetPassword(
  prevState: string | undefined,
  formData: FormData,
) {
  try{
      const email = formData.get("email") as string;
    if (!email) {
      console.log('Email is required');
      return;
    }
    const supabase = createClient();

    const {data:resetData, error } = await supabase.auth.resetPasswordForEmail(email as string,
      { redirectTo:`${window?.location.href}/reset`}
    );

    if (resetData) {
      return 'success'
    }

    if(error){
      if(error.message === 'Email rate limit exceeded'){
        alert('Reset Password limit exceeded. Please try again later.');
      }
    }
  }catch(error){
    console.log("Error",error)
  }
}
export default function LoginForm() {

  const [code, action] = useFormState(authenticate, undefined);
  const [resetcode, handleReset] = useFormState(resetPassword, undefined);
  const [isReset, setReset] = useState<boolean>(false);



  if(code === 'dashboard') {
    redirect('/dashboard');
  }


  return (
    <form className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
         {isReset ?"Recover your Password": "Please log in to continue."}
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {!isReset && <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>}
          {isReset?<button onClick={()=>{setReset(false)}} type='button' className="text-blue-500 text-sm pt-5">Login?</button>:
          <button onClick={()=>{setReset(true)}} type='button' className="text-blue-500 text-sm pt-5">Reset password?</button>
          }
        </div>
        {isReset?<SubmitButton
        formAction={handleReset}
        className='mt-4 w-full flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50'
        pendingText="Sending Email..."
        disabled={resetcode === 'success'? true: false}
        >
          {resetcode?<>
              <EnvelopeIcon className="h-5 w-5 text-gray-50" />
              <p aria-live="polite" className="text-sm text-gray-50">
                Reset Link sent to your mail
              </p>
            </>:<>
        Send Email <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </>}
        </SubmitButton>
        :<SubmitButton
        formAction={action}
        className='mt-4 w-full flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50'
        pendingText="Signing In..."
        >
        Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </SubmitButton>}
        <div className="flex h-8 items-end space-x-1">
          {code === 'CredentialSignin' && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p aria-live="polite" className="text-sm text-red-500">
                Invalid credentials
              </p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
