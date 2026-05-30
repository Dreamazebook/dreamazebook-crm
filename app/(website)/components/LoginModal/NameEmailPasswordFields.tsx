import { memo } from 'react'
import Input from '@/app/components/common/Input'
import PasswordField from '@/app/components/common/PasswordField'

interface NameEmailPasswordFieldsProps {
  showName?: boolean
  name?: string
  onNameChange?: (value: string) => void
  email: string
  onEmailChange: (value: string) => void
  password: string
  onPasswordChange: (value: string) => void
  showPassword?: boolean
  onPasswordToggle?: () => void
  namePlaceholder?: string
  emailPlaceholder: string
  passwordPlaceholder: string
  nameLabel: string
  emailLabel: string
  passwordLabel: string
}

export const NameEmailPasswordFields = memo(({
  showName = false,
  name = '',
  onNameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  showPassword,
  onPasswordToggle,
  namePlaceholder = '',
  emailPlaceholder,
  passwordPlaceholder,
  nameLabel,
  emailLabel,
  passwordLabel,
}: NameEmailPasswordFieldsProps) => (
  <fieldset className="space-y-4">
    {showName && onNameChange && (
      <Input
        id="name"
        label={nameLabel}
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder={namePlaceholder}
        required
      />
    )}

    <Input
      id="email"
      label={emailLabel}
      type="email"
      value={email}
      onChange={(e) => onEmailChange(e.target.value)}
      placeholder={emailPlaceholder}
      required
    />

    <PasswordField
      id="password"
      label={passwordLabel}
      value={password}
      onChange={(e) => onPasswordChange(e.target.value)}
      placeholder={passwordPlaceholder}
      required
      showPassword={showPassword}
      onPasswordToggle={onPasswordToggle}
    />
  </fieldset>
))

NameEmailPasswordFields.displayName = 'NameEmailPasswordFields'
