export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          date_of_birth: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          date_of_birth?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date_of_birth?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      thoughts: {
        Row: {
          id: string
          user_id: string
          age: number
          thought: string
          archived_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          age: number
          thought: string
          archived_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          age?: number
          thought?: string
          archived_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
