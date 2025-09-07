import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function DraftMail() {
  const [users, setUsers] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [usersRes, draftsRes] = await Promise.all([
          api.get('/users'),
          api.get('/mail/drafts'), // Adjust endpoint as needed
        ]);
        setUsers(usersRes.data.data || []);
        setDrafts(draftsRes.data.data || []);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Draft Mail</h1>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div>Users: {users.map(u => u.name || u.email).join(', ')}</div>
          <div>Drafts: {drafts.map(d => d.subject || d.title).join(', ')}</div>
        </>
      )}
    </div>
  );
} 