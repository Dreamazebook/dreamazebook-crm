'use client';

import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface InputProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'select';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  options?: Option[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  options,
  placeholder,
  required = false,
  className = ''
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[16px] font-medium text-[#222] mb-1">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === 'select' ? (
        <select
          id={id}
          className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      )}
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;