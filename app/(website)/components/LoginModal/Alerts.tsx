import { memo } from 'react'

interface ErrorAlertProps {
  message: string
}

interface SuccessAlertProps {
  message: string
  onAction?: () => void
  actionLabel?: string
}

export const ErrorAlert = memo(({ message }: ErrorAlertProps) => (
  <div className="bg-red-50 p-3 rounded-md text-red-700 border border-red-200" role="alert" aria-live="polite">
    <p>{message}</p>
  </div>
))

ErrorAlert.displayName = 'ErrorAlert'

export const SuccessAlert = memo(({ message, onAction, actionLabel }: SuccessAlertProps) => (
  <div className="bg-green-50 p-3 rounded-md text-green-700 border border-green-200" role="status" aria-live="polite">
    <p>{message}</p>
    {onAction && actionLabel && (
      <p className="mt-2">
        <button
          type="button"
          className="cursor-pointer text-[#1BA7FF] hover:text-[#1689E6] transition-colors focus:outline-none focus:underline"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      </p>
    )}
  </div>
))

SuccessAlert.displayName = 'SuccessAlert'
