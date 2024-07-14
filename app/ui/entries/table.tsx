"use client"

import React, { Suspense, useEffect, useState } from 'react';
import { Button, DatePicker, Dropdown, Space, Spin, Table, Typography } from 'antd';
import type { MenuProps, TableColumnsType, TableProps } from 'antd';
import { supabaseAnon } from '@/utils/supabase/client';
import moment from 'moment';
import { lusitana } from '../fonts';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface DataType {
  key?: React.Key;
  date: string;
  name: string;
  selenity: string;
  quantity: string;
  unit: string;
  preference: string;
  phonenumber: string;
}


const parseDate = (dateString: string): number => {
  const [day, month, year] = dateString.split('/').map(part => parseInt(part, 10));
  return new Date(year, month - 1, day).getTime();
};



const EntriesTable: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredData, setFilteredData] = useState<DataType[]>(data);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabaseAnon
      .from('Invoices')
      .select('*')
      .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        const fetchedData = data.map((item: any, index: number) => ({
          key: index,
          date: item.dateOfOrder,
          name: item.name,
          selenity: item.selenity,
          quantity: item.quantity,
          unit: item.unit,
          preference: item.preference,
          phonenumber: item.phoneNumber,
        }));
        setData(fetchedData);
        setFilteredData(fetchedData);
      }
      setLoading(false);
    };

    fetchData();
  }, []);


  const columns: TableColumnsType<DataType> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 75,
      sorter: {
        compare: (a, b) => parseDate(a.date) - parseDate(b.date),
        multiple: 2,
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm,close }) => (
        <div style={{ padding: 8 }}>
          <DatePicker.RangePicker
            onChange={(dates) => {
              const formattedDates = dates ? dates.map(date => date?.format('DD/MM/YY')).filter((date): date is string => !!date) : [];
              setSelectedKeys(formattedDates ? [formattedDates[0]+","+formattedDates[1]]:[]);
               confirm();
            }}
            style={{ marginBottom: 8, display: 'block' }}
            format="DD/MM/YY"
          />
        </div>
      ),
      onFilter: (value, record) => {
        const recordDate = moment(record.date, 'DD/MM/YY');
        const [start, end] = (value as string).split(',');
        if(start === 'undefined' || end === 'undefined'){
          return true
        }
        return recordDate.isBetween(moment(start, 'DD/MM/YY'), moment(end, 'DD/MM/YY'), 'day', '[]');
},
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 120,
    },
    {
      title: 'Sel',
      dataIndex: 'selenity',
      key: 'selenity',
      width: 60,
      sorter: (a, b) => Number(a.selenity) - Number(b.selenity),
    },
    {
      title: 'Qnty',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      sorter: (a, b) => Number(a.quantity) - Number(b.quantity),
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      width: 100,
      filters: [
        {
          text: 'Maheshwara',
          value: 'Maheshwara',
        },
        {
          text: 'Vishnu',
          value: 'Vishnu',
        },
        {
          text: 'Ganga',
          value: 'Ganga',
        },
        {
          text: 'Yamuna',
          value: 'Yamuna',
        },
      ],
        onFilter: (value, record) => record.unit.indexOf(value as string) === 0,
    },
    {
      title: 'Ph No',
      dataIndex: 'phonenumber',
      key: 'phonenumber',
      render: (text: string) => <a href={`tel:${text}`}>{text}</a>,
    },
    {
      title: 'Pref',
      dataIndex: 'preference',
      key: 'preference',
      width: 60,
      sorter: {
        compare: (a, b) => b.preference.length - a.preference.length,
        multiple: 2,
      },
      filters: [
        {
          text: 'Yes',
          value: 'Yes',
        },
        {
          text: 'No',
          value: 'No',
        },],
        onFilter: (value, record) => record.preference.indexOf(value as string) === 0,
    },
  ];

  const rowClassName = (record: DataType) => {
    return record.preference === 'Yes' ? 'highlight-row' : '';
  };

  const generateCSVBlob = (data: DataType[]): Blob => {
    const headers = ['Date', 'Name', 'Selenity', 'Quantity', 'Unit', 'Phone Number', 'Preference'];
    const rows = data.map(item => [
      item.date,
      item.name,
      item.selenity,
      item.quantity,
      item.unit,
      item.phonenumber,
      item.preference
    ]);
  
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
  
    return new Blob([csvContent], { type: 'text/csv' });
  };
  

  const generateExcelBlob = (data: DataType[]): Blob => {
    const headers = ['Date', 'Name', 'Selenity', 'Quantity', 'Unit', 'Phone Number', 'Preference'];
    const rows = data.map((item) => [
      item.date,
      item.name,
      item.selenity,
      item.quantity,
      item.unit,
      item.phonenumber,
      item.preference
    ]);

    const TotalData = [headers, ...rows];

    const worksheet = XLSX.utils.aoa_to_sheet(TotalData);

    worksheet['!cols'] = [...Array(headers.length - 1).fill({ width: 20 })];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  };

