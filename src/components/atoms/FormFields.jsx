import React from 'react';

export const FormInput = ({ id, label, placeholder, required, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      id={id}
      name={id}
      placeholder={placeholder}
      required={required}
      className="input"
      {...props}
    />
  </div>
);

export const FormTextarea = ({ id, label, required, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}  {required && <span className="text-red-400">*</span>}</label>
    <textarea
      id={id}
      name={id}
      required={required}
      className="input"
      {...props}
    />
  </div>
);

export const FormSelect = ({ id, label, required, children, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}  {required && <span className="text-red-400">*</span>}</label>
    <select
      id={id}
      name={id}
      required={required}
      className="input"
      {...props}
    >
      {children}
    </select>
  </div>
);
