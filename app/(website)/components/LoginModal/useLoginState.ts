import { useState, useCallback } from 'react'

export type LoginMode = 'login' | 'register' | 'forgotPassword' | 'codeLogin' | 'verifyCode'

export interface FormState {
  name: string
  email: string
  password: string
  code: string
  mode: LoginMode
  loading: boolean
  codeSent: boolean
  resetSent: boolean
  errorMessage: string
  successMessage: string
  googleLoading: boolean
  facebookLoading: boolean
  showPassword: boolean
  countdown: number
}

export const useLoginState = () => {
  const [state, setState] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    code: '',
    mode: 'codeLogin',
    loading: false,
    codeSent: false,
    resetSent: false,
    errorMessage: '',
    successMessage: '',
    googleLoading: false,
    facebookLoading: false,
    showPassword: false,
    countdown: 0,
  })

  const updateState = useCallback((updates: Partial<FormState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  const setField = useCallback((field: keyof FormState, value: any) => {
    setState((prev) => ({ ...prev, [field]: value }))
  }, [])

  const resetMessages = useCallback(() => {
    setState((prev) => ({
      ...prev,
      errorMessage: '',
      successMessage: '',
    }))
  }, [])

  const resetCodeFlow = useCallback(() => {
    const backModeMap:{[key: string]: LoginMode} = {
      'verifyCode': 'codeLogin',
      'login':'codeLogin',
      'resetPassword':'codeLogin',
    };
    setState((prev) => ({
      ...prev,
      mode: backModeMap[prev.mode] || 'codeLogin',
      code: '',
      successMessage: '',
      errorMessage: '',
      countdown: 0,
    }))
  }, [])

  return { state, updateState, setField, resetMessages, resetCodeFlow }
}
