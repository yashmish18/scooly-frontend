import React from 'react';

export default function FloatingInput({ label, id, type = 'text', ...props }) {
  return (
    <div className="relative my-4">
      <input
        id={id}
        type={type}
        className="block w-full px-4 py-3 bg-white border border-pastelBlue rounded-xl focus:outline-none focus:ring-2 focus:ring-accent peer transition"
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-3 text-gray-500 bg-white px-1 transition-all duration-200 pointer-events-none peer-focus:-top-3 peer-focus:text-xs peer-focus:text-accent peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 -top-3 text-xs text-accent"
      >
        {label}
      </label>
    </div>
  );
} 