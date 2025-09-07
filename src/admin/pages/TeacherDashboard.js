import React from 'react';

const stats = [
  { label: 'Total Classes', value: 'NA' },
  { label: 'Total Assignments', value: 'NA' },
  { label: 'Total Students', value: 'NA' },
  { label: 'Upcoming Classes', value: 'NA' },
  { label: 'Pending Grading', value: 'NA' },
];

export default function TeacherDashboard() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white shadow rounded-lg p-6 flex flex-col items-center border border-gray-100">
            <div className="text-lg font-semibold text-gray-700 mb-2">{s.label}</div>
            <div className="text-2xl font-bold text-blue-700">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-10 text-gray-500 text-sm">More teacher dashboard features coming soon.</div>
    </div>
  );
} 