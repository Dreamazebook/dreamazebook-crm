'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useUserStore from '@/stores/userStore'
import Input from '@/app/components/common/Input'
import { OAUTH_REDIRECT } from '@/constants/api'
import { useLoginState, type LoginMode } from './LoginModal/useLoginState'
import { NameEmailPasswordFields } from './LoginModal/NameEmailPasswordFields'
import { CodeInputField } from './LoginModal/CodeInputField'
import { ModalHeader, CloseButton } from './LoginModal/ModalHeader'
import { FormSubmitSections } from './LoginModal/FormSubmitSections'

export default function LoginModal({ showCloseButton = false, title = 'Welcome to Dreamaze', description = 'Sign in to access your account', useRedirect = true }: { showCloseButton?: boolean, useRedirect?:boolean, title?: string, description?: string }) {
  const { state, updateState, setField, resetMessages, resetCodeFlow } = useLoginState()
  const {
    closeLoginModal,
    register,
    login,
    loginAdmin,
    sendResetPasswordLink,
    sendLoginCode,
    verifyLoginCode,
  } = useUserStore()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Setup redirect on mode change
  useEffect(() => {
    resetMessages()
    const urlRedirect = searchParams.get('redirect')
    if (urlRedirect) {
      localStorage.setItem('redirectUrl', urlRedirect)
    }
  }, [state.mode, resetMessages, searchParams])

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (state.countdown > 0) {
      timer = setInterval(() => {
        setField('countdown', (prev:number) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [state.countdown, setField])

  // Auto-submit when code reaches 6 digits
  useEffect(() => {
    if (state.code.length === 6 && state.mode === 'verifyCode') {
      const submitForm = async () => {
        setField('loading', true)
        updateState({ errorMessage: '', successMessage: '' })
        await handleVerifyLoginCode(state.email, state.code)
        setField('loading', false)
      }
      submitForm()
    }
  }, [state.code, state.mode])

  // Helper: Get title based on mode
  const getTitleByMode = (): string => {
    switch (state.mode) {
      case 'login':
        return 'Login'
      case 'register':
        return 'Register'
      case 'forgotPassword':
        return 'Forgot Password'
      case 'codeLogin':
      case 'verifyCode':
        return title;
      default:
        return title;
    }
  }

  const getDescriptionByMode = (): string => {
    switch (state.mode) {
      case 'login':
        return '';
      case 'register':
        return '';
      case 'forgotPassword':
        return "We'll email you a link to create a new password.";
      case 'codeLogin':
        return description;
      case 'verifyCode':
        return `Enter the 6-digit code sent to ${state.email}`;
      default:
        return 'description';
    }
  }

  // Helper: Get button label based on mode
  const getButtonLabelByMode = (): string => {
    if (state.mode === 'verifyCode') return 'Verify Code'
    if (state.mode === 'codeLogin') return 'Send Code'
    if (state.mode === 'forgotPassword') return 'Send Reset Link'
    if (state.mode === 'register') return 'Register'
    return 'Login'
  }

  const getSuccessMessage = (): string => {
    if (state.mode === 'forgotPassword' && state.resetSent) {
      return 'Reset password link has been sent to your email'
    }
    return state.successMessage || ''
  }

  // OAuth handlers
  const handlePostLoginRedirect = (defaultPath = '/') => {
    if (!useRedirect) {
      closeLoginModal();
      return;
    }
    const urlRedirect = localStorage.getItem('redirectUrl')
    if (urlRedirect) {
      localStorage.removeItem('redirectUrl')
      router.push(urlRedirect)
    } else {
      router.push(defaultPath)
    }
  }

  const fetchOAuthRedirect = async (provider: string) => {
    try {
      const res = await fetch(OAUTH_REDIRECT(provider), { method: 'GET', credentials: 'include' })
      if (!res.ok) return null
      const json = await res.json()
      localStorage.setItem('oauthProvider', provider)
      return json.redirect_url ?? json.url ?? null
    } catch (e) {
      console.error('fetchOAuthRedirect error', e)
      return null
    }
  }

  const startOAuth = async (provider: string, loaderField: 'googleLoading' | 'facebookLoading') => {
    setField(loaderField, true)
    updateState({ errorMessage: '' })
    try {
      const url = await fetchOAuthRedirect(provider)
      if (url) {
        return window.location.href = url
      } else {
        updateState({ errorMessage: `${provider} OAuth error. Please try again.` })
      }
    } catch (err) {
      console.error(`${provider} login error:`, err)
      updateState({ errorMessage: `${provider} login error. Please try again.` })
    } finally {
      setField(loaderField, false)
    }
  }

  const handleGoogleLogin = () => startOAuth('google', 'googleLoading')
  const handleFacebookLogin = () => startOAuth('facebook', 'facebookLoading')

  // Form handlers
  const handleForgotPassword = async (email: string) => {
    const success = await sendResetPasswordLink(email)
    updateState({ resetSent: success })
    if (!success) {
      updateState({ errorMessage: 'Failed to send reset password link' })
    }
  }

  const handleSendLoginCode = async (email: string) => {
    const response = await sendLoginCode(email)
    if (response.success) {
      updateState({
        mode: 'verifyCode',
        successMessage: `We've sent a 6 digit code to ${email}. It expires in 10 minutes.`,
        countdown: 60,
        errorMessage: '',
      })
    } else {
      updateState({
        errorMessage: response.message || 'Failed to send code',
        successMessage: '',
      })
    }
  }

  const handleVerifyLoginCode = async (email: string, code: string) => {
    const response = await verifyLoginCode(email, code)
    if (response?.success) {
      handlePostLoginRedirect()
    } else {
      updateState({ errorMessage: 'Failed to verify code' })
    }
  }

  const handleLogin = async (email: string, password: string) => {
    if (email.includes('admin')) {
      const response = await loginAdmin({ email, password })
      if (response?.success) {
        handlePostLoginRedirect('/admin')
      }
    }

    const response = await login({ email, password })
    if (response?.success) {
      handlePostLoginRedirect()
    } else {
      updateState({ errorMessage: 'Login failed' })
    }
  }

  const handleRegister = async (name: string, email: string, password: string) => {
    const response = await register({
      name,
      email,
      password,
      password_confirmation: password,
    })
    if (response?.success) {
      handlePostLoginRedirect()
      return true
    } else {
      updateState({ errorMessage: 'Registration failed' })
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setField('loading', true)
    updateState({ errorMessage: '', successMessage: '' })

    try {
      if (state.mode === 'forgotPassword') {
        await handleForgotPassword(state.email)
      } else if (state.mode === 'codeLogin') {
        await handleSendLoginCode(state.email)
      } else if (state.mode === 'verifyCode') {
        await handleVerifyLoginCode(state.email, state.code)
      } else if (state.mode === 'login') {
        await handleLogin(state.email, state.password)
      } else if (state.mode === 'register') {
        await handleRegister(state.name, state.email, state.password)
      }
    } finally {
      setField('loading', false)
    }
  }

  const handleModeChange = (newMode: LoginMode) => {
    setField('mode', newMode)
    if (newMode === 'codeLogin') {
      setField('code', '')
      setField('successMessage', '')
      setField('errorMessage', '')
      setField('countdown', 0)
    }
  }

  const renderFormContent = () => {
    if (state.mode === 'register') {
      return (
        <NameEmailPasswordFields
          showName
          name={state.name}
          onNameChange={(value) => setField('name', value)}
          email={state.email}
          onEmailChange={(value) => setField('email', value)}
          showPassword={state.showPassword}
          password={state.password}
          onPasswordChange={(value) => setField('password', value)}
          onPasswordToggle={() => setField('showPassword', !state.showPassword)}
          nameLabel="Name"
          emailLabel="Email"
          passwordLabel="Password"
          namePlaceholder="Enter your name"
          emailPlaceholder="Enter your email"
          passwordPlaceholder="Enter your password"
        />
      )
    }

    if (state.mode === 'login') {
      return (
        <NameEmailPasswordFields
          email={state.email}
          onEmailChange={(value) => setField('email', value)}
          showPassword={state.showPassword}
          password={state.password}
          onPasswordChange={(value) => setField('password', value)}
          onPasswordToggle={() => setField('showPassword', !state.showPassword)}
          emailLabel="Email"
          passwordLabel="Password"
          emailPlaceholder="Enter your email"
          passwordPlaceholder="Enter your password"
          nameLabel="Name"
        />
      )
    }

    if (state.mode === 'forgotPassword') {
      return (
        <fieldset className="space-y-4">
          <Input
            id="email"
            label="Email"
            type="email"
            value={state.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="Enter your email"
            required
          />
        </fieldset>
      )
    }

    if (state.mode === 'codeLogin') {
      return (
        <fieldset className="space-y-4">
          <Input
            id="email"
            label="Email"
            type="email"
            value={state.email}
            onChange={(e) => setField('email', e.target.value)}
            placeholder="Enter your email"
            required
          />
        </fieldset>
      )
    }

    if (state.mode === 'verifyCode') {
      return (
        <CodeInputField
          code={state.code}
          onCodeChange={(value) => setField('code', value)}
          successMessage={state.successMessage}
        />
      )
    }

    return null
  }

  return (
    <main className="flex flex-col items-center justify-center bg-white rounded-lg p-4 w-96 gap-4 relative" role="main">
      <div className="flex justify-between items-center w-full">
        {state.mode !== 'codeLogin' && (
          <button
            type="button"
            onClick={resetCodeFlow}
            className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors focus:outline-none"
            aria-label="Go back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {showCloseButton && <CloseButton onClose={closeLoginModal} />}
      </div>

      <ModalHeader
        title={getTitleByMode()}
        description={getDescriptionByMode()}
      />

      <form onSubmit={handleSubmit} className="space-y-4 text-[#222222] w-full" noValidate>
        {renderFormContent()}

        <FormSubmitSections
          mode={state.mode}
          loading={state.loading}
          errorMessage={state.errorMessage}
          resetSent={state.resetSent}
          successMessage={getSuccessMessage()}
          countdown={state.countdown}
          buttonLabel={getButtonLabelByMode()}
          onModeChange={handleModeChange}
          onResetCodeFlow={() => {
            resetCodeFlow()
            setField('resetSent', false)
          }}
          onSendLoginCode={handleSendLoginCode}
          googleLoading={state.googleLoading}
          facebookLoading={state.facebookLoading}
          onGoogleLogin={handleGoogleLogin}
          onFacebookLogin={handleFacebookLogin}
          translations={{
            forgotPasswordQuestion: 'Forgot your password?',
            loginWithCode: 'Login with verification code',
            haveAccount: 'Already have an account?',
            login: 'Login',
            backToLogin: 'Back to Login',
            returnToLogin: 'Return to Login',
            usePasswordInstead: 'Use password instead',
            changeEmail: 'Change email',
            orContinueWith: 'Or continue with',
          }}
          email={state.email}
        />
      </form>
    </main>
  )
}
