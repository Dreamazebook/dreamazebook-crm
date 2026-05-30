import { memo } from 'react'
import Input from '@/app/components/common/Input'

interface CodeInputFieldProps {
  code: string
  onCodeChange: (value: string) => void
  successMessage: string
}

export const CodeInputField = memo(({ code, onCodeChange, successMessage }: CodeInputFieldProps) => {
  const handleCodeInput = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return
    const newCode = code.split('')
    newCode[index] = value
    const newCodeValue = newCode.join('')
    onCodeChange(newCodeValue)
    
    if (value && index < 5) {
      (document.querySelectorAll('.code-input')[index + 1] as HTMLInputElement)?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      (document.querySelectorAll('.code-input')[index - 1] as HTMLInputElement)?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData?.getData('text') || ''
    const digits = pastedData.replace(/\D/g, '').slice(0, 6)
    if (digits.length > 0) {
      onCodeChange(digits.padEnd(6, ''))
      const inputs = document.querySelectorAll('.code-input')
      const focusIdx = Math.min(digits.length, 5)
      ;(inputs[focusIdx] as HTMLInputElement)?.focus()
    }
  }

  return (
    <div>
      {successMessage && (
        <div className="p-3 text-center" role="status" aria-live="polite">
          <p>{successMessage}</p>
        </div>
      )}

      <div className="flex gap-2">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={code[index] || ''}
            onChange={(e) => handleCodeInput(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="code-input w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1BA7FF] focus:border-[#1BA7FF] outline-none"
            required
            aria-label={`Code digit ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
})

CodeInputField.displayName = 'CodeInputField'
