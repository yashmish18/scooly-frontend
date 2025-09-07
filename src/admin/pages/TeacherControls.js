import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function TeacherControls() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [editId, setEditId] = useState(null);
  const [editFields, setEditFields] = useState({});

  const fetchTeachers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/teachers');
      setTeachers((res.data.data || []).filter(t => t.status !== 'INACTIVE'));
    } catch (err) {
      setError('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleEdit = (t) => {
    setEditId(t.id);
    setEditFields({
      name: t.name || '',
      email: t.email || '',
      programCode: t.programCode || '',
      department: t.department || '',
      phone: t.phone || ''
    });
  };

  const handleEditChange = (field, value) => {
    setEditFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async (id) => {
    setActionLoading(id + 'edit');
    try {
      await api.put(`/upload/teachers/${id}`, editFields);
      setEditId(null);
      fetchTeachers();
    } catch {
      setError('Failed to update teacher');
    } finally {
      setActionLoading('');
    }
  };

  const handleSuspend = async (id, suspend) => {
    setActionLoading(id + 'suspend');
    try {
      await api.patch(`/upload/teachers/${id}/suspend`, { suspend });
      fetchTeachers();
    } catch {
      setError('Failed to update status');
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(id + 'delete');
    try {
      await api.delete(`/upload/teachers/${id}`);
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete teacher');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-pastelYellow/40 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-accent">Teacher Controls</h1>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && <div className="mb-4 text-red-500 font-semibold">{error}</div>}
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : teachers.length === 0 ? (
            <div className="text-gray-400">No teachers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-xl overflow-hidden">
                <thead className="bg-pastelBlue">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Name</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Email</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Program</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Department</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Phone</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Status</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Actions</th>
            </tr>
          </thead>
          <tbody>
                  {teachers.map((t, i) => (
                    <tr key={t.id} className={
                      `border-b last:border-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-pastelBlue/20`}
                    >
                      <td className="py-3 px-4 font-medium">
                        {editId === t.id ? (
                          <input
                            className="border rounded px-2 py-1 text-sm"
                            value={editFields.name}
                            onChange={e => handleEditChange('name', e.target.value)}
                            disabled={actionLoading === t.id + 'edit'}
                          />
                        ) : (
                          t.name
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editId === t.id ? (
                          <input
                            className="border rounded px-2 py-1 text-sm"
                            value={editFields.email}
                            onChange={e => handleEditChange('email', e.target.value)}
                            disabled={actionLoading === t.id + 'edit'}
                          />
                        ) : (
                          t.email
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editId === t.id ? (
                          <input
                            className="border rounded px-2 py-1 text-sm"
                            value={editFields.programCode}
                            onChange={e => handleEditChange('programCode', e.target.value)}
                            disabled={actionLoading === t.id + 'edit'}
                          />
                        ) : (
                          t.programCode || '-'
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editId === t.id ? (
                          <input
                            className="border rounded px-2 py-1 text-sm"
                            value={editFields.department}
                            onChange={e => handleEditChange('department', e.target.value)}
                            disabled={actionLoading === t.id + 'edit'}
                          />
                        ) : (
                          t.department || '-'
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editId === t.id ? (
                          <input
                            className="border rounded px-2 py-1 text-sm"
                            value={editFields.phone}
                            onChange={e => handleEditChange('phone', e.target.value)}
                            disabled={actionLoading === t.id + 'edit'}
                          />
                        ) : (
                          t.phone || '-'
                        )}
                </td>
                      <td className="py-3 px-4">
                        <span className={
                          t.status === 'ACTIVE' ? 'bg-green-100 text-green-800 px-2 py-1 rounded' :
                          t.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded' :
                          t.status === 'INACTIVE' ? 'bg-gray-200 text-gray-700 px-2 py-1 rounded' :
                          'bg-gray-100 text-gray-700 px-2 py-1 rounded'
                        }>
                          {t.status}
                        </span>
                </td>
                      <td className="py-3 px-4 flex gap-2">
                        {editId === t.id ? (
                          <>
                            <button
                              className="bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200 font-semibold text-xs"
                              disabled={actionLoading === t.id + 'edit'}
                              onClick={() => handleEditSave(t.id)}
                            >
                              {actionLoading === t.id + 'edit' ? '...' : 'Save'}
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
                            onClick={() => handleEdit(t)}
                          >
                            Edit
                          </button>
                        )}
                        {editId !== t.id && (
                          <>
                            {t.status === 'ACTIVE' ? (
                              <button
                                className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded font-semibold text-xs"
                                disabled={actionLoading === t.id + 'suspend'}
                                onClick={() => handleSuspend(t.id, true)}
                              >
                                {actionLoading === t.id + 'suspend' ? '...' : 'Suspend'}
                              </button>
                            ) : t.status === 'SUSPENDED' ? (
                              <button
                                className="bg-green-100 text-green-800 px-3 py-1 rounded font-semibold text-xs"
                                disabled={actionLoading === t.id + 'suspend'}
                                onClick={() => handleSuspend(t.id, false)}
                              >
                                {actionLoading === t.id + 'suspend' ? '...' : 'Unsuspend'}
                              </button>
                            ) : null}
                            {t.status !== 'INACTIVE' && (
                              <button
                                className="bg-red-100 text-red-800 px-3 py-1 rounded font-semibold text-xs"
                                disabled={actionLoading === t.id + 'delete'}
                                onClick={() => handleDelete(t.id)}
                              >
                                {actionLoading === t.id + 'delete' ? '...' : 'Delete'}
                              </button>
                            )}
                          </>
                        )}
                </td>
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