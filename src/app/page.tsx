'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

const FEATURES = [
  { icon: '🌿', branch: 'Worship', color: '#4edea3', desc: 'Track daily prayers, dhikr, and Quranic recitation. Build a sacred routine.' },
  { icon: '📘', branch: 'Knowledge', color: '#60a5fa', desc: 'Log study sessions, books, and lectures. Deepen your understanding.' },
  { icon: '🔥', branch: 'Discipline', color: '#ffb95f', desc: 'Conquer fasting, fitness, and self-mastery. Forge an iron will.' },
  { icon: '💜', branch: 'Character', color: '#c084fc', desc: 'Cultivate patience, forgiveness, and inner nobility. Grow your soul.' },
  { icon: '🌸', branch: 'Charity', color: '#ffb3af', desc: 'Give generously, serve your community. Open the gates of abundance.' },
]

const STEPS = [
  { n: '01', title: 'Log Your Deeds', desc: 'Record acts of worship, learning, discipline, character, and charity every day.' },
  { n: '02', title: 'Earn XP & Coins', desc: 'Every deed rewards you with experience points and spiritual coins.' },
  { n: '03', title: 'Level Up Your Soul', desc: 'Progress through 9 ranks and bloom all 5 branches of your Spiritual Tree.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd]">
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(11,19,38,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-base"
            style={{ background: 'linear-gradient(135deg, #4edea3, #10b981)', color: '#0b1326', fontFamily: 'var(--font-sora), sans-serif' }}
          >
            D
          </div>
          <span className="text-base font-bold" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>DeedTracker</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-[#bbcabf]">
          <Link href="#features" className="hover:text-[#4edea3] transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-[#4edea3] transition-colors">How it Works</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden md:block px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ color: '#bbcabf', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(78,222,163,0.4)]"
            style={{ background: '#4edea3', color: '#003824', fontFamily: 'var(--font-sora), sans-serif' }}
          >
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#4edea3' }} />
        <div className="absolute top-40 right-1/4 w-64 h-64 rounded-full opacity-8 blur-3xl pointer-events-none" style={{ background: '#60a5fa' }} />

        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h1
            className="text-5xl md:text-6xl font-extrabold leading-tight mb-6"
            style={{ fontFamily: 'var(--font-sora), sans-serif', letterSpacing: '-0.02em' }}
          >
            Track Your{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #4edea3, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Spiritual Journey
            </span>
          </h1>
          <p className="text-lg text-[#bbcabf] mb-8 max-w-xl mx-auto leading-relaxed">
            Gamified deed tracking for the Muslim seeking growth. Earn XP, level up your soul, and bloom your Spiritual Tree — one deed at a time.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold transition-all hover:shadow-[0_0_30px_rgba(78,222,163,0.4)]"
              style={{ background: '#4edea3', color: '#003824', fontFamily: 'var(--font-sora), sans-serif' }}
            >
              Begin Your Journey <ArrowRight size={16} />
            </Link>
            <Link
              href="#features"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.12)', color: '#bbcabf' }}
            >
              See Features
            </Link>
          </div>

        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-[#dae2fd] mb-4"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              Five Branches of Growth
            </h2>
            <p className="text-[#bbcabf] max-w-lg mx-auto">
              The Spiritual Tree system tracks your growth across every dimension of Islamic character.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {FEATURES.map(({ icon, branch, color, desc }, i) => (
              <motion.div
                key={branch}
                variants={FADE_UP}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.03, boxShadow: `0 0 24px ${color}25` }}
                className="p-5 rounded-xl cursor-default"
                style={{ background: 'rgba(23,31,51,0.8)', border: `1px solid ${color}20` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: `${color}15` }}
                >
                  {icon}
                </div>
                <h3
                  className="text-sm font-bold mb-2"
                  style={{ color, fontFamily: 'var(--font-sora), sans-serif' }}
                >
                  {branch}
                </h3>
                <p className="text-xs text-[#86948a] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl font-bold text-[#dae2fd] mb-4"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              How It Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map(({ n, title, desc }, i) => (
              <motion.div
                key={n}
                variants={FADE_UP}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 rounded-xl"
                style={{ background: 'rgba(23,31,51,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  className="text-5xl font-extrabold opacity-10 mb-4 leading-none"
                  style={{ color: '#4edea3', fontFamily: 'var(--font-sora), sans-serif' }}
                >
                  {n}
                </div>
                <h3 className="text-base font-bold text-[#dae2fd] mb-2" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
                  {title}
                </h3>
                <p className="text-sm text-[#86948a]">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, #4edea3, transparent 70%)' }} />
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative z-10 max-w-xl mx-auto"
        >
          <h2
            className="text-4xl font-extrabold text-[#dae2fd] mb-4"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            Start Your Journey Today
          </h2>
          <p className="text-[#bbcabf] mb-8">Free forever. No credit card required. Just your intention.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:shadow-[0_0_40px_rgba(78,222,163,0.5)]"
            style={{ background: '#4edea3', color: '#003824', fontFamily: 'var(--font-sora), sans-serif' }}
          >
            Begin Free <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className="py-10 px-6 text-center"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div
          className="text-lg font-bold text-[#4edea3] mb-2"
          style={{ fontFamily: 'var(--font-sora), sans-serif' }}
        >
          DeedTracker
        </div>
        <p className="text-xs text-[#86948a]">© 2026 DeedTracker. Track your deeds. Grow your soul.</p>
      </footer>
    </div>
  )
}
