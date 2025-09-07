import React from 'react';

export default function Toast({ message, show }) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} bg-pastelGreen text-accent px-6 py-3 rounded-xl shadow-lg font-semibold`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
} 