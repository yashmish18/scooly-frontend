import React from 'react';
import GeneralTopNav from './GeneralTopNav';

export default function GeneralLayout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <GeneralTopNav />
      <main className="px-10 py-10">{children}</main>
    </div>
  );
} 