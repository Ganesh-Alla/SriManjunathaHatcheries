import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

 
export const metadata: Metadata = {
  title: {
    template: '%s | Sri Manjunatha Hatcheries | @tech4aqua',
    default: 'Sri Manjunatha Hatcheries | Tech4Aqua',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://www.tech4aqua.com'),
  authors: [{name: 'Arya Teja', url:'https://www.linkedin.com/in/@tech4aqua'}],
  keywords: ['Hatcheries', 'Srimangunathahatcheries', 'Dashboard', 'Server Actions'],
  openGraph: {
    title: 'Dashboard',
    description: 'The official Next.js Learn Dashboard built with App Router.',
    url: 'https://www.tech4aqua.com',
    type: 'website',
  },
  twitter: {
    site: 'tech4aqua.com',
    description:'The official Next.js Learn Dashboard built with App Router.',
    title:'Dashboard by @tech4aqua',
    creator:'@tech4aqua',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
