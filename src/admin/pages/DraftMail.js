import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Temporary mock user data until backend integration
const users = [
  { id: 1, name: 'Admin', role: 'admin', email: 'admin@school.edu' },
  { id: 2, name: 'Dr. Smith', role: 'teacher', email: 'smith@school.edu' },
  { id: 3, name: 'Ms. Johnson', role: 'teacher', email: 'johnson@school.edu' },
  { id: 4, name: 'Alex Thompson', role: 'student', email: 'alex@school.edu' },
  { id: 5, name: 'Priya Patel', role: 'student', email: 'priya@school.edu' },
  { id: 6, name: 'Liam Chen', role: 'student', email: 'liam@school.edu' },
];

export default function DraftMail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState(location.state?.recipients || []);
  const [cc, setCc] = useState([]);
  const [showCc, setShowCc] = useState(false);
  const [search, setSearch] = useState('');
  const [ccSearch, setCcSearch] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if ((!recipients || recipients.length === 0) && (!cc || cc.length === 0)) {
      navigate('/admin/mail');
    }
  }, [recipients, cc, navigate]);

  // Filter users for To and CC (exclude already selected)
  const filtered = search.trim()
    ? users.filter(u =>
        (u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())) &&
        !recipients.some(r => r.id === u.id) &&
        !cc.some(c => c.id === u.id)
      )
    : [];
  const ccFiltered = ccSearch.trim()
    ? users.filter(u =>
        (u.name.toLowerCase().includes(ccSearch.toLowerCase()) ||
          u.email.toLowerCase().includes(ccSearch.toLowerCase())) &&
        !cc.some(c => c.id === u.id) &&
        !recipients.some(r => r.id === u.id)
      )
    : [];

  const handleAddRecipient = (user) => {
    setRecipients([...recipients, user]);
    setSearch('');
  };
  const handleRemoveRecipient = (user) => {
    const newRecipients = recipients.filter(r => r.id !== user.id);
    setRecipients(newRecipients);
    if (newRecipients.length === 0 && cc.length === 0) {
      navigate('/admin/mail');
    }
  };

  const handleAddCc = (user) => {
    setCc([...cc, user]);
    setCcSearch('');
  };
  const handleRemoveCc = (user) => {
    const newCc = cc.filter(c => c.id !== user.id);
    setCc(newCc);
    if (recipients.length === 0 && newCc.length === 0) {
      navigate('/admin/mail');
    }
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage('');
      setRecipients([]);
      setCc([]);
      navigate('/admin/mail');
    }, 2000);
  };

  return (
    <div className="w-full h-full">
      <h1 className="text-2xl font-bold mb-6">Draft Mail</h1>
      {/* Recipients (To) */}
      <div className="mb-4">
        <div className="font-semibold mb-1">To:</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {recipients.map(u => (
            <span key={u.id} className="bg-accent/10 text-accent px-3 py-1 rounded-full flex items-center gap-2 text-sm">
              {u.name}
              <button
                className="ml-1 text-accent hover:text-red-600 focus:outline-none"
                onClick={() => handleRemoveRecipient(u)}
                title="Remove recipient"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add more recipients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring"
        />
        {search.trim() && (
          <div className="bg-white border rounded p-2 max-h-32 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="text-gray-400 text-sm">No recipients found.</div>
            )}
            {filtered.map(u => (
              <div
                key={u.id}
                className="cursor-pointer px-3 py-2 rounded flex items-center gap-2 hover:bg-accent/10"
                onClick={() => handleAddRecipient(u)}
              >
                <span>{u.name}</span>
                <span className="text-xs text-gray-500">({u.role})</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* CC Option */}
      <div className="mb-4">
        <button
          className="text-accent underline text-sm mb-2"
          onClick={() => setShowCc(v => !v)}
        >
          {showCc ? 'Hide CC' : 'Add CC'}
        </button>
        {showCc && (
          <div>
            <div className="font-semibold mb-1">CC:</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {cc.map(u => (
                <span key={u.id} className="bg-accent/10 text-accent px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                  {u.name}
                  <button
                    className="ml-1 text-accent hover:text-red-600 focus:outline-none"
                    onClick={() => handleRemoveCc(u)}
                    title="Remove CC"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add CC recipients..."
              value={ccSearch}
              onChange={e => setCcSearch(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring"
            />
            {ccSearch.trim() && (
              <div className="bg-white border rounded p-2 max-h-32 overflow-y-auto">
                {ccFiltered.length === 0 && (
                  <div className="text-gray-400 text-sm">No recipients found.</div>
                )}
                {ccFiltered.map(u => (
                  <div
                    key={u.id}
                    className="cursor-pointer px-3 py-2 rounded flex items-center gap-2 hover:bg-accent/10"
                    onClick={() => handleAddCc(u)}
                  >
                    <span>{u.name}</span>
                    <span className="text-xs text-gray-500">({u.role})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Message */}
      <div className="mb-4">
        <textarea
          rows={5}
          placeholder={recipients.length > 0 ? `Message to ${recipients.map(r => r.name).join(', ')}${cc.length > 0 ? ' (CC: ' + cc.map(c => c.name).join(', ') + ')' : ''}` : 'Select recipient(s) to compose a message...'}
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring"
          disabled={recipients.length === 0 && cc.length === 0}
        />
      </div>
      <button
        className="bg-accent text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
        disabled={(recipients.length === 0 && cc.length === 0) || !message.trim()}
        onClick={handleSend}
      >
        Send
      </button>
      {sent && <div className="mt-4 text-green-600 font-semibold">Message sent!</div>}
    </div>
  );
} 