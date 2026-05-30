import { memo } from 'react'

interface LoginLinksProps {
  onForgotPassword: () => void
  onCodeLogin: () => void
  translations: {
    forgotPasswordQuestion: string
    loginWithCode: string
  }
}

interface RegisterLinksProps {
  onLogin: () => void
  translations: {
    haveAccount: string
    login: string
  }
}

interface ForgotPasswordLinksProps {
  onLogin: () => void
  translations: {
    loginWithCode: string
  }
}

interface CodeLoginEmailLinksProps {
  onLogin: () => void
  translations: {
    usePasswordInstead: string
  }
}

interface CodeLoginCodeLinksProps {
  onChangeEmail: () => void
  translations: {
    changeEmail: string
  }
}

// Login Mode Links
export const LoginLinks = memo(({ onForgotPassword, onCodeLogin, translations }: LoginLinksProps) => {
  return (
    <div className="flex flex-col space-y-2 text-sm">
      <button
        type="button"
        className="cursor-pointer text-[#1BA7FF] hover:text-[#1689E6] transition-colors focus:outline-none focus:underline"
        onClick={onForgotPassword}
      >
        {translations.forgotPasswordQuestion}
      </button>
    </div>
  )
})
LoginLinks.displayName = 'LoginLinks'

// Register Mode Links
export const RegisterLinks = memo(({ onLogin, translations }: RegisterLinksProps) => {
  return (
    <div className="text-sm">
      <span>
        {translations.haveAccount}{' '}
        <button
          type="button"
          className="cursor-pointer text-[#1BA7FF] hover:text-[#1689E6] transition-colors focus:outline-none focus:underline"
          onClick={onLogin}
        >
          {translations.login}
        </button>
      </span>
    </div>
  )
})
RegisterLinks.displayName = 'RegisterLinks'

// Forgot Password Mode Links
export const ForgotPasswordLinks = memo(({ onLogin, translations }: ForgotPasswordLinksProps) => {
  return (
      <button
        type="button"
        className="cursor-pointer text-center w-full text-[#1BA7FF] hover:text-[#1689E6] transition-colors focus:outline-none focus:underline"
        onClick={onLogin}
      >
        {translations.loginWithCode}
      </button>
  )
})
ForgotPasswordLinks.displayName = 'ForgotPasswordLinks'

// Code Login - Email Input Links
export const CodeLoginEmailLinks = memo(({ onLogin, translations }: CodeLoginEmailLinksProps) => {
  return (
    <button
      type="button"
      className="cursor-pointer w-full text-center text-[#1BA7FF] hover:text-[#1689E6] transition-colors focus:outline-none focus:underline"
      onClick={onLogin}
    >
      {translations.usePasswordInstead}
    </button>
  )
})
CodeLoginEmailLinks.displayName = 'CodeLoginEmailLinks'

// Code Login - Code Input Links
export const CodeLoginCodeLinks = memo(({ onChangeEmail, translations }: CodeLoginCodeLinksProps) => {
  return (
    <div className="text-sm">
      <button
        type="button"
        className="cursor-pointer text-[#1BA7FF] hover:text-[#1689E6] transition-colors focus:outline-none focus:underline"
        onClick={onChangeEmail}
      >
        {translations.changeEmail}
      </button>
    </div>
  )
})
CodeLoginCodeLinks.displayName = 'CodeLoginCodeLinks'

// Main ModeToggleLinks component that dispatches to appropriate sub-component
interface ModeToggleLinksProps {
  mode: 'login' | 'register' | 'forgotPassword' | 'codeLogin'
  resetSent: boolean
  codeSent: boolean
  onModeChange: (mode: any) => void
  onCodeFlowReset: () => void
  translations: {
    forgotPasswordQuestion: string
    backToLogin: string
    loginWithCode: string
    login: string
    haveAccount: string
    changeEmail: string
    usePasswordInstead: string
  }
}

export const ModeToggleLinks = memo(({
  mode,
  resetSent,
  codeSent,
  onModeChange,
  onCodeFlowReset,
  translations,
}: ModeToggleLinksProps) => {
  if (mode === 'login') {
    return (
      <LoginLinks
        onForgotPassword={() => onModeChange('forgotPassword')}
        onCodeLogin={() => onModeChange('codeLogin')}
        translations={{
          forgotPasswordQuestion: translations.forgotPasswordQuestion,
          loginWithCode: '',
        }}
      />
    )
  }

  if (mode === 'register') {
    return (
      <RegisterLinks
        onLogin={() => onModeChange('login')}
        translations={{
          haveAccount: translations.haveAccount,
          login: translations.login,
        }}
      />
    )
  }

  if (mode === 'forgotPassword' && !resetSent) {
    return (
      <ForgotPasswordLinks
        onLogin={() => onModeChange('codeLogin')}
        translations={{
          loginWithCode: translations.loginWithCode,
        }}
      />
    )
  }

  if (mode === 'codeLogin' && !codeSent) {
    return (
      <CodeLoginEmailLinks
        onLogin={() => onModeChange('login')}
        translations={{
          usePasswordInstead: translations.usePasswordInstead,
        }}
      />
    )
  }

  // if (mode === 'codeLogin' && codeSent) {
  //   return (
  //     <CodeLoginCodeLinks
  //       onChangeEmail={onCodeFlowReset}
  //       translations={{
  //         changeEmail: translations.changeEmail,
  //       }}
  //     />
  //   )
  // }

  return null
})

ModeToggleLinks.displayName = 'ModeToggleLinks'
