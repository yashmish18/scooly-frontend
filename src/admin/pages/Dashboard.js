import React, { useEffect, useState } from 'react';
import { FaUserTie, FaUserGraduate, FaBook, FaUsers, FaChalkboardTeacher, FaLayerGroup, FaClipboardList } from 'react-icons/fa';
import api from '../../utils/api';

const statCards = [
  { key: 'totalAdmins', label: 'Admins', icon: <FaUserTie size={30} />, color: 'text-blue-500' },
  { key: 'totalTeachers', label: 'Teachers', icon: <FaChalkboardTeacher size={30} />, color: 'text-green-500' },
  { key: 'totalStudents', label: 'Students', icon: <FaUserGraduate size={30} />, color: 'text-yellow-500' },
  { key: 'totalCourses', label: 'Courses', icon: <FaBook size={30} />, color: 'text-pink-500' },
  { key: 'totalBatches', label: 'Batches', icon: <FaLayerGroup size={30} />, color: 'text-purple-500' },
  { key: 'totalSections', label: 'Sections', icon: <FaUsers size={30} />, color: 'text-orange-400' },
  { key: 'totalPrograms', label: 'Programs', icon: <FaClipboardList size={30} />, color: 'text-teal-500' },
  { key: 'totalAssignments', label: 'Assignments', icon: <FaClipboardList size={30} />, color: 'text-gray-500' },
  { key: 'totalAdmissions', label: 'Admissions', icon: <FaUserGraduate size={30} />, color: 'text-blue-400' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/dashboard/admin');
        setStats(res.data.data.stats || {});
      } catch (err) {
        setError('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const filteredCards = statCards.filter(card =>
    card.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Admin Dashboard</h2>
        </div>
        <div className="flex justify-end mb-8">
          <input
            type="text"
            placeholder="Search stats..."
            className="border rounded-md px-4 py-2 text-lg shadow-sm bg-white focus:outline-accent"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ minWidth: 220 }}
          />
        </div>
        {error && <div className="mb-4 text-red-500 font-semibold">{error}</div>}
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredCards.map(card => (
              <div
                key={card.key}
                className="flex flex-col items-center justify-center bg-white shadow-md rounded-md p-8 border border-gray-100"
                style={{ minHeight: 120 }}
              >
                <div className={`mb-2 ${card.color}`}>{card.icon}</div>
                <div className="text-3xl font-semibold text-gray-800 mb-1" style={{ letterSpacing: '-0.01em' }}>{stats[card.key] ?? 'NA'}</div>
                <div className="text-base text-gray-600">{card.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 