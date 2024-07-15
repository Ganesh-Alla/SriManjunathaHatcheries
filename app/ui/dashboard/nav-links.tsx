'use client'

import {
  HomeIcon,
  DocumentDuplicateIcon,
  UserIcon,
  FolderOpenIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Entries',
    href: '/dashboard/entries',
    icon: DocumentDuplicateIcon,
  },
  {
    name: 'Custom',
    href: '/dashboard/custom',
    icon: FolderOpenIcon,
  },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3
            ${pathname === link.href ? 'bg-sky-100 text-blue-600' : ''}
            `}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
