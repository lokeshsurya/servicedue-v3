interface PasswordStrengthMeterProps {
    password: string
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
    const getStrength = (): { level: number; label: string; color: string } => {
        if (password.length === 0) {
            return { level: 0, label: '', color: '' }
        }

        let strength = 0

        // Length check
        if (password.length >= 8) strength++
        if (password.length >= 12) strength++

        // Complexity checks
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
        if (/\d/.test(password)) strength++
        if (/[^a-zA-Z0-9]/.test(password)) strength++

        if (strength <= 2) {
            return { level: 1, label: 'Weak', color: 'bg-red-500' }
        } else if (strength <= 3) {
            return { level: 2, label: 'Medium', color: 'bg-yellow-500' }
        } else {
            return { level: 3, label: 'Strong', color: 'bg-green-500' }
        }
    }

    const { level, label, color } = getStrength()

    if (!password) return null

    return (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <div className="flex gap-1.5">
                {[1, 2, 3].map((bar) => (
                    <div
                        key={bar}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${bar <= level ? color : 'bg-slate-200'
                            }`}
                    />
                ))}
            </div>

            {label && (
                <p className="text-xs font-medium text-slate-600">
                    Password strength: <span className={label === 'Weak' ? 'text-red-600' : label === 'Medium' ? 'text-yellow-600' : 'text-green-600'}>{label}</span>
                </p>
            )}

            <ul className="text-xs text-slate-500 space-y-1">
                <li className={password.length >= 8 ? 'text-green-600' : ''}>
                    {password.length >= 8 ? '✓' : '○'} At least 8 characters
                </li>
                <li className={/\d/.test(password) ? 'text-green-600' : ''}>
                    {/\d/.test(password) ? '✓' : '○'} Contains a number
                </li>
                <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
                    {/[A-Z]/.test(password) ? '✓' : '○'} Contains uppercase letter
                </li>
            </ul>
        </div>
    )
}
