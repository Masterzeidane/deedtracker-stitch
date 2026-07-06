'use client'
import { useState, useTransition } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { updatePassword } from '@/lib/actions'

// Reached from the password-reset email (routed through /auth/callback, which
// exchanges the recovery code and sets the session), so the user is
// authenticated here and can set a new password via the existing action.
export default function UpdatePasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    startTransition(async () => {
      const result = await updatePassword(formData)
      // On success the action redirects to /dashboard.
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="min-h-screen bg-[#0b1326] flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#4edea3' }} />

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg" style={{ background: 'linear-gradient(135deg, #4edea3, #10b981)', color: '#0b1326', fontFamily: 'var(--font-sora), sans-serif' }}>D</div>
          <span className="text-xl font-bold text-[#dae2fd]" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>DeedTracker</span>
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'rgba(23,31,51,0.9)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
          <h1 className="text-xl font-bold text-[#dae2fd] mb-1" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
            Set a new password
          </h1>
          <p className="text-sm text-[#86948a] mb-6">Choose a strong password for your account.</p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg text-sm text-[#ffb3af]" style={{ background: 'rgba(252,124,120,0.1)', border: '1px solid rgba(252,124,120,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#bbcabf] mb-1.5">New Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 rounded-lg text-sm text-[#dae2fd] bg-white/[0.04] border border-white/[0.08] outline-none focus:border-[#4edea3] transition-colors placeholder:text-[#86948a]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86948a] hover:text-[#bbcabf] transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#bbcabf] mb-1.5">Confirm Password</label>
              <input
                name="confirm"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg text-sm text-[#dae2fd] bg-white/[0.04] border border-white/[0.08] outline-none focus:border-[#4edea3] transition-colors placeholder:text-[#86948a]"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: '#4edea3', color: '#003824', fontFamily: 'var(--font-sora), sans-serif' }}
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isPending ? 'Saving…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
