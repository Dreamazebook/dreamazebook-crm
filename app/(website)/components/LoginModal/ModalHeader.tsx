import { memo } from 'react'

interface HeaderProps {
  title: string
  description?: string
}

export const ModalHeader = memo(({ title, description = 'Sign in to access your account' }: HeaderProps) => (
  <header className="w-full relative text-center">
    <h1 className="text-[28px] text-[#000]">{title}</h1>
    <p className="text-[14px] text-[#666666]">{description}</p>
  </header>
))

ModalHeader.displayName = 'ModalHeader'

interface CloseButtonProps {
  onClose: () => void
}

export const CloseButton = memo(({ onClose }: CloseButtonProps) => (
  <button
    type="button"
    onClick={onClose}
    className="cursor-pointer text-gray-500 hover:text-gray-700 transition-colors focus:outline-none z-10"
    aria-label="Close"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
))

CloseButton.displayName = 'CloseButton'
