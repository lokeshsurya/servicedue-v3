import { useState } from 'react'
import { CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'

interface InputFieldProps {
    label: string
    type?: 'text' | 'email' | 'password'
    placeholder?: string
    value: string
    onChange: (value: string) => void
    error?: string
    success?: boolean
    required?: boolean
    autoComplete?: string
}

export default function InputField({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    success,
    required,
    autoComplete
}: InputFieldProps) {
    const [showPassword, setShowPassword] = useState(false)
    const [focused, setFocused] = useState(false)

    const inputType = type === 'password' && showPassword ? 'text' : type

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="relative">
                <input
                    type={inputType}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={`
            w-full rounded-xl border px-4 py-3.5 text-sm text-slate-800 
            outline-none transition-all duration-200 pr-10
            ${error
                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : success
                                ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                                : focused
                                    ? 'border-blue-500 bg-white ring-2 ring-blue-200'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                        }
          `}
                />

                {/* Toggle Password Visibility */}
                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}

                {/* Success/Error Icons */}
                {!type.includes('password') && (
                    <>
                        {success && (
                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-in zoom-in duration-200" />
                        )}
                        {error && (
                            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 animate-in zoom-in duration-200" />
                        )}
                    </>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-xs text-red-600 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </p>
            )}
        </div>
    )
}
