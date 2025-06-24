import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, marketingConsent } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
          marketing_consent: marketingConsent || false,
        },
      },
    })

    if (error) {
      console.error('Signup error:', error.message)

      // Handle specific error cases
      if (error.message.includes('already registered')) {
        return NextResponse.json({ error: 'User already registered' }, { status: 422 })
      }

      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    console.log('User created successfully:', data.user.email)

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    })
  } catch (error) {
    console.error('Signup API error:', error)
    return NextResponse.json({ error: 'Database error saving new user' }, { status: 500 })
  }
}
