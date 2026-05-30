'use client';

import React, { useState } from 'react';
import Input from './Input';
import { PasswordToggleButton } from './PasswordToggleButton';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  showPassword?: boolean;
  onPasswordToggle?: () => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  showPassword: externalShowPassword,
  onPasswordToggle: externalOnToggle,
}) => {
  const [internalShowPassword, setInternalShowPassword] = useState(false);

  const showPassword = externalShowPassword !== undefined ? externalShowPassword : internalShowPassword;
  const onToggle = externalOnToggle || (() => setInternalShowPassword(!internalShowPassword));

  return (
    <div className="relative">
      <Input
        id={id}
        label={label}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange as any}
        placeholder={placeholder}
        required={required}
        error={error}
      />
      <PasswordToggleButton showPassword={showPassword} onToggle={onToggle} />
    </div>
  );
};

export default PasswordField;