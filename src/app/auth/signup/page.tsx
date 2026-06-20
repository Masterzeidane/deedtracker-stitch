'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { signUp } from '@/lib/actions'

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess('')
    const formData = new FormData(e.currentTarget)

    if (formData.get('password') !== formData.get('confirmPassword')) {
      setError('Passwords do not match')
      return
    }

    startTransition(async () => {
      const result = await signUp(formData)
      if (result.error) setError(result.error)
      else if (result.success) setSuccess(result.message || 'Account created!')
    })
  }

  return (
    <div className="min-h-screen bg-[#0b1326] flex items-center justify-center p-4">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#4edea3' }} />

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #4edea3, #10b981)', color: '#0b1326', fontFamily: 'var(--font-sora), sans-serif' }}
          >D</div>
          <span className="text-xl font-bold text-[#dae2fd]" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>DeedTracker</span>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: 'rgba(23,31,51,0.9)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
        >
          <h1 className="text-xl font-bold text-[#dae2fd] mb-1" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
            Begin your journey
          </h1>
          <p className="text-sm text-[#86948a] mb-6">Create your free DeedTracker account</p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg text-sm text-[#ffb3af]" style={{ background: 'rgba(252,124,120,0.1)', border: '1px solid rgba(252,124,120,0.2)' }}>
              {error}
            </div>
          )}

          {success ? (
            <div className="flex flex-col items-center py-6 gap-4 text-center">
              <CheckCircle2 size={40} className="text-[#4edea3]" />
              <p className="text-sm text-[#bbcabf]">{success}</p>
              <Link href="/auth/login" className="text-[#4edea3] text-sm hover:underline">
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#bbcabf] mb-1.5">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-[#dae2fd] bg-white/[0.04] border border-white/[0.08] outline-none focus:border-[#4edea3] transition-colors placeholder:text-[#86948a]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#bbcabf] mb-1.5">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-[#dae2fd] bg-white/[0.04] border border-white/[0.08] outline-none focus:border-[#4edea3] transition-colors placeholder:text-[#86948a]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#bbcabf] mb-1.5">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    placeholder="Min. 8 characters"
                    className="w-full px-3 py-2.5 pr-10 rounded-lg text-sm text-[#dae2fd] bg-white/[0.04] border border-white/[0.08] outline-none focus:border-[#4edea3] transition-colors placeholder:text-[#86948a]"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86948a]">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#bbcabf] mb-1.5">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Repeat password"
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
                {isPending ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}

          {!success && (
            <p className="mt-5 text-center text-sm text-[#86948a]">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#4edea3] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
