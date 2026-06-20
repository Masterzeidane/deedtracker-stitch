'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

const PLANS = [
  {
    name: 'Seeker',
    price: '$0',
    period: 'forever free',
    color: '#86948a',
    features: [
      'Up to 5 daily deeds',
      '1 Spiritual Branch',
      'Basic XP & streak tracking',
      'Personal leaderboard',
      'Community access (read-only)',
    ],
    cta: 'Get Started Free',
    href: '/dashboard',
    popular: false,
  },
  {
    name: 'Devotee',
    price: '$9.99',
    period: 'per month',
    color: '#4edea3',
    features: [
      'Unlimited daily deeds',
      'All 5 Spiritual Branches',
      'Full challenge participation',
      'Community & activity feed',
      'Global & branch leaderboards',
      'Achievement system',
      'Detailed analytics',
    ],
    cta: 'Start 7-Day Trial',
    href: '/dashboard',
    popular: true,
  },
  {
    name: 'Legend',
    price: '$29.99',
    period: 'per month',
    color: '#c084fc',
    features: [
      'Everything in Devotee',
      'AI Spiritual Coach',
      'Custom branches',
      'Advanced analytics dashboard',
      'Priority support',
      'Early access to new features',
      'Legacy badge & exclusive rank',
    ],
    cta: 'Become a Legend',
    href: '/dashboard',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] px-6 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#bbcabf] hover:text-[#4edea3] transition-colors mb-10"
        >
          <ArrowLeft size={14} /> Back
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1
            className="text-4xl font-extrabold text-[#dae2fd] mb-4"
            style={{ fontFamily: 'var(--font-sora), sans-serif', letterSpacing: '-0.02em' }}
          >
            Simple, Honest Pricing
          </h1>
          <p className="text-[#bbcabf] max-w-md mx-auto">
            Choose the plan that matches your level of commitment. Upgrade anytime.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(({ name, price, period, color, features, cta, href, popular }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl p-6 flex flex-col"
              style={{
                background: popular ? `${color}10` : 'rgba(23,31,51,0.8)',
                border: popular ? `2px solid ${color}` : '1px solid rgba(255,255,255,0.08)',
                boxShadow: popular ? `0 0 40px ${color}15` : 'none',
              }}
            >
              {popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                  style={{ background: color, color: '#003824', fontFamily: 'var(--font-sora), sans-serif' }}
                >
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ color, fontFamily: 'var(--font-sora), sans-serif' }}
                >
                  {name}
                </h3>
                <div className="flex items-end gap-1">
                  <span
                    className="text-4xl font-extrabold text-[#dae2fd]"
                    style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                  >
                    {price}
                  </span>
                  <span className="text-sm text-[#86948a] mb-1">/{period}</span>
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#bbcabf]">
                    <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" style={{ color }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={href}
                className="block text-center py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                style={
                  popular
                    ? { background: color, color: '#003824', fontFamily: 'var(--font-sora), sans-serif' }
                    : { border: `1px solid ${color}50`, color, fontFamily: 'var(--font-sora), sans-serif' }
                }
              >
                {cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-[#86948a] mt-10">
          All plans include a 30-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </div>
  )
}
