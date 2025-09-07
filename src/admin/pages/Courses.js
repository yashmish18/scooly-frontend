import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [form, setForm] = useState({ code: '', name: '', description: '', duration: '', credits: '' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/courses');
      setCourses(res.data.data || []);
    } catch (err) {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }

  function filteredCourses() {
    return courses.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
    );
  }

  function openAddModal() {
    setForm({ code: '', name: '', description: '', duration: '', credits: '' });
    setFormError('');
    setShowAddModal(true);
  }

  function openEditModal(course) {
    setEditCourse(course);
    setForm({
      code: course.code,
      name: course.name,
      description: course.description || '',
      duration: course.duration || '',
      credits: course.credits || ''
    });
    setFormError('');
    setShowEditModal(true);
  }

  async function handleAddOrEdit(e) {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (showAddModal) {
        await api.post('/courses', form);
      } else if (showEditModal && editCourse) {
        await api.put(`/courses/${editCourse.id}`, form);
      }
      setShowAddModal(false);
      setShowEditModal(false);
      fetchCourses();
    } catch (err) {
      setFormError('Failed to save course');
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-pastelYellow/40 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="mb-8">
                     <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Courses</h2>
        </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search by name or code..."
              className="border rounded-lg px-3 py-2 text-sm focus:outline-accent bg-white shadow"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ minWidth: 220 }}
            />
            <button
              className="bg-accent text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-accent-dark transition"
              onClick={openAddModal}
            >
              + Add Course
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && <div className="mb-4 text-red-500 font-semibold">{error}</div>}
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : filteredCourses().length === 0 ? (
            <div className="text-gray-400">No courses found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-xl overflow-hidden">
                <thead className="bg-pastelBlue">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Code</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Name</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Description</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Duration</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Credits</th>
                    <th className="py-3 px-4 text-left font-semibold text-accent">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses().map((c, i) => (
                    <tr key={c.id} className={
                      `border-b last:border-0 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-pastelBlue/20`}
                    >
                      <td className="py-3 px-4 font-medium">{c.code}</td>
                      <td className="py-3 px-4">{c.name}</td>
                      <td className="py-3 px-4">{c.description || '-'}</td>
                      <td className="py-3 px-4">{c.duration || '-'}</td>
                      <td className="py-3 px-4">{c.credits || '-'}</td>
                      <td className="py-3 px-4">
                        <button
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 font-semibold text-xs mr-2"
                          onClick={() => openEditModal(c)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4">{showAddModal ? 'Add Course' : 'Edit Course'}</h2>
              <form onSubmit={handleAddOrEdit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Course Code"
                  className="border rounded px-3 py-2"
                  value={form.code}
                  onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                  required
                />
                <input
                  type="text"
                  placeholder="Course Name"
                  className="border rounded px-3 py-2"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="border rounded px-3 py-2"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
                <input
                  type="number"
                  placeholder="Duration (months)"
                  className="border rounded px-3 py-2"
                  value={form.duration}
                  onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                  required
                />
                <input
                  type="number"
                  placeholder="Credits"
                  className="border rounded px-3 py-2"
                  value={form.credits}
                  onChange={e => setForm(f => ({ ...f, credits: e.target.value }))}
                  required
                />
                {formError && <div className="text-red-500 text-sm font-semibold">{formError}</div>}
                <button
                  type="submit"
                  className="bg-accent text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-accent-dark transition"
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : (showAddModal ? 'Add Course' : 'Save Changes')}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 