import { memo } from 'react'
import Button from '@/app/components/Button'

interface BaseSubmitProps {
  loading: boolean
  errorMessage: string
  children?: React.ReactNode
}

interface LoginSubmitProps extends BaseSubmitProps {
  buttonLabel: string
}

interface RegisterSubmitProps extends BaseSubmitProps {
  buttonLabel: string
}

interface ForgotPasswordSubmitProps extends BaseSubmitProps {
  resetSent: boolean
  successMessage?: string
  buttonLabel: string
}

interface CodeLoginSubmitProps extends BaseSubmitProps {
  codeSent: boolean
  countdown: number
  verifyButtonLabel: string
  sendButtonLabel: string
  onResendCode: () => void
  children?: React.ReactNode
}

// Login Mode Submit Section
export const LoginSubmitSection = memo(({ loading, errorMessage, buttonLabel, children }: LoginSubmitProps) => {
  return (
    <>
      <ErrorAlert message={errorMessage} />
      <Button tl={buttonLabel} isLoading={loading} />
      {children}
    </>
  )
})
LoginSubmitSection.displayName = 'LoginSubmitSection'

// Register Mode Submit Section
export const RegisterSubmitSection = memo(({ loading, errorMessage, buttonLabel, children }: RegisterSubmitProps) => {
  return (
    <>
      <ErrorAlert message={errorMessage} />
      <Button tl={buttonLabel} isLoading={loading} />
      {children}
    </>
  )
})
RegisterSubmitSection.displayName = 'RegisterSubmitSection'

// Forgot Password Mode Submit Section
export const ForgotPasswordSubmitSection = memo(({ 
  loading, 
  errorMessage, 
  resetSent, 
  successMessage, 
  buttonLabel,
  children 
}: ForgotPasswordSubmitProps) => {
  return (
    <>
      <ErrorAlert message={errorMessage} />
      {resetSent ? (
        <SuccessAlert message={successMessage} />
      ) : (
        <Button tl={buttonLabel} isLoading={loading} />
      )}
      {children}
    </>
  )
})
ForgotPasswordSubmitSection.displayName = 'ForgotPasswordSubmitSection'

// Code Login Mode Submit Section
export const CodeLoginSubmitSection = memo(({
  loading,
  errorMessage,
  codeSent,
  countdown,
  verifyButtonLabel,
  sendButtonLabel,
  onResendCode,
  children,
}: CodeLoginSubmitProps) => {
  return (
    <>
      <ErrorAlert message={errorMessage} />
      {codeSent ? (
        <>
          <Button tl={verifyButtonLabel} isLoading={loading} />
          <div className="text-center text-sm">
            {countdown > 0 ? (
              <span className="text-gray-500">Resend in {countdown}s</span>
            ) : (
              <button
                type="button"
                onClick={onResendCode}
                className="cursor-pointer text-[#1BA7FF] hover:text-[#1689E6] transition-colors focus:outline-none focus:underline"
              >
                Resend code
              </button>
            )}
          </div>
        </>
      ) : (
        <Button tl={sendButtonLabel} isLoading={loading} />
      )}
      {children}
    </>
  )
})
CodeLoginSubmitSection.displayName = 'CodeLoginSubmitSection'

// Error Alert Component
const ErrorAlert = memo(({ message }: { message: string }) => {
  if (!message) return null
  return (
    <div
      className="bg-red-50 p-3 rounded-md text-red-700 border border-red-200"
      role="alert"
      aria-live="polite"
    >
      <p>{message}</p>
    </div>
  )
})
ErrorAlert.displayName = 'ErrorAlert'

// Success Alert Component
const SuccessAlert = memo(({ message }: { message?: string }) => {
  if (!message) return null
  return (
    <div
      className="bg-green-50 p-3 rounded-md text-green-700 border border-green-200"
      role="status"
      aria-live="polite"
    >
      <p>{message}</p>
    </div>
  )
})
SuccessAlert.displayName = 'SuccessAlert'

// Legacy component for backward compatibility (optional, can be removed)
interface FormSubmitSectionProps {
  mode: 'login' | 'register' | 'forgotPassword' | 'codeLogin' | 'verifyCode'
  loading: boolean
  resetSent: boolean
  codeSent: boolean
  countdown: number
  errorMessage: string
  successMessage?: string
  buttonLabel: string
  onResendCode: () => void
  children?: React.ReactNode
}

export const FormSubmitSection = memo(({
  mode,
  loading,
  resetSent,
  codeSent,
  countdown,
  errorMessage,
  successMessage,
  buttonLabel,
  onResendCode,
  children,
}: FormSubmitSectionProps) => {
  switch (mode) {
    case 'login':
      return <LoginSubmitSection loading={loading} errorMessage={errorMessage} buttonLabel={buttonLabel}>{children}</LoginSubmitSection>
    case 'register':
      return <RegisterSubmitSection loading={loading} errorMessage={errorMessage} buttonLabel={buttonLabel}>{children}</RegisterSubmitSection>
    case 'forgotPassword':
      return (
        <ForgotPasswordSubmitSection
          loading={loading}
          errorMessage={errorMessage}
          resetSent={resetSent}
          successMessage={successMessage}
          buttonLabel={buttonLabel}
        >
          {children}
        </ForgotPasswordSubmitSection>
      )
    case 'codeLogin':
      return (
        <CodeLoginSubmitSection
          loading={loading}
          errorMessage={errorMessage}
          codeSent={false}
          countdown={0}
          verifyButtonLabel=""
          sendButtonLabel={buttonLabel}
          onResendCode={onResendCode}
        >
          {children}
        </CodeLoginSubmitSection>
      )
    case 'verifyCode':
      return (
        <CodeLoginSubmitSection
          loading={loading}
          errorMessage={errorMessage}
          codeSent={true}
          countdown={countdown}
          verifyButtonLabel={buttonLabel}
          sendButtonLabel=""
          onResendCode={onResendCode}
        >
          {children}
        </CodeLoginSubmitSection>
      )
    default:
      return null
  }
})

FormSubmitSection.displayName = 'FormSubmitSection'
