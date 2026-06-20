export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          avatar_url: string | null
          bio: string | null
          location: string | null
          xp: number
          level: number
          coins: number
          energy: number
          max_energy: number
          rank: string
          streak: number
          longest_streak: number
          last_active: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      branch_progress: {
        Row: {
          id: string
          user_id: string
          branch: string
          xp: number
          level: number
          completed_deeds: number
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['branch_progress']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['branch_progress']['Insert']>
      }
      deeds: {
        Row: {
          id: string
          title: string
          description: string
          branch: string
          xp_reward: number
          coin_reward: number
          energy_cost: number
          difficulty: string
          estimated_minutes: number
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['deeds']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['deeds']['Insert']>
      }
      deed_completions: {
        Row: {
          id: string
          user_id: string
          deed_id: string
          xp_earned: number
          coins_earned: number
          energy_spent: number
          streak_count: number
          completed_at: string
        }
        Insert: Omit<Database['public']['Tables']['deed_completions']['Row'], 'id' | 'completed_at'>
        Update: never
      }
      challenges: {
        Row: {
          id: string
          title: string
          description: string
          branch: string
          goal: number
          xp_reward: number
          coin_reward: number
          end_date: string
          rarity: string
          participant_count: number
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['challenges']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['challenges']['Insert']>
      }
      challenge_participants: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          current_progress: number
          completed: boolean
          joined_at: string
          completed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['challenge_participants']['Row'], 'id' | 'joined_at'>
        Update: Partial<Database['public']['Tables']['challenge_participants']['Insert']>
      }
      achievements: {
        Row: {
          id: string
          title: string
          description: string
          icon: string
          rarity: string
          branch: string | null
          xp_reward: number
          criteria_type: string
          criteria_value: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['achievements']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['achievements']['Insert']>
      }
      achievement_unlocks: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: Omit<Database['public']['Tables']['achievement_unlocks']['Row'], 'id' | 'earned_at'>
        Update: never
      }
      xp_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          source_type: string
          source_id: string | null
          branch: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['xp_transactions']['Row'], 'id' | 'created_at'>
        Update: never
      }
      feed_events: {
        Row: {
          id: string
          user_id: string
          event_type: string
          deed_title: string | null
          branch: string | null
          xp_earned: number | null
          achievement_title: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['feed_events']['Row'], 'id' | 'created_at'>
        Update: never
      }
    }
    Views: {
      leaderboard: {
        Row: {
          rank: number
          user_id: string
          name: string
          avatar_url: string | null
          xp: number
          level: number
          streak: number
          user_rank: string
        }
      }
    }
    Functions: {
      complete_deed: {
        Args: { p_user_id: string; p_deed_id: string }
        Returns: Json
      }
      join_challenge: {
        Args: { p_user_id: string; p_challenge_id: string }
        Returns: Json
      }
      get_dashboard_stats: {
        Args: { p_user_id: string }
        Returns: Json
      }
    }
  }
}
