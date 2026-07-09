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
    // Route through the callback so the recovery code is exchanged and the
    // session is set before the user lands on the update-password form.
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/auth/update-password`,
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

export async function updatePreferences(prefs: Record<string, unknown>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('profiles')
    .update({ preferences: prefs })
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/settings')
  return { success: true }
}

export async function deleteAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Deletes only the caller's own auth.users row (guarded by auth.uid()
  // inside the RPC); cascade removes all user-owned data.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).rpc('delete_account')
  if (error) return { error: error.message }

  // Account (and its session) are gone. Best-effort local cookie purge —
  // scope 'local' makes no server revoke call, so there is nothing to fail.
  try {
    await supabase.auth.signOut({ scope: 'local' })
  } catch {
    // session already invalid — expected; cookies are cleared regardless
  }

  redirect('/')
}

// ============================================================
// COMMUNITY ACTIONS
// ============================================================

export async function toggleLike(feedEventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any
  const { data: existing } = await sb
    .from('post_likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('feed_event_id', feedEventId)
    .maybeSingle()

  if (existing) {
    await sb.from('post_likes').delete().eq('id', existing.id)
  } else {
    await sb.from('post_likes').insert({ user_id: user.id, feed_event_id: feedEventId })
  }

  revalidatePath('/community')
  return { success: true }
}
