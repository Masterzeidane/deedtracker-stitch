'use client'
import { Heart, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { communityPosts, leaderboard } from '@/lib/data'
import { getBranchColor, getBranchLabel, timeAgo } from '@/lib/utils'

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <Navbar title="Community" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity feed */}
        <div className="lg:col-span-2 space-y-3">
          <h3
            className="text-sm font-semibold text-[#dae2fd] mb-4"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            Live Activity Feed
          </h3>
          {communityPosts.map((post, i) => {
            const branchColor = getBranchColor(post.branch)
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="p-4 rounded-xl"
                style={{ background: 'rgba(23,31,51,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-start gap-3">
                  <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-[#dae2fd]" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
                        {post.userName}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ color: '#4edea3', background: 'rgba(78,222,163,0.1)', border: '1px solid rgba(78,222,163,0.2)' }}
                      >
                        {post.userRank}
                      </span>
                    </div>
                    <p className="text-sm text-[#bbcabf] mt-1">
                      completed{' '}
                      <span className="font-medium" style={{ color: branchColor }}>{post.deed}</span>
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ color: branchColor, background: `${branchColor}15` }}
                      >
                        {getBranchLabel(post.branch)}
                      </span>
                      <span
                        className="text-[10px] text-[#4edea3]"
                        style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                      >
                        +{post.xpEarned} XP
                      </span>
                      <span className="text-[10px] text-[#86948a]">{timeAgo(post.timestamp)}</span>
                      <button className="flex items-center gap-1 text-[10px] text-[#86948a] ml-auto hover:text-[#ffb3af] transition-colors">
                        <Heart size={10} fill={post.liked ? '#ffb3af' : 'none'} color={post.liked ? '#ffb3af' : 'currentColor'} />
                        {post.likes}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Sidebar: featured members */}
        <div>
          <h3
            className="text-sm font-semibold text-[#dae2fd] mb-4"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            Featured Seekers
          </h3>
          <div className="space-y-2">
            {leaderboard.slice(0, 8).map((entry, i) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(23,31,51,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <img src={entry.avatar} alt={entry.name} className="w-8 h-8 rounded-full" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#dae2fd] truncate" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
                    {entry.name}
                  </div>
                  <div className="text-[10px] text-[#86948a]" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
                    {entry.xp.toLocaleString()} XP
                  </div>
                </div>
                <span className="text-xs text-[#ffb95f]" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
                  #{entry.rank}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
