import React from 'react';

export default function PrimaryButton({ children, ...props }) {
  return (
    <button
      className="bg-accent text-white rounded-xl px-6 py-2 font-semibold shadow hover:bg-pastelBlue hover:text-accent transition focus:outline-none focus:ring-2 focus:ring-accent"
      {...props}
    >
      {children}
    </button>
  );
} 