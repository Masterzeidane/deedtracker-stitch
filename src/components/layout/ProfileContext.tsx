'use client'
import { createContext, useContext } from 'react'

export interface ProfileHeader {
  name: string
  xp: number
  coins: number
  avatar: string | null
}

const DEFAULT_HEADER: ProfileHeader = {
  name: 'Seeker',
  xp: 0,
  coins: 0,
  avatar: null,
}

const ProfileHeaderContext = createContext<ProfileHeader>(DEFAULT_HEADER)

export function ProfileHeaderProvider({
  value,
  children,
}: {
  value: ProfileHeader | null
  children: React.ReactNode
}) {
  return (
    <ProfileHeaderContext.Provider value={value ?? DEFAULT_HEADER}>
      {children}
    </ProfileHeaderContext.Provider>
  )
}

export function useProfileHeader(): ProfileHeader {
  return useContext(ProfileHeaderContext)
}
