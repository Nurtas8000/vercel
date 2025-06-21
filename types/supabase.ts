export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: "renter" | "owner" | "admin"
          avatar_url: string | null
          verified: boolean
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: "renter" | "owner" | "admin"
          avatar_url?: string | null
          verified?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: "renter" | "owner" | "admin"
          avatar_url?: string | null
          verified?: boolean
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cars: {
        Row: {
          id: string
          owner_id: string
          make: string
          model: string
          year: number
          price_per_day: number
          description: string | null
          image_url: string | null
          city: string
          status: "available" | "rented" | "maintenance"
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          make: string
          model: string
          year: number
          price_per_day: number
          description?: string | null
          image_url?: string | null
          city: string
          status?: "available" | "rented" | "maintenance"
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          make?: string
          model?: string
          year?: number
          price_per_day?: number
          description?: string | null
          image_url?: string | null
          city?: string
          status?: "available" | "rented" | "maintenance"
          created_at?: string
        }
      }
      // Другие таблицы...
    }
  }
}
