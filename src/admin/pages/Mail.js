import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function Mail() {
  const [users, setUsers] = useState([]);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch users and inbox messages from backend if available
        // const usersRes = await api.get('/users');
        // const inboxRes = await api.get('/mail/inbox');
        // setUsers(usersRes.data.data || []);
        // setInboxMessages(inboxRes.data.data || []);
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
      <h1 className="text-3xl font-bold mb-6">Admin Mail</h1>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div>Mail page (connect to backend as needed)</div>
      )}
    </div>
  );
} 