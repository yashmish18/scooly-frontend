import React from 'react';
import TeacherSidebar from './TeacherSidebar';
import TeacherTopNav from './TeacherTopNav';

export default function TeacherShell({ active, children }) {
  return (
    <div className="w-full h-full flex">
      <TeacherSidebar active={active} />
      <div className="flex-1 flex flex-col w-full h-full">
        <TeacherTopNav />
        <main className="flex-1 w-full h-full">{children}</main>
      </div>
    </div>
  );
} 