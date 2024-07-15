
import { Suspense } from 'react';
import { Metadata } from 'next';
import CustomTable from '@/app/ui/custom/table';
import { Spin } from 'antd';

export const metadata: Metadata = {
  title: 'Entries',
};

export default async function Page() {

  return (
    <div className="w-full select-none">
       <Suspense fallback={<Spin className='flex items-center justify-center'/>}>
       <CustomTable/>
      </Suspense>
    </div>
  );
}