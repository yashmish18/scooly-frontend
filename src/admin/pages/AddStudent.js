import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];
const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'SUSPENDED', label: 'Suspended' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'GRADUATED', label: 'Graduated' },
  { value: 'DROPPED', label: 'Dropped' },
];

const sectionOptions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
];

export default function AddStudent() {
  const [batch, setBatch] = useState('');
  const [batchId, setBatchId] = useState('');
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    program: '',
    section: '', // optional
    batchId: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    status: 'ACTIVE',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [sectionWarning, setSectionWarning] = useState(false);

  useEffect(() => {
    async function fetchSections() {
      try {
        const res = await api.get('/sections');
        setSections(res.data.data || []);
      } catch {
        setSections([]);
      }
    }
    fetchSections();
  }, []);

  useEffect(() => {
    async function fetchPrograms() {
      try {
        setProgramsLoading(true);
        const res = await api.get('/courses');
        // Extract unique, non-empty program values from courses
        const allPrograms = (res.data.data || []).map(c => c.program).filter(Boolean);
        const uniquePrograms = Array.from(new Set(allPrograms));
        setPrograms(uniquePrograms);
      } catch {
        setPrograms([]);
      } finally {
        setProgramsLoading(false);
      }
    }
    fetchPrograms();
  }, []);

  // When program changes, auto-select batch
  useEffect(() => {
    if (!form.program) {
      setBatch('');
      setForm((prev) => ({ ...prev, section: '' }));
      return;
    }
    // Determine batch name based on program and current year
    const now = new Date();
    const currentYear = now.getFullYear();
    let duration = 4;
    if (form.program === 'MTECH' || form.program === 'MBA') duration = 2;
    if (form.program === 'BBA') duration = 3;
    const batchName = `${currentYear}-${currentYear + duration}`;
    setBatch(batchName);
    setForm((prev) => ({ ...prev, section: '' }));
  }, [form.program]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    setErrorDetails([]);
    setSectionWarning(false);
    // Remove section if not selected
    const payload = { ...form };
    if (!form.section) {
      delete payload.section;
      setSectionWarning(true);
    }
    try {
      await api.post('/students', payload);
      setSuccess('Student added successfully!');
      setForm({
        firstName: '', lastName: '', email: '', password: '', program: '', section: '', phone: '', dateOfBirth: '', gender: '', address: '', city: '', state: '', country: '', status: 'ACTIVE',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add student');
      let details = err.response?.data?.details;
      if (!Array.isArray(details)) {
        if (typeof details === 'string') details = [details];
        else if (details && typeof details === 'object') details = [JSON.stringify(details)];
        else details = [];
      }
      setErrorDetails(details);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Scooly</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Add Student</h2>
        </div>
        {success && <div className="mb-4 text-green-600 font-semibold">{success}</div>}
        {error && <div className="mb-4 text-red-500 font-semibold">{error}</div>}
        {Array.isArray(errorDetails) && errorDetails.length > 0 && (
          <div className="mb-2 text-red-500 text-xs">
            <ul>
              {errorDetails.map((d, i) => (
                <li key={i}>{d.path ? `${d.path.join('.')}: ` : ''}{d.message || d}</li>
              ))}
            </ul>
          </div>
        )}
        {sectionWarning && <div className="mb-2 text-yellow-600 text-xs">No section selected. Student will be assigned to section A by default.</div>}
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
              <select name="program" value={form.program} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2">
                <option value="">Select Program</option>
                {programsLoading && <option disabled>Loading...</option>}
                {programs.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {batch && <div className="text-xs text-gray-500 mt-1">Batch: {batch}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">Section</label>
              <select name="section" value={form.section} onChange={handleChange} className="w-full border rounded-lg px-4 py-2">
                <option value="">Select Section</option>
                {sectionOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full border rounded-lg px-4 py-2">
                <option value="">Select Gender</option>
                {genderOptions.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Date of Birth</label>
              <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
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
            <div className="col-span-2">
              <label className="block font-medium mb-1">Address</label>
              <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">City</label>
              <input name="city" value={form.city} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">State</label>
              <input name="state" value={form.state} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block font-medium mb-1">Country</label>
              <input name="country" value={form.country} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-60" disabled={loading}>
            {loading ? 'Saving...' : 'Add Student'}
          </button>
        </form>
      </div>
    </div>
  );
} 