const shareFile = async (file: File, fileName: string, fileType: string) => {
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: fileName,
        text: `Check out this ${fileType} file.`,
      });
    } catch (error) {
      console.error(`Error sharing ${fileType} file:`, error);
    }
  } else {
    console.warn('Web Share API is not supported in your browser.');
  }
};


const downloadFile = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const generatePDFBlob = (data: DataType[]): Blob => {
  const doc = new jsPDF();
  doc.text('Entries', 10, 10);

  const headers = [['Date', 'Name', 'Sel', 'Qnty', 'Unit', 'Ph.no', 'Pref']];
  const rows = data.map((item) => [item.date, item.name, item.selenity, item.quantity, item.unit, item.phonenumber, item.preference]);

  autoTable(doc, {
    head: headers,
    body: rows,
    startY: 20,
  });

  return doc.output('blob');
};


const handleShareCSV = (data: DataType[]) => {
  const csvBlob = generateCSVBlob(data);
  const csvFile = new File([csvBlob], `${formatDate()}.csv`, { type: 'text/csv' });
  shareFile(csvFile, `${formatDate()}.csv`, 'CSV');
};

const formatDate = () => {
  const dateObj = new Date();
  const day = String(dateObj.getDate()).padStart(2, '0'); // Get day with leading zero if needed
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Get month with leading zero if needed
  const year = dateObj.getFullYear(); // Get full year
  return `${day}-${month}-${year}`;
};

const handleSharePDF = async () => {
  const pdfBlob = generatePDFBlob(filteredData);
  const pdfFile = new File([pdfBlob], `${formatDate()}.pdf`, { type: 'application/pdf' });
  shareFile(pdfFile, `${formatDate()}.pdf`, 'PDF');
};

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <button
        onClick={() => {
          handleShareCSV(filteredData);
        }}
    >
      Share as CSV
    </button>
      ),
    },
    {
      key: '2',
      label: (
        <button onClick={() => {
            handleSharePDF()
        }}
 >
          Share as PDF
        </button>
      ),
    },
    {
      key: '3',
      label: (
        <button
        onClick={() => {
          const blob = generateExcelBlob(filteredData);
          downloadFile(blob, `${formatDate()}.xlsx`);
        }}
 >
          Download Excel
        </button>
      ),
    },
    {
      key: '4',
      label: (
        <button onClick={() => {
          const blob = generatePDFBlob(filteredData);
          downloadFile(blob, `${formatDate()}.pdf`);
        }}
 >
          Download PDF
        </button>
      ),
    },
  ];

  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
    setFilteredData(extra.currentDataSource);
  };


  return (
    <>
    <div className="flex w-full items-center justify-between mb-3">
    <h1 className={`${lusitana.className} text-2xl`}>Entries</h1>
    <Dropdown
    menu={{
      items,
      selectable: true,

    }}
  >
    <Typography.Link>
      <Space>
      <button className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
        Share
        </button>
      </Space>
    </Typography.Link>
  </Dropdown>
  </div>
   {(loading || !data) ?
    <Spin className="flex items-center justify-center" size='large'></Spin>:
   <Suspense fallback={<div>Loading..</div>}>
   <Table columns={columns}
   dataSource={data}
   onChange={onChange}
   rowClassName={rowClassName}
   scroll={{ x: 700,  }} loading={loading} size='small' />
   </Suspense>}
    </>
  );
};

export default EntriesTable;
