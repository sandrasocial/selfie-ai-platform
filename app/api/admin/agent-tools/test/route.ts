import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is authenticated and has admin access
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin access
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Run basic system tests
    const tests = []

    // Test 1: Database connection
    try {
      const { data, error } = await supabase.from('user_profiles').select('id').limit(1)
      tests.push({
        name: 'Database Connection',
        status: error ? 'failed' : 'passed',
        message: error ? error.message : 'Successfully connected to database',
        timestamp: new Date().toISOString(),
      })
    } catch (dbError: any) {
      tests.push({
        name: 'Database Connection',
        status: 'failed',
        message: dbError.message,
        timestamp: new Date().toISOString(),
      })
    }

    // Test 2: Environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
    ]

    const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])
    tests.push({
      name: 'Environment Variables',
      status: missingEnvVars.length === 0 ? 'passed' : 'failed',
      message:
        missingEnvVars.length === 0
          ? 'All required environment variables are set'
          : `Missing environment variables: ${missingEnvVars.join(', ')}`,
      timestamp: new Date().toISOString(),
    })

    // Test 3: API Response time
    const startTime = Date.now()
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Content-Type': 'application/json',
        },
      })
      const responseTime = Date.now() - startTime
      tests.push({
        name: 'API Response Time',
        status: responseTime < 1000 ? 'passed' : 'warning',
        message: `Response time: ${responseTime}ms`,
        timestamp: new Date().toISOString(),
      })
    } catch (apiError: any) {
      tests.push({
        name: 'API Response Time',
        status: 'failed',
        message: `API request failed: ${apiError.message}`,
        timestamp: new Date().toISOString(),
      })
    }

    // Test 4: Memory usage
    const memoryUsage = process.memoryUsage()
    tests.push({
      name: 'Memory Usage',
      status: memoryUsage.heapUsed < 100 * 1024 * 1024 ? 'passed' : 'warning', // 100MB threshold
      message: `Heap used: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      timestamp: new Date().toISOString(),
    })

    // Log the test run
    await supabase.from('admin_agent_logs').insert({
      user_id: user.id,
      agent_type: 'system_test',
      message: 'System health check completed',
      response: `${tests.filter((t) => t.status === 'passed').length}/${tests.length} tests passed`,
      context: {
        tests,
        timestamp: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    })

    const overallStatus = tests.every((t) => t.status === 'passed')
      ? 'healthy'
      : tests.some((t) => t.status === 'failed')
        ? 'unhealthy'
        : 'warning'

    return NextResponse.json({
      success: true,
      status: overallStatus,
      summary: {
        total: tests.length,
        passed: tests.filter((t) => t.status === 'passed').length,
        failed: tests.filter((t) => t.status === 'failed').length,
        warnings: tests.filter((t) => t.status === 'warning').length,
      },
      tests,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('System test error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user is authenticated and has admin access
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin access
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { testType, parameters } = await request.json()

    if (!testType) {
      return NextResponse.json({ error: 'Test type is required' }, { status: 400 })
    }

    let testResult: any = {}

    switch (testType) {
      case 'database_query':
        try {
          const { data, error } = await supabase
            .from(parameters?.table || 'user_profiles')
            .select('*')
            .limit(parameters?.limit || 5)

          testResult = {
            status: error ? 'failed' : 'passed',
            message: error ? error.message : `Retrieved ${data?.length || 0} records`,
            data: error ? null : data,
          }
        } catch (err: any) {
          testResult = {
            status: 'failed',
            message: err.message,
            data: null,
          }
        }
        break

      case 'email_test':
        testResult = {
          status: 'passed',
          message: 'Email test simulation completed',
          data: { simulated: true, parameters },
        }
        break

      case 'api_endpoint':
        try {
          const response = await fetch(parameters?.url || process.env.NEXT_PUBLIC_SUPABASE_URL!, {
            method: parameters?.method || 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(parameters?.headers || {}),
            },
          })

          testResult = {
            status: response.ok ? 'passed' : 'failed',
            message: `HTTP ${response.status} ${response.statusText}`,
            data: { status: response.status, statusText: response.statusText },
          }
        } catch (err: any) {
          testResult = {
            status: 'failed',
            message: err.message,
            data: null,
          }
        }
        break

      default:
        return NextResponse.json({ error: 'Unknown test type' }, { status: 400 })
    }

    // Log the custom test
    await supabase.from('admin_agent_logs').insert({
      user_id: user.id,
      agent_type: 'custom_test',
      message: `Custom test: ${testType}`,
      response: testResult.message,
      context: {
        testType,
        parameters,
        result: testResult,
        timestamp: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      testType,
      result: testResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Custom test error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
