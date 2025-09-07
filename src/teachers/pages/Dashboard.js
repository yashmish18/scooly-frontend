import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/teacher'); // Adjust endpoint as needed
        setStats(res.data.data || null);
      } catch (err) {
        setError('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // ...rest of the UI, using stats from state...
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Teacher Dashboard</h2>
      </div>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : stats ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-100 rounded-lg p-6 flex flex-col items-center shadow">
              <div className="text-4xl font-bold text-blue-700">{stats.stats.totalCourses}</div>
              <div className="mt-2 text-lg text-blue-900 font-semibold">Courses</div>
            </div>
            <div className="bg-green-100 rounded-lg p-6 flex flex-col items-center shadow">
              <div className="text-4xl font-bold text-green-700">{stats.stats.totalStudents}</div>
              <div className="mt-2 text-lg text-green-900 font-semibold">Students</div>
            </div>
            <div className="bg-yellow-100 rounded-lg p-6 flex flex-col items-center shadow">
              <div className="text-4xl font-bold text-yellow-700">{stats.stats.totalAssignments}</div>
              <div className="mt-2 text-lg text-yellow-900 font-semibold">Assignments</div>
            </div>
          </div>
          {/* Extra stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-purple-100 rounded-lg p-6 flex flex-col items-center shadow">
              <div className="text-4xl font-bold text-purple-700">{stats.stats.totalBatches}</div>
              <div className="mt-2 text-lg text-purple-900 font-semibold">Batches</div>
            </div>
            <div className="bg-pink-100 rounded-lg p-6 flex flex-col items-center shadow">
              <div className="text-4xl font-bold text-pink-700">{stats.stats.totalSections}</div>
              <div className="mt-2 text-lg text-pink-900 font-semibold">Sections</div>
            </div>
            <div className="bg-indigo-100 rounded-lg p-6 flex flex-col items-center shadow">
              <div className="text-4xl font-bold text-indigo-700">{stats.stats.totalPrograms}</div>
              <div className="mt-2 text-lg text-indigo-900 font-semibold">Programs</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 rounded-lg p-6 flex flex-col items-center shadow">
              <div className="text-4xl font-bold text-green-800">{stats.stats.totalUniqueStudents}</div>
              <div className="mt-2 text-lg text-green-900 font-semibold">Unique Students</div>
            </div>
            <div className="bg-green-200 rounded-lg p-6 flex flex-col items-center shadow">
              <div className="text-4xl font-bold text-green-900">{stats.stats.totalActiveStudents}</div>
              <div className="mt-2 text-lg text-green-900 font-semibold">Active Students</div>
            </div>
            <div className="bg-gray-200 rounded-lg p-6 flex flex-col items-center shadow">
              <div className="text-4xl font-bold text-gray-700">{stats.stats.totalInactiveStudents}</div>
              <div className="mt-2 text-lg text-gray-900 font-semibold">Inactive Students</div>
            </div>
          </div>
          <div className="text-gray-600 text-center">{stats.message}</div>
        </div>
      ) : (
        <div>No stats available.</div>
      )}
    </div>
  );
} 