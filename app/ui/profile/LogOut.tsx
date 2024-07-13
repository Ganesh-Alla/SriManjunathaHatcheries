"use client"

import React, { useState } from 'react'
import { Modal } from 'antd';
import { lusitana } from '@/app/ui/fonts';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { createClient } from '@/utils/supabase/client';

const { confirm } = Modal;
const LogOut = () => {

    const showDeleteConfirm = () => {
        confirm({
          title: 'Are you sure want to Log Out?',
          icon: <ExclamationCircleFilled />,
          content: 'Click Confirm to Log Out...',
          okText: 'Confirm',
          okType: 'danger',
          cancelText: 'Cancel',
          async onOk() {
            'use server';
            try{
            const supabase = createClient();
            await supabase.auth.signOut();
            await new Promise(resolve => setTimeout(resolve, 1000));
            window.location.href = '/login';
          } catch (error) {
            console.error('Error logging out:', error);
          }
          },
        });
      };
  return (
    <div className="flex w-full  items-center justify-between">
    <h1 className={`${lusitana.className} text-2xl`}>Profile Page</h1>
    <button onClick={showDeleteConfirm} className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
    Log Out
  </button>
  </div>
  )
}

export default LogOut