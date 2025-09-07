import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const res = await api.get('/students?limit=1000');
        setStudents(res.data.data || []);
      } catch (err) {
        setError('Failed to fetch students');
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  function getName(val) {
    if (!val) return '-';
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return val.map(getName).join(', ');
    if (typeof val === 'object') {
      if (val.name) return val.name;
      const values = Object.values(val).filter(v => typeof v === 'string');
      if (values.length > 0) return values.join(' ');
      return '-';
    }
    return '-';
  }

  function filteredStudents() {
    return students.filter(s =>
      (s.firstName + ' ' + s.lastName).toLowerCase().includes(search.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(search.toLowerCase())) ||
      (getName(s.department).toLowerCase().includes(search.toLowerCase())) ||
      (getName(s.program).toLowerCase().includes(search.toLowerCase())) ||
      (s.phone && s.phone.toLowerCase().includes(search.toLowerCase()))
    );
  }

  return (
    <div className="min-h-screen bg-pastelYellow/40 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-accent">Students List</h1>
          <input
            type="text"
            placeholder="Search by name, email, department, program, or phone..."
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
          ) : filteredStudents().length === 0 ? (
            <div className="text-gray-400">No students found.</div>
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
                  {filteredStudents().map((s, i) => (
                    <tr key={s.id || i} className={
                      `border-b last:border-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-pastelBlue/20`}
                    >
                      <td className="py-3 px-4 font-medium">{s.firstName} {s.lastName}</td>
                      <td className="py-3 px-4">{s.email}</td>
                      <td className="py-3 px-4">{getName(s.department)}</td>
                      <td className="py-3 px-4">{getName(s.program)}</td>
                      <td className="py-3 px-4">{s.phone || '-'}</td>
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