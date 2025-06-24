'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function LoginDiagnosticPage() {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('testpassword')
  const [logs, setLogs] = useState<string[]>([])
  const [testing, setTesting] = useState(false)

  const addLog = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testEnvironment = async () => {
    addLog('🔍 Starting environment test...')
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    addLog(`Supabase URL: ${supabaseUrl ? 'SET' : 'MISSING'}`)
    addLog(`Supabase Key: ${supabaseKey ? 'SET' : 'MISSING'}`)
    
    if (supabaseUrl) {
      addLog(`URL starts with: ${supabaseUrl.substring(0, 30)}...`)
    }
    
    // Test Supabase client creation
    try {
      const supabase = createClient()
      addLog('✅ Supabase client created successfully')
      
      // Test basic connection
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        addLog(`❌ Auth session error: ${error.message}`)
      } else {
        addLog('✅ Auth session check successful')
        addLog(`Current session: ${data.session ? 'EXISTS' : 'NONE'}`)
      }
      
    } catch (error) {
      addLog(`❌ Supabase client error: ${(error as Error).message}`)
    }
  }

  const testLogin = async () => {
    if (!email || !password) {
      addLog('❌ Please enter email and password')
      return
    }
    
    setTesting(true)
    addLog(`🔐 Testing login for: ${email}`)
    
    try {
      const supabase = createClient()
      addLog('📡 Attempting Supabase sign in...')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        addLog(`❌ Login error: ${error.message}`)
        addLog(`Error code: ${(error as any).status || 'unknown'}`)
      } else {
        addLog('✅ Login successful!')
        addLog(`User ID: ${data.user?.id}`)
        addLog(`Email: ${data.user?.email}`)
        addLog(`Session expires: ${data.session?.expires_at}`)
        
        // Test profile loading
        try {
          addLog('👤 Testing profile fetch...')
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', data.user?.id)
            .single()
          
          if (profileError) {
            addLog(`⚠️ Profile error: ${profileError.message}`)
            addLog(`Profile error code: ${profileError.code}`)
          } else {
            addLog(`✅ Profile loaded: ${profile ? 'EXISTS' : 'NULL'}`)
            if (profile) {
              addLog(`Profile role: ${profile.role}`)
              addLog(`Profile email: ${profile.email}`)
            }
          }
        } catch (profileErr) {
          addLog(`❌ Profile fetch error: ${(profileErr as Error).message}`)
        }
      }
      
    } catch (error) {
      addLog(`❌ Login catch error: ${(error as Error).message}`)
    } finally {
      setTesting(false)
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="min-h-screen bg-[#F1F1F1] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 mb-6">
          <h1 className="text-3xl font-light text-[#171719] mb-8" style={{ fontFamily: 'Bodoni Moda, serif' }}>
            SSELFIE Login Diagnostic
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Test Controls */}
            <div className="space-y-6">
              <div>
                <button
                  onClick={testEnvironment}
                  className="w-full p-4 bg-[#171719] text-[#F1F1F1] font-light hover:bg-[#2a2a2c] transition-colors duration-300"
                >
                  Test Environment
                </button>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-normal text-[#171719]">Test Login</h3>
                
                <div>
                  <label className="block text-sm font-normal text-[#171719] mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-[#B5B5B3] text-[#171719] focus:outline-none focus:border-[#171719]"
                    placeholder="Enter test email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-normal text-[#171719] mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-[#B5B5B3] text-[#171719] focus:outline-none focus:border-[#171719]"
                    placeholder="Enter test password"
                  />
                </div>
                
                <button
                  onClick={testLogin}
                  disabled={testing}
                  className="w-full p-4 bg-[#171719] text-[#F1F1F1] font-light hover:bg-[#2a2a2c] transition-colors duration-300 disabled:opacity-50"
                >
                  {testing ? 'Testing Login...' : 'Test Login'}
                </button>
              </div>
            </div>
            
            {/* Logs */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-normal text-[#171719]">Diagnostic Logs</h3>
                <button
                  onClick={clearLogs}
                  className="px-4 py-2 text-sm text-[#B5B5B3] hover:text-[#171719] transition-colors duration-300"
                >
                  Clear
                </button>
              </div>
              
              <div className="bg-[#171719] text-[#F1F1F1] p-4 font-mono text-sm h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-[#B5B5B3]">Click "Test Environment" to start diagnostics...</div>
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
        
        {/* Quick Links */}
        <div className="bg-white p-6">
          <h3 className="text-lg font-normal text-[#171719] mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <a 
              href="/auth/login" 
              className="px-6 py-3 border border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-[#F1F1F1] transition-colors duration-300"
            >
              Go to Login Page
            </a>
            <a 
              href="/auth/signup" 
              className="px-6 py-3 border border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-[#F1F1F1] transition-colors duration-300"
            >
              Go to Signup Page
            </a>
            <a 
              href="/admin/login" 
              className="px-6 py-3 border border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-[#F1F1F1] transition-colors duration-300"
            >
              Go to Admin Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
