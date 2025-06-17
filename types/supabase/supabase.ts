export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          stripe_subscription_id: string | null
          stripe_price_id: string | null
          subscription_status: string
          updated_at: string
        }
        Insert: {
          id: string
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          subscription_status?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          subscription_status?: string
          updated_at?: string
        }
      }
    }
  }
}