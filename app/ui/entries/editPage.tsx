"use client"
import { lusitana } from '@/app/ui/fonts';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { notification, Radio, Spin } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { supabaseAnon } from '@/utils/supabase/client';
import { format, parse } from 'date-fns';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface DataType {
  key?: React.Key;
  id?: number;
  dateOfOrder: string;
  name: string;
  selenity: string;
  quantity: string;
  unit: string;
  preference: string;
  phoneNumber: string;
}

const fetchData = async (
  setData: React.Dispatch<React.SetStateAction<DataType>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  recordId: string
) => {
  setLoading(true);
  try {
    const { data, error } = await supabaseAnon
      .from('Invoices')
      .select('*')
      .eq('id', recordId);

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      // console.log('Fetching data:', data)
      if (data && data.length > 0) {
        const { name, dateOfOrder, selenity, quantity, unit, phoneNumber, preference } = data[0];
        const parsedDate = parse(dateOfOrder, 'dd/MM/yy', new Date());
        const newDate = format(parsedDate, 'yyyy-MM-dd');
        setData({
          name,
          dateOfOrder:newDate,
          selenity:selenity.replace(/[^0-9]/g, ''),
          quantity,
          unit,
          phoneNumber:phoneNumber,
          preference,
        });
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  setLoading(false);
};


export default function EditInvoiceForm({
  recordId,
}: {
  recordId: string;
}) {

  const hiddenButtonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [api, contextHolder] = notification.useNotification();
  const [formData, setFormData] = useState<DataType>({
    name: '',
    dateOfOrder: '',
    selenity: '',
    quantity: '',
    unit: '',
    phoneNumber: '',
    preference: '',
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData(setFormData, setLoading, recordId);
  }, [recordId]);

  const [preference, setPreference] = useState<string>(formData.preference);
  const formatNumber = (value: string): string => {
    if (value === '') return '';
    const numberFormatter = new Intl.NumberFormat('en-IN');
    return numberFormatter.format(parseInt(value, 10));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    var x = value
    if (name === 'quantity') {
      const input = e.target.value.replace(/,/g, '');
      if (!isNaN(Number(input))) {
        x=formatNumber(input)
      }
    }
      if (formData) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: x,
        }));
      }

    };

    useEffect(() => {
      setFormData((prevData) => ({
        ...prevData,
         ['preference']: preference,
      }));
    }, [preference]);


  const units = ['Maheshwara', 'Vishnu', 'Ganga', 'Yamuna'];
  const preferenceOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  const handleClick = () => {
    if (hiddenButtonRef.current) {
      hiddenButtonRef.current.click();
    }
  };
  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: 'Success',
      description:
        'Data updated successfully',
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(formRef.current!);

    const formObject: { [key: string]: FormDataEntryValue } = {};
        const entries = Array.from(formData.entries());
        entries.forEach(([key, value]) => {
          if (key === 'dateOfOrder') {
            const parsedDate = parse(value as string, 'yyyy-MM-dd', new Date());
            const newDate = format(parsedDate, 'dd/MM/yy');
            formObject[key] = newDate
          }
          else if (key === 'selenity'){
            formObject[key] = value + " %"
          }
          else{
            formObject[key] = value
          }
        });
        openNotificationWithIcon('success');
        await new Promise(resolve => setTimeout(resolve, 1000));
         setLoading(true)
        const { data, error } = await supabaseAnon
        .from('Invoices')
        .update(
         formObject
        )
        .eq('id', recordId)

        if(error){
          console.log('Error inserting', error);
          setLoading(false)
          return
        }

        window.location.replace('/dashboard/entries')
  };

  if(loading){
  return  <Spin size='large' className='flex items-center justify-center'/>
  }

  return (
    <main className="w-full h-full">
        {contextHolder}
    <div className="flex w-full  items-center justify-between">
    <h1 className={`${lusitana.className} text-2xl`}>Create Record </h1>
    <button
    onClick={handleClick}
    className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          Submit
        </button>
  </div>
    <div className=" p-2 rounded-lg shadow-lg w-full max-w-md h-full">
      <form  ref={formRef}
      onSubmit={handleSubmit}
       className='h-full overflow-y-auto'>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="dateOfOrder">Date</label>
          <input
            type="date"
            id="dateOfOrder"
            name="dateOfOrder"
            defaultValue={formData.dateOfOrder}
            onChange={handleChange}
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
            defaultValue={formData.selenity}
            onChange={handleChange}
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
            value={formData.quantity}
            onChange={handleChange}
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
            value={formData.unit}
            onChange={handleChange}
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
            value={formData.phoneNumber?Number(formData.phoneNumber):''}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter phone number (+91)"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Preference</label>
          <Radio.Group options={preferenceOptions} value={formData.preference} name='preference'
          onChange={({ target: { value } }: RadioChangeEvent) => {
            setPreference(value);
            }}
  />
        </div>
        <button ref={hiddenButtonRef} type='submit' hidden>
        Submit
        </button>
      </form>
    </div>
    </main>
  );
};
