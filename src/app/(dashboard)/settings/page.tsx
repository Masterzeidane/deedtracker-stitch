'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { currentUser } from '@/lib/data'

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
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

export default function SettingsPage() {
  const user = currentUser
  const [notifs, setNotifs] = useState({ dailyReminder: true, streak: true, challenges: true, community: false, weeklyReport: true })
  const [privacy, setPrivacy] = useState({ publicProfile: true, showStreak: true, showBranches: false })

  return (
    <div className="space-y-6">
      <Navbar title="Settings" />

      <div className="max-w-2xl space-y-5">
        {/* Profile */}
        <Section title="Profile">
          <div className="flex items-center gap-4 mb-4">
            <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-xl" style={{ border: '2px solid rgba(78,222,163,0.3)' }} />
            <button
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: 'rgba(78,222,163,0.1)', color: '#4edea3', border: '1px solid rgba(78,222,163,0.2)' }}
            >
              Change Avatar
            </button>
          </div>
          {[
            { label: 'Display Name', defaultValue: user.name },
            { label: 'Email', defaultValue: user.email },
            { label: 'Location', defaultValue: user.location },
          ].map(({ label, defaultValue }) => (
            <div key={label}>
              <label className="block text-xs text-[#86948a] mb-1">{label}</label>
              <input
                defaultValue={defaultValue}
                className="w-full px-3 py-2 rounded-lg text-sm text-[#dae2fd] outline-none focus:border-[#4edea3] transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          ))}
          <textarea
            defaultValue={user.bio}
            rows={3}
            className="w-full px-3 py-2 rounded-lg text-sm text-[#dae2fd] outline-none resize-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
            placeholder="Bio..."
          />
          <button
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: '#4edea3', color: '#003824', fontFamily: 'var(--font-sora), sans-serif' }}
          >
            Save Changes
          </button>
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <Row label="Daily Reminder" description="Remind me to complete today's deeds">
            <Toggle checked={notifs.dailyReminder} onChange={() => setNotifs(n => ({ ...n, dailyReminder: !n.dailyReminder }))} />
          </Row>
          <Row label="Streak Alerts" description="Alert me when my streak is at risk">
            <Toggle checked={notifs.streak} onChange={() => setNotifs(n => ({ ...n, streak: !n.streak }))} />
          </Row>
          <Row label="Challenge Updates" description="Notify me about challenge progress">
            <Toggle checked={notifs.challenges} onChange={() => setNotifs(n => ({ ...n, challenges: !n.challenges }))} />
          </Row>
          <Row label="Community Activity" description="Show me what others are completing">
            <Toggle checked={notifs.community} onChange={() => setNotifs(n => ({ ...n, community: !n.community }))} />
          </Row>
          <Row label="Weekly Report" description="Summary of my week every Sunday">
            <Toggle checked={notifs.weeklyReport} onChange={() => setNotifs(n => ({ ...n, weeklyReport: !n.weeklyReport }))} />
          </Row>
        </Section>

        {/* Privacy */}
        <Section title="Privacy">
          <Row label="Public Profile" description="Allow others to view your profile">
            <Toggle checked={privacy.publicProfile} onChange={() => setPrivacy(p => ({ ...p, publicProfile: !p.publicProfile }))} />
          </Row>
          <Row label="Show Streak" description="Display your streak on the leaderboard">
            <Toggle checked={privacy.showStreak} onChange={() => setPrivacy(p => ({ ...p, showStreak: !p.showStreak }))} />
          </Row>
          <Row label="Show Branch Progress" description="Share which branches you're growing">
            <Toggle checked={privacy.showBranches} onChange={() => setPrivacy(p => ({ ...p, showBranches: !p.showBranches }))} />
          </Row>
        </Section>

        {/* Danger Zone */}
        <Section title="Danger Zone">
          <Row label="Delete Account" description="Permanently delete your account and all data">
            <button
              className="px-4 py-2 rounded-lg text-xs font-semibold"
              style={{ background: 'rgba(252,124,120,0.1)', color: '#fc7c78', border: '1px solid rgba(252,124,120,0.2)' }}
            >
              Delete Account
            </button>
          </Row>
        </Section>
      </div>
    </div>
  )
}
