import React from 'react';
import StudentSidebar from './StudentSidebar';
import StudentTopNav from './StudentTopNav';

export default function StudentShell({ active, children }) {
  return (
    <div className="w-full h-full flex">
      <StudentSidebar active={active} />
      <div className="flex-1 flex flex-col w-full h-full">
        <StudentTopNav />
        <main className="flex-1 w-full h-full">{children}</main>
      </div>
    </div>
  );
} 