import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [actionLoading, setActionLoading] = useState('');

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

  const handleEdit = (s) => {
    setEditId(s.id);
    setEditFields({
      firstName: s.firstName || '',
      lastName: s.lastName || '',
      email: s.email || '',
      courseId: s.course?.id || '',
      batchId: s.batch?.id || '',
      sectionId: s.section?.id || ''
    });
  };

  const handleEditChange = (field, value) => {
    setEditFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async (id) => {
    setActionLoading(id + 'edit');
    try {
      await api.put(`/students/${id}`, editFields);
      setEditId(null);
      // Refresh list
      const res = await api.get('/students?limit=1000');
      setStudents(res.data.data || []);
    } catch {
      setError('Failed to update student');
    } finally {
      setActionLoading('');
    }
  };

  const handleSuspend = async (id, suspend) => {
    setActionLoading(id + 'suspend');
    try {
      await api.patch(`/students/${id}/suspend`, { suspend });
      // Refresh list
      const res = await api.get('/students?limit=1000');
      setStudents(res.data.data || []);
    } catch {
      setError('Failed to update status');
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(id + 'delete');
    try {
      await api.delete(`/students/${id}`);
      // Refresh list
      const res = await api.get('/students?limit=1000');
      setStudents(res.data.data || []);
    } catch {
      setError('Failed to delete student');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
              <div className="mb-8">
                     <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Students List</h2>
        </div>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : students.length === 0 ? (
        <div className="text-gray-400">No students found.</div>
      ) : (
        <table className="w-full text-sm bg-white rounded-xl shadow-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left">First Name</th>
              <th className="py-3 px-4 text-left">Last Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Program</th>
              <th className="py-3 px-4 text-left">Batch</th>
              <th className="py-3 px-4 text-left">Section</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
            {students.map((s, i) => (
              <tr key={s.id || i} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-3 px-4">
                  {editId === s.id ? (
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      value={editFields.firstName}
                      onChange={e => handleEditChange('firstName', e.target.value)}
                      disabled={actionLoading === s.id + 'edit'}
                    />
                  ) : (
                    s.firstName
                  )}
                </td>
                <td className="py-3 px-4">
                  {editId === s.id ? (
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      value={editFields.lastName}
                      onChange={e => handleEditChange('lastName', e.target.value)}
                      disabled={actionLoading === s.id + 'edit'}
                    />
                  ) : (
                    s.lastName
                  )}
                </td>
                <td className="py-3 px-4">
                  {editId === s.id ? (
                    <input
                      className="border rounded px-2 py-1 text-sm"
                      value={editFields.email}
                      onChange={e => handleEditChange('email', e.target.value)}
                      disabled={actionLoading === s.id + 'edit'}
                    />
                  ) : (
                    s.email
                  )}
                </td>
                <td className="py-3 px-4">
                  {s.program}
                </td>
                <td className="py-3 px-4">
                  {s.batch?.name}
                </td>
                <td className="py-3 px-4">
                  {s.section?.name}
                </td>
                <td className="py-3 px-4">
                  <span className={
                    s.status === 'ACTIVE' ? 'bg-green-100 text-green-800 px-2 py-1 rounded' :
                    s.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded' :
                    s.status === 'INACTIVE' ? 'bg-gray-200 text-gray-700 px-2 py-1 rounded' :
                    'bg-gray-100 text-gray-700 px-2 py-1 rounded'
                  }>
                    {s.status}
                      </span>
                    </td>
                <td className="py-3 px-4 flex gap-2">
                  {editId === s.id ? (
                    <>
                      <button
                        className="bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200 font-semibold text-xs"
                        disabled={actionLoading === s.id + 'edit'}
                        onClick={() => handleEditSave(s.id)}
                      >
                        {actionLoading === s.id + 'edit' ? '...' : 'Save'}
                      </button>
                      <button
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 font-semibold text-xs"
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 font-semibold text-xs"
                      onClick={() => handleEdit(s)}
                    >
                      Edit
                    </button>
                  )}
                  {editId !== s.id && (
                    <>
                      {s.status === 'ACTIVE' ? (
                        <button
                          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded font-semibold text-xs"
                          disabled={actionLoading === s.id + 'suspend'}
                          onClick={() => handleSuspend(s.id, true)}
                        >
                          {actionLoading === s.id + 'suspend' ? '...' : 'Suspend'}
                        </button>
                      ) : s.status === 'SUSPENDED' ? (
                              <button
                          className="bg-green-100 text-green-800 px-3 py-1 rounded font-semibold text-xs"
                          disabled={actionLoading === s.id + 'suspend'}
                          onClick={() => handleSuspend(s.id, false)}
                        >
                          {actionLoading === s.id + 'suspend' ? '...' : 'Unsuspend'}
                              </button>
                      ) : null}
                      {s.status !== 'INACTIVE' && (
                              <button
                          className="bg-red-100 text-red-800 px-3 py-1 rounded font-semibold text-xs"
                          disabled={actionLoading === s.id + 'delete'}
                          onClick={() => handleDelete(s.id)}
                        >
                          {actionLoading === s.id + 'delete' ? '...' : 'Delete'}
                              </button>
                      )}
                    </>
                  )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
      )}
    </div>
  );
} 