'use client'; //* 📌 Wrap the component in useClient to use React hooks

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link'; //* 📌 Import the Link component
import { usePathname } from 'next/navigation'; //* 📌 Import the usePathname hook (React hook)
import clsx from 'clsx'; //* 📌 Import the clsx library

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Invoices', href: '/dashboard/invoices', icon: DocumentDuplicateIcon },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
  { name: 'Memo', href: '/dashboard/memo', icon: DocumentTextIcon }
];

export default function NavLinks() {
  const pathname = usePathname(); //* 📌 현재 페이지의 경로 가져오기
  console.log('🔥 pathname:', pathname);
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          // <a
          //   key={link.name}
          //   href={link.href}
          //   className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          // >
          //   <LinkIcon className="w-6" />
          //   <p className="hidden md:block">{link.name}</p>
          // </a>
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
