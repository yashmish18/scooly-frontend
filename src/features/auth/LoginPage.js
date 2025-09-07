import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const role = await login(email, password);
      if (role === 'teacher') navigate('/teacher');
      else if (role === 'admin') navigate('/admin');
      else navigate('/student');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-3 h-3 bg-blue-500 rounded-sm inline-block" />
              <span className="text-4xl font-bold text-gray-900">Scooly</span>
            </div>
            <p className="text-gray-600">University Management System</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome back</h2>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <div className="mb-4">
            <label className="block font-medium mb-1">Username or Email</label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-3 bg-white text-gray-700 focus:outline-none focus:ring"
              placeholder="Enter your username or email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-4 py-3 bg-white text-gray-700 focus:outline-none focus:ring"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 text-right">
            <a href="#" className="text-blue-600 text-sm hover:underline">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-200 text-gray-900 rounded-lg py-3 font-semibold text-lg hover:bg-blue-300 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
} 