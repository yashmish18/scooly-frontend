import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'INACTIVE', label: 'Inactive' },
];
const departmentOptions = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Biology',
  'English',
  'Chemistry',
  'Economics',
  'History',
  'Other',
];

export default function AddTeacher() {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    programCode: '',
    department: '',
    phone: '',
    status: 'ACTIVE',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await api.get('/courses');
        // Extract unique program codes from courses
        const allCourses = res.data.data || [];
        const uniquePrograms = Array.from(new Set(allCourses.map(c => c.program).filter(Boolean)));
        setPrograms(uniquePrograms);
      } catch {
        setPrograms([]);
      }
    }
    fetchPrograms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await api.post('/upload/teachers/confirm', { teachers: [form] });
      setSuccess('Teacher added successfully!');
      setForm({ firstName: '', lastName: '', email: '', password: '', programCode: '', department: '', phone: '', status: 'ACTIVE' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add teacher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Add Teacher</h2>
        </div>
        {success && <div className="mb-4 text-green-600 font-semibold">{success}</div>}
        {error && <div className="mb-4 text-red-500 font-semibold">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">First Name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Last Name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div className="col-span-2">
              <label className="block font-medium mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div className="col-span-2">
              <label className="block font-medium mb-1">Password</label>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2 pr-10" />
                <button type="button" className="absolute right-2 top-2 text-gray-500" onClick={() => setShowPassword((v) => !v)}>{showPassword ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Program</label>
              <select name="programCode" value={form.programCode} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2">
                <option value="">Select Program</option>
                {programs.length === 0 && <option disabled>No programs found</option>}
                {programs.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Department</label>
              <select name="department" value={form.department} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2">
                <option value="">Select Department</option>
                {departmentOptions.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded-lg px-4 py-2">
                {statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-60" disabled={loading}>
            {loading ? 'Saving...' : 'Add Teacher'}
          </button>
        </form>
      </div>
    </div>
  );
} 