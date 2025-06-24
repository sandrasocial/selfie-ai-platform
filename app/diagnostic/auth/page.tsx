'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AuthDiagnosticPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('testpassword123')
  const [testing, setTesting] = useState(false)

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const clearLogs = () => {
    setLogs([])
  }

  const testDatabaseConnection = async () => {
    addLog('🔍 Testing database connection...')

    try {
      const supabase = createClient()

      // Test basic connection
      const { data, error } = await supabase.from('user_profiles').select('count').limit(1)

      if (error) {
        addLog(`❌ Database connection failed: ${error.message}`)
        return false
      }

      addLog('✅ Database connection successful')
      return true
    } catch (error) {
      addLog(`❌ Database connection error: ${(error as Error).message}`)
      return false
    }
  }

  const testSignUp = async () => {
    if (!email || !password) {
      addLog('❌ Please enter email and password')
      return
    }

    addLog(`📝 Testing signup for: ${email}`)

    try {
      const supabase = createClient()

      // Generate unique email for testing
      const testEmail = `test${Date.now()}@example.com`

      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password,
        options: {
          data: {
            full_name: 'Test User',
          },
        },
      })

      if (error) {
        addLog(`❌ Signup failed: ${error.message}`)
        return
      }

      addLog(`✅ Signup successful for: ${testEmail}`)
      addLog(`👤 User ID: ${data.user?.id}`)

      // Wait a moment then check if profile was created
      setTimeout(async () => {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user?.id)
          .single()

        if (profileError) {
          addLog(`❌ Profile creation failed: ${profileError.message}`)
        } else {
          addLog(`✅ Profile created successfully: ${profile.email}`)
        }
      }, 2000)
    } catch (error) {
      addLog(`❌ Signup error: ${(error as Error).message}`)
    }
  }

  const testSignIn = async () => {
    if (!email || !password) {
      addLog('❌ Please enter email and password')
      return
    }

    addLog(`🔐 Testing signin for: ${email}`)

    try {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        addLog(`❌ Signin failed: ${error.message}`)
        return
      }

      addLog(`✅ Signin successful`)
      addLog(`👤 User: ${data.user?.email}`)
      addLog(`🔑 Session: ${data.session ? 'Active' : 'None'}`)

      // Test profile loading
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', data.user?.id)
        .single()

      if (profileError) {
        addLog(`❌ Profile loading failed: ${profileError.message}`)
      } else {
        addLog(`✅ Profile loaded: ${profile.full_name || 'No name'} (${profile.tier})`)
      }
    } catch (error) {
      addLog(`❌ Signin error: ${(error as Error).message}`)
    }
  }

  const runFullDiagnostic = async () => {
    setTesting(true)
    clearLogs()

    addLog('🚀 Starting full authentication diagnostic...')

    // Test 1: Database connection
    const dbWorking = await testDatabaseConnection()

    if (!dbWorking) {
      addLog('🚨 Database connection failed - cannot continue')
      setTesting(false)
      return
    }

    // Test 2: Sign up flow
    await testSignUp()

    // Wait a moment
    await new Promise((resolve) => setTimeout(resolve, 3000))

    addLog('🎉 Diagnostic complete!')
    addLog('')
    addLog('📋 NEXT STEPS:')
    addLog('1. If you see errors above, run the SQL fix in your Supabase dashboard')
    addLog('2. Make sure email confirmations are disabled')
    addLog('3. Clear browser cache and try the real signup/login pages')

    setTesting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg bg-white p-8 shadow">
          <h1 className="mb-8 text-3xl font-bold">🔧 Auth System Diagnostic</h1>

          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-xl font-semibold">Test Credentials</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border p-3"
                    placeholder="test@example.com"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border p-3"
                    placeholder="testpassword123"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">Quick Tests</h2>
              <div className="space-y-4">
                <button
                  onClick={testDatabaseConnection}
                  disabled={testing}
                  className="w-full rounded-lg bg-blue-500 p-3 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  Test Database Connection
                </button>
                <button
                  onClick={testSignUp}
                  disabled={testing}
                  className="w-full rounded-lg bg-green-500 p-3 text-white hover:bg-green-600 disabled:opacity-50"
                >
                  Test Sign Up
                </button>
                <button
                  onClick={testSignIn}
                  disabled={testing}
                  className="w-full rounded-lg bg-purple-500 p-3 text-white hover:bg-purple-600 disabled:opacity-50"
                >
                  Test Sign In
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <button
              onClick={runFullDiagnostic}
              disabled={testing}
              className="w-full rounded-lg bg-red-500 p-4 text-lg font-semibold text-white hover:bg-red-600 disabled:opacity-50"
            >
              {testing ? '🔄 Running Diagnostic...' : '🚀 Run Full Diagnostic'}
            </button>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Diagnostic Logs</h2>
              <button
                onClick={clearLogs}
                className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              >
                Clear Logs
              </button>
            </div>
            <div className="h-96 overflow-y-auto rounded-lg bg-black p-4 font-mono text-sm text-green-400">
              {logs.length === 0 ? (
                <div className="text-gray-500">Click "Run Full Diagnostic" to start testing...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
