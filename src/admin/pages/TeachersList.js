import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function TeachersList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchTeachers() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/teachers');
        setTeachers(res.data.data || []);
      } catch (err) {
        setError('Failed to fetch teachers');
      } finally {
        setLoading(false);
      }
    }
    fetchTeachers();
  }, []);

  function filteredTeachers() {
    return teachers.filter(t =>
      (t.name && t.name.toLowerCase().includes(search.toLowerCase())) ||
      (t.email && t.email.toLowerCase().includes(search.toLowerCase())) ||
      (t.department && t.department.toLowerCase().includes(search.toLowerCase())) ||
      (t.programCode && t.programCode.toLowerCase().includes(search.toLowerCase()))
    );
  }

  return (
    <div className="min-h-screen bg-pastelYellow/40 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="mb-8">
                     <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Teachers List</h2>
        </div>
          <input
            type="text"
            placeholder="Search by name, email, department, or program..."
            className="border rounded-lg px-3 py-2 text-sm focus:outline-accent bg-white shadow"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ minWidth: 260 }}
          />
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && <div className="mb-4 text-red-500 font-semibold">{error}</div>}
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : filteredTeachers().length === 0 ? (
            <div className="text-gray-400">No teachers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-xl overflow-hidden">
                <thead className="bg-pastelBlue">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Name</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Email</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Department</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Program</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers().map((t, i) => (
                    <tr key={t.id} className={
                      `border-b last:border-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-pastelBlue/20`}
                    >
                      <td className="py-3 px-4 font-medium">{t.name}</td>
                      <td className="py-3 px-4">{t.email}</td>
                      <td className="py-3 px-4">{t.department || '-'}</td>
                      <td className="py-3 px-4">{t.programCode || '-'}</td>
                      <td className="py-3 px-4">{t.phone || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 