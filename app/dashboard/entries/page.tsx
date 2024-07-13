
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { Metadata } from 'next';
import EnteriesTable from '@/app/ui/entries/table';
import { Spin } from 'antd';

export const metadata: Metadata = {
  title: 'Entries',
};

export default async function Page() {

  return (
    <div className="w-full">
       <Suspense fallback={<Spin className='flex items-center justify-center'/>}>
       <EnteriesTable/>
      </Suspense>
    </div>
  );
}