import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopNav from './AdminTopNav';

export default function AdminShell({ active, children }) {
  return (
    <div className="w-full h-full flex">
      <AdminSidebar active={active} />
      <div className="flex-1 flex flex-col w-full h-full">
        <AdminTopNav />
        <main className="flex-1 w-full h-full">{children}</main>
      </div>
    </div>
  );
} 