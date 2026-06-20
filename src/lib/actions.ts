'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// ============================================================
// AUTH ACTIONS
// ============================================================

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  })

  if (error) return { error: error.message }
  return { success: true, message: 'Check your email to confirm your account.' }
}

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
  })

  if (error) return { error: error.message }
  return { success: true, message: 'Check your email for a password reset link.' }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }

  redirect('/dashboard')
}

// ============================================================
// DEED ACTIONS
// ============================================================

export async function completeDeed(deedId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc('complete_deed', {
    p_user_id: user.id,
    p_deed_id: deedId,
  })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/quests')
  return { success: true, data }
}

// ============================================================
// CHALLENGE ACTIONS
// ============================================================

export async function joinChallenge(challengeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc('join_challenge', {
    p_user_id: user.id,
    p_challenge_id: challengeId,
  })

  if (error) return { error: error.message }

  revalidatePath('/challenges')
  return { success: true, data }
}

// ============================================================
// PROFILE ACTIONS
// ============================================================

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('profiles')
    .update({
      name: formData.get('name') as string,
      bio: formData.get('bio') as string,
      location: formData.get('location') as string,
    })
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/profile')
  revalidatePath('/settings')
  return { success: true }
}
