import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function Admissions() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/admissions');
        setStudents(res.data.data || []);
      } catch (err) {
        setError('Failed to fetch admissions');
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  function filteredStudents() {
    return students.filter(s =>
      (s.name && s.name.toLowerCase().includes(search.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(search.toLowerCase())) ||
      (s.program && s.program.toLowerCase().includes(search.toLowerCase())) ||
      (s.batch && s.batch.toLowerCase().includes(search.toLowerCase())) ||
      (s.status && s.status.toLowerCase().includes(search.toLowerCase()))
    );
  }

  return (
    <div className="min-h-screen bg-pastelYellow/40 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-accent">Admissions</h1>
          <input
            type="text"
            placeholder="Search by name, email, program, batch, or status..."
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
            <div className="text-gray-400">No admissions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-xl overflow-hidden">
                <thead className="bg-pastelBlue">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Name</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Email</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Program</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Batch</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents().map((s, i) => (
                    <tr key={s.id} className={
                      `border-b last:border-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-pastelBlue/20`}
                    >
                      <td className="py-3 px-4 font-medium">{s.name}</td>
                      <td className="py-3 px-4">{s.email}</td>
                      <td className="py-3 px-4">{s.program || '-'}</td>
                      <td className="py-3 px-4">{s.batch || '-'}</td>
                      <td className="py-3 px-4">{s.status || '-'}</td>
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