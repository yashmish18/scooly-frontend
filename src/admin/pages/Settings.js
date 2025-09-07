import React, { useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../features/auth/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [role] = useState(user?.role || '');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await api.put('/profile/admin', { name });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await api.put('/auth/change-password', { currentPassword: '', newPassword: password });
      setSuccess('Password updated successfully!');
      setPassword('');
    } catch (err) {
      setError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
      {success && <div className="mb-4 text-green-600 font-semibold">{success}</div>}
      {error && <div className="mb-4 text-red-500 font-semibold">{error}</div>}
      <form onSubmit={handleProfileSave} className="bg-white rounded-xl shadow p-8 space-y-6 mb-8">
        <h2 className="text-xl font-bold mb-2">Profile</h2>
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input name="name" value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input name="email" value={email} disabled className="w-full border rounded-lg px-4 py-2 bg-gray-100" />
        </div>
        <div>
          <label className="block font-medium mb-1">Role</label>
          <input name="role" value={role} disabled className="w-full border rounded-lg px-4 py-2 bg-gray-100" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-60" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
      <form onSubmit={handlePasswordSave} className="bg-white rounded-xl shadow p-8 space-y-6 mb-8">
        <h2 className="text-xl font-bold mb-2">Change Password</h2>
        <div>
          <label className="block font-medium mb-1">New Password</label>
          <input name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border rounded-lg px-4 py-2" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-60" disabled={loading}>
          {loading ? 'Saving...' : 'Change Password'}
        </button>
      </form>
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-xl font-bold mb-2">University Info</h2>
        <div className="text-gray-500">University info and settings coming soon.</div>
      </div>
    </div>
  );
} 