'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { updateProfile } from '@/lib/actions'
import type { User } from '@/types'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'rgba(23,31,51,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <h3
        className="text-sm font-semibold text-[#dae2fd] mb-4 pb-3"
        style={{ fontFamily: 'var(--font-sora), sans-serif', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

interface SettingsViewProps {
  user: User
}

export function SettingsView({ user }: SettingsViewProps) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSave(formData: FormData) {
    setMessage('')
    setError('')
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result?.error) setError(result.error)
      else {
        setMessage('Profile saved.')
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-6">
      <Navbar title="Settings" />

      <div className="max-w-2xl space-y-5">
        {/* Profile */}
        <form action={handleSave}>
          <Section title="Profile">
            <div className="flex items-center gap-4 mb-4">
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-xl" style={{ border: '2px solid rgba(78,222,163,0.3)' }} />
            </div>

            <div>
              <label className="block text-xs text-[#86948a] mb-1">Display Name</label>
              <input
                name="name"
                defaultValue={user.name}
                className="w-full px-3 py-2 rounded-lg text-sm text-[#dae2fd] outline-none focus:border-[#4edea3] transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
            <div>
              <label className="block text-xs text-[#86948a] mb-1">Email</label>
              <input
                defaultValue={user.email}
                disabled
                className="w-full px-3 py-2 rounded-lg text-sm text-[#86948a] outline-none"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              />
            </div>
            <div>
              <label className="block text-xs text-[#86948a] mb-1">Location</label>
              <input
                name="location"
                defaultValue={user.location}
                className="w-full px-3 py-2 rounded-lg text-sm text-[#dae2fd] outline-none focus:border-[#4edea3] transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
            <textarea
              name="bio"
              defaultValue={user.bio}
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm text-[#dae2fd] outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              placeholder="Bio..."
            />

            {message && <p className="text-xs text-[#4edea3]">{message}</p>}
            {error && <p className="text-xs text-[#ffb3af]">{error}</p>}

            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              style={{ background: '#4edea3', color: '#003824', fontFamily: 'var(--font-sora), sans-serif' }}
            >
              {isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </Section>
        </form>
      </div>
    </div>
  )
}
