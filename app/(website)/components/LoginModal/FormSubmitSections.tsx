import { memo } from 'react'
import { LoginLinks, RegisterLinks, ForgotPasswordLinks, CodeLoginEmailLinks, CodeLoginCodeLinks } from './ModeToggleLinks'
import { LoginSubmitSection, RegisterSubmitSection, ForgotPasswordSubmitSection, CodeLoginSubmitSection } from './FormSubmitSection'
import { OAuthButtons } from './OAuthButtons'
import type { LoginMode } from './useLoginState'

interface FormSubmitSectionsProps {
  mode: LoginMode
  loading: boolean
  errorMessage: string
  resetSent: boolean
  successMessage: string
  countdown: number
  buttonLabel: string
  onModeChange: (newMode: LoginMode) => void
  onResetCodeFlow: () => void
  onSendLoginCode: (email: string) => void
  googleLoading: boolean
  facebookLoading: boolean
  onGoogleLogin: () => void
  onFacebookLogin: () => void
  translations: {
    forgotPasswordQuestion: string
    loginWithCode: string
    haveAccount: string
    login: string
    backToLogin: string
    returnToLogin: string
    usePasswordInstead: string
    changeEmail: string
    orContinueWith: string
  }
  email: string
}

export const FormSubmitSections = memo(({
  mode,
  loading,
  errorMessage,
  resetSent,
  successMessage,
  countdown,
  buttonLabel,
  onModeChange,
  onResetCodeFlow,
  onSendLoginCode,
  googleLoading,
  facebookLoading,
  onGoogleLogin,
  onFacebookLogin,
  translations,
  email,
}: FormSubmitSectionsProps) => {
  return (
    <>
      {/* Login Mode */}
      {mode === 'login' && (
        <LoginSubmitSection
          loading={loading}
          errorMessage={errorMessage}
          buttonLabel={buttonLabel}
        >
          <div className="flex flex-col gap-2">
            <LoginLinks
              onForgotPassword={() => onModeChange('forgotPassword')}
              onCodeLogin={() => onModeChange('codeLogin')}
              translations={{
                forgotPasswordQuestion: translations.forgotPasswordQuestion,
                loginWithCode: translations.loginWithCode,
              }}
            />
            <OAuthButtons
              googleLoading={googleLoading}
              facebookLoading={facebookLoading}
              onGoogleClick={onGoogleLogin}
              onFacebookClick={onFacebookLogin}
              label={translations.orContinueWith}
            />
          </div>
        </LoginSubmitSection>
      )}

      {/* Register Mode */}
      {mode === 'register' && (
        <RegisterSubmitSection
          loading={loading}
          errorMessage={errorMessage}
          buttonLabel={buttonLabel}
        >
          <RegisterLinks
            onLogin={() => onModeChange('login')}
            translations={{
              haveAccount: translations.haveAccount,
              login: translations.login,
            }}
          />
          <OAuthButtons
            googleLoading={googleLoading}
            facebookLoading={facebookLoading}
            onGoogleClick={onGoogleLogin}
            onFacebookClick={onFacebookLogin}
            label={translations.orContinueWith}
          />
        </RegisterSubmitSection>
      )}

      {/* Forgot Password Mode */}
      {mode === 'forgotPassword' && (
        <ForgotPasswordSubmitSection
          loading={loading}
          errorMessage={errorMessage}
          resetSent={resetSent}
          successMessage={successMessage}
          buttonLabel={buttonLabel}
        >
          <ForgotPasswordLinks
            onLogin={() => onModeChange('codeLogin')}
            translations={{
              loginWithCode: translations.loginWithCode,
            }}
          />
          <OAuthButtons
            googleLoading={googleLoading}
            facebookLoading={facebookLoading}
            onGoogleClick={onGoogleLogin}
            onFacebookClick={onFacebookLogin}
            label={translations.orContinueWith}
          />
        </ForgotPasswordSubmitSection>
      )}

      {/* Code Login Mode - Email Input */}
      {mode === 'codeLogin' && (
        <CodeLoginSubmitSection
          loading={loading}
          errorMessage={errorMessage}
          codeSent={false}
          countdown={0}
          verifyButtonLabel=""
          sendButtonLabel={buttonLabel}
          onResendCode={() => onSendLoginCode(email)}
        >
          <CodeLoginEmailLinks
            onLogin={() => onModeChange('login')}
            translations={{
              usePasswordInstead: translations.usePasswordInstead,
            }}
          />
          <OAuthButtons
            googleLoading={googleLoading}
            facebookLoading={facebookLoading}
            onGoogleClick={onGoogleLogin}
            onFacebookClick={onFacebookLogin}
            label={translations.orContinueWith}
          />
        </CodeLoginSubmitSection>
      )}

      {/* Verify Code Mode - Code Input */}
      {mode === 'verifyCode' && (
        <CodeLoginSubmitSection
          loading={loading}
          errorMessage={errorMessage}
          codeSent={true}
          countdown={countdown}
          verifyButtonLabel={buttonLabel}
          sendButtonLabel=""
          onResendCode={() => onSendLoginCode(email)}
        >
          {/* <CodeLoginCodeLinks
            onChangeEmail={onResetCodeFlow}
            translations={{
              changeEmail: translations.changeEmail,
            }}
          /> */}
        </CodeLoginSubmitSection>
      )}
    </>
  )
})

FormSubmitSections.displayName = 'FormSubmitSections'
