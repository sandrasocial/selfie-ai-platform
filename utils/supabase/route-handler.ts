import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase/supabase'

// Standard client for use in Route Handlers
export const createRouteHandlerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // If environment variables are not available, return a mock client
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase environment variables not found. Using mock client for route handler.')
    return {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      }),
      auth: {
        admin: {
          createUser: () => Promise.resolve({ data: { user: null }, error: null }),
          deleteUser: () => Promise.resolve({ data: {}, error: null }),
          listUsers: () => Promise.resolve({ data: { users: [] }, error: null }),
        },
      },
    } as any
  }

  return createClient<Database>(
    supabaseUrl,
    supabaseServiceKey
  )
} 