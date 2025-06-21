export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          phone: string | null
          full_name: string
          role: "renter" | "owner" | "admin"
          documents: any
          verified: boolean
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          phone?: string | null
          full_name: string
          role?: "renter" | "owner" | "admin"
          documents?: any
          verified?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string | null
          full_name?: string
          role?: "renter" | "owner" | "admin"
          documents?: any
          verified?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cars: {
        Row: {
          id: string
          owner_id: string
          brand: string
          model: string
          year: number
          color: string | null
          vin: string | null
          license_plate: string | null
          photos: any
          rental_price: number
          rental_period_months: number
          payment_frequency: "daily" | "six_times_week" | "weekly" | "monthly"
          available: boolean
          description: string | null
          features: any
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          brand: string
          model: string
          year: number
          color?: string | null
          vin?: string | null
          license_plate?: string | null
          photos?: any
          rental_price: number
          rental_period_months: number
          payment_frequency?: "daily" | "six_times_week" | "weekly" | "monthly"
          available?: boolean
          description?: string | null
          features?: any
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          brand?: string
          model?: string
          year?: number
          color?: string | null
          vin?: string | null
          license_plate?: string | null
          photos?: any
          rental_price?: number
          rental_period_months?: number
          payment_frequency?: "daily" | "six_times_week" | "weekly" | "monthly"
          available?: boolean
          description?: string | null
          features?: any
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          car_id: string
          renter_id: string
          start_date: string
          end_date: string
          total_amount: number
          status: "pending" | "confirmed" | "active" | "completed" | "cancelled"
          payment_schedule: any
          contract_signed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          car_id: string
          renter_id: string
          start_date: string
          end_date: string
          total_amount: number
          status?: "pending" | "confirmed" | "active" | "completed" | "cancelled"
          payment_schedule?: any
          contract_signed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          car_id?: string
          renter_id?: string
          start_date?: string
          end_date?: string
          total_amount?: number
          status?: "pending" | "confirmed" | "active" | "completed" | "cancelled"
          payment_schedule?: any
          contract_signed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          amount: number
          due_date: string
          paid_date: string | null
          status: "pending" | "paid" | "overdue" | "failed"
          payment_method: string | null
          receipt_url: string | null
          kaspi_transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          amount: number
          due_date: string
          paid_date?: string | null
          status?: "pending" | "paid" | "overdue" | "failed"
          payment_method?: string | null
          receipt_url?: string | null
          kaspi_transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          amount?: number
          due_date?: string
          paid_date?: string | null
          status?: "pending" | "paid" | "overdue" | "failed"
          payment_method?: string | null
          receipt_url?: string | null
          kaspi_transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
