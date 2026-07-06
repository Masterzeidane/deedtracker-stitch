'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { updateProfile, updatePreferences } from '@/lib/actions'
import type { User } from '@/types'

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="relative w-10 h-5 rounded-full transition-all duration-200 flex items-center"
      style={{ background: checked ? '#4edea3' : 'rgba(255,255,255,0.1)' }}
    >
      <span
        className="absolute w-4 h-4 rounded-full bg-white transition-all duration-200"
        style={{ left: checked ? '22px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
      />
    </button>
  )
}

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

function Row({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm text-[#dae2fd]">{label}</div>
        {description && <div className="text-xs text-[#86948a] mt-0.5">{description}</div>}
      </div>
      {children}
    </div>
  )
}

interface SettingsViewProps {
  user: User
}

export function SettingsView({ user }: SettingsViewProps) {
  const prefs = (user.preferences ?? {}) as {
    notifications?: Partial<Record<string, boolean>>
  }
  const [notifs, setNotifs] = useState({
    dailyReminder: prefs.notifications?.dailyReminder ?? true,
    streak: prefs.notifications?.streak ?? true,
    challenges: prefs.notifications?.challenges ?? true,
    community: prefs.notifications?.community ?? false,
    weeklyReport: prefs.notifications?.weeklyReport ?? true,
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [, startPrefs] = useTransition()
  const router = useRouter()

  function toggleNotif(key: keyof typeof notifs) {
    setNotifs((n) => {
      const next = { ...n, [key]: !n[key] }
      startPrefs(() => {
        updatePreferences({ notifications: next })
      })
      return next
    })
  }

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

        {/* Notifications (persisted to profile.preferences) */}
        <Section title="Notifications">
          <Row label="Daily Reminder" description="Remind me to complete today's deeds">
            <Toggle checked={notifs.dailyReminder} onChange={() => toggleNotif('dailyReminder')} />
          </Row>
          <Row label="Streak Alerts" description="Alert me when my streak is at risk">
            <Toggle checked={notifs.streak} onChange={() => toggleNotif('streak')} />
          </Row>
          <Row label="Challenge Updates" description="Notify me about challenge progress">
            <Toggle checked={notifs.challenges} onChange={() => toggleNotif('challenges')} />
          </Row>
          <Row label="Community Activity" description="Show me what others are completing">
            <Toggle checked={notifs.community} onChange={() => toggleNotif('community')} />
          </Row>
          <Row label="Weekly Report" description="Summary of my week every Sunday">
            <Toggle checked={notifs.weeklyReport} onChange={() => toggleNotif('weeklyReport')} />
          </Row>
        </Section>
      </div>
    </div>
  )
}
