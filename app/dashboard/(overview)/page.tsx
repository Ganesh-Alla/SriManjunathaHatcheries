"use client"
import { lusitana } from '@/app/ui/fonts';
import React, { useEffect, useRef, useState } from 'react';
import {notification, Radio} from 'antd';
import type { RadioChangeEvent } from 'antd';
import {  supabaseAnon } from '@/utils/supabase/client';
import { format, parse } from 'date-fns';


type NotificationType = 'success' | 'info' | 'warning' | 'error';




const RegistrationPage: React.FC = () => {

  const [quantity, setQuantity] = useState<string>('');
  const [preference, setPreference] = useState('');
  const hiddenButtonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [api, contextHolder] = notification.useNotification();

  const [date, setDate] = useState<string>('');
  const [previousDate, setPreviousDate] = useState<string>('');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDate = e.target.value;
setPreviousDate(inputDate)
    try {
      const parsedDate = parse(inputDate, 'yyyy-MM-dd', new Date());
      const newDate = format(parsedDate, 'dd/MM/yy');
      console.log(newDate)
      setDate(newDate);
    } catch (error) {
      setDate('');
    }

  }

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: 'Success',
      description:
        'Data Inserted successfully',
    });
  };


  const units = ['Maheshwara', 'Vishnu', 'Ganga','Yamuna'];
  const preferenceOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  const handleClick = () => {
    if (hiddenButtonRef.current) {
      hiddenButtonRef.current.click();
    }
  };

  const formatNumber = (value: string): string => {
    if (value === '') return '';
    const numberFormatter = new Intl.NumberFormat('en-IN');
    return numberFormatter.format(parseInt(value, 10));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const input = e.target.value.replace(/,/g, '');
    if (!isNaN(Number(input))) {
      setQuantity(formatNumber(input));
    }};


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(formRef.current!);

  const formObject: { [key: string]: FormDataEntryValue } = {};
      const entries = Array.from(formData.entries());
      entries.forEach(([key, value]) => {
        if (key === 'dateOfOrder') {
          formObject[key] = date
        }
        else if (key === 'selenity'){
          formObject[key] = value + " %"
        }
        else{
          formObject[key] = value
        }
      });
      console.log("Inserted")

      const { data, error } = await supabaseAnon
.from('Invoices')
.insert([
 formObject
])
formRef.current?.reset();
setQuantity('');
setPreference('');
setDate('');
setPreviousDate('')
openNotificationWithIcon('success');

  if(error){
    console.log('Error inserting', error);
  }

};

  return (
    <main className="w-full h-full">
        {contextHolder}
    <div className="flex w-full  items-center justify-between">
    <h1 className={`${lusitana.className} text-2xl`}>Create Record </h1>
    <button onClick={handleClick} className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          Submit
        </button>
  </div>
    <div className=" p-2 rounded-lg shadow-lg w-full max-w-md h-full">
      <form  ref={formRef} onSubmit={handleSubmit} className='h-full overflow-y-auto'>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="dateOfOrder">Date of Order</label>
          <input
            type="date"
            id="dateOfOrder"
            name="dateOfOrder"
            value={previousDate}
            onChange={handleDateChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="selenity">Selenity</label>
          <input
            type="number"
            id="selenity"
            name="selenity"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter Selenity"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="quantity">Quantity</label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter quantity"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="unit">Unit</label>
          <select
            id="unit"
            name="unit"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            required
          >
            <option value="">Select a unit</option>
            {units.map((unit, index) => (
              <option key={index} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="phoneNumber">Phone Number</label>
          <input
            type="number"
            maxLength={10}
            id="phoneNumber"
            name="phoneNumber"

            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter phone number (+91)"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Preference</label>
          <Radio.Group options={preferenceOptions} name='preference'
          onChange={({ target: { value } }: RadioChangeEvent) => {
            setPreference(value);
            }}
  value={preference} />
        </div>
        <button ref={hiddenButtonRef} type='submit' hidden>
        Submit
        </button>
      </form>
    </div>
    </main>
  );
};

export default RegistrationPage;