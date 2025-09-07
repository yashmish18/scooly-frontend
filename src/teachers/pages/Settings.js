import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function Settings() {
  const [profile, setProfile] = useState({ name: '', email: '', department: '' });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await api.get('/profile/teacher'); // Adjust endpoint as needed
        setProfile(res.data.data || { name: '', email: '', department: '' });
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleProfileChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = e => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async () => {
    try {
      setLoading(true);
      await api.put('/profile/teacher', profile); // Adjust endpoint as needed
      setSuccess('Profile updated successfully');
      setError(null);
    } catch (err) {
      setError('Failed to update profile');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    try {
      setLoading(true);
      await api.put('/profile/teacher/password', password); // Adjust endpoint as needed
      setSuccess('Password updated successfully');
      setError(null);
    } catch (err) {
      setError('Failed to update password');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Profile</h2>
        <input className="border rounded px-3 py-2 flex-1 mb-2 w-full" name="name" value={profile.name} onChange={handleProfileChange} placeholder="Name" />
        <input className="border rounded px-3 py-2 flex-1 mb-2 w-full" name="email" value={profile.email} onChange={handleProfileChange} placeholder="Email" />
        <input className="border rounded px-3 py-2 w-full" name="department" value={profile.department} onChange={handleProfileChange} placeholder="Department" />
        <button onClick={handleProfileSave} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">Save Profile</button>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Change Password</h2>
        <input className="border rounded px-3 py-2 w-full mb-2" name="current" value={password.current} onChange={handlePasswordChange} placeholder="Current Password" type="password" />
        <input className="border rounded px-3 py-2 w-full mb-2" name="new" value={password.new} onChange={handlePasswordChange} placeholder="New Password" type="password" />
        <input className="border rounded px-3 py-2 w-full mb-2" name="confirm" value={password.confirm} onChange={handlePasswordChange} placeholder="Confirm New Password" type="password" />
        <button onClick={handlePasswordSave} className="mt-4 bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition">Change Password</button>
      </div>
    </div>
  );
} 