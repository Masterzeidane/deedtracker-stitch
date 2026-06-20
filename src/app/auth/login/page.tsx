'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { signIn } from '@/lib/actions'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await signIn(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="min-h-screen bg-[#0b1326] flex items-center justify-center p-4">
      {/* Background orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#4edea3' }} />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #4edea3, #10b981)', color: '#0b1326', fontFamily: 'var(--font-sora), sans-serif' }}
          >
            D
          </div>
          <span className="text-xl font-bold text-[#dae2fd]" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>DeedTracker</span>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6"
          style={{ background: 'rgba(23,31,51,0.9)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
        >
          <h1 className="text-xl font-bold text-[#dae2fd] mb-1" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
            Welcome back
          </h1>
          <p className="text-sm text-[#86948a] mb-6">Continue your spiritual journey</p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg text-sm text-[#ffb3af]" style={{ background: 'rgba(252,124,120,0.1)', border: '1px solid rgba(252,124,120,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#bbcabf] mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
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
                  autoComplete="current-password"
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

            <div className="flex justify-end">
              <Link href="/auth/reset-password" className="text-xs text-[#4edea3] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: '#4edea3', color: '#003824', fontFamily: 'var(--font-sora), sans-serif' }}
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isPending ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[#86948a]">
            New here?{' '}
            <Link href="/auth/signup" className="text-[#4edea3] hover:underline font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
