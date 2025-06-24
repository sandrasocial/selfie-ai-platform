import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { readFile } from 'fs/promises'
import { join } from 'path'

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

    const { filePath, encoding = 'utf8' } = await request.json()

    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 })
    }

    // Security: Only allow reading from specific directories
    const allowedPaths = [
      'app/',
      'components/',
      'lib/',
      'hooks/',
      'public/',
      'styles/',
      'utils/',
      'config/',
      'data/',
    ]

    const isAllowed = allowedPaths.some(
      (allowed) => filePath.startsWith(allowed) || filePath.startsWith(`./${allowed}`)
    )

    if (!isAllowed) {
      return NextResponse.json({ error: 'Access denied to this file path' }, { status: 403 })
    }

    try {
      // Read the file from the project root
      const fullPath = join(process.cwd(), filePath)
      const content = await readFile(fullPath, encoding)

      // Log the file access for audit
      await supabase.from('admin_agent_logs').insert({
        user_id: user.id,
        agent_type: 'file_reader',
        message: `Read file: ${filePath}`,
        response: `Successfully read ${content.length} characters`,
        context: {
          filePath,
          encoding,
          size: content.length,
          timestamp: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
      })

      return NextResponse.json({
        success: true,
        filePath,
        content,
        size: content.length,
        encoding,
      })
    } catch (fileError: any) {
      console.error('File read error:', fileError)

      // Log the failed attempt
      await supabase.from('admin_agent_logs').insert({
        user_id: user.id,
        agent_type: 'file_reader',
        message: `Failed to read file: ${filePath}`,
        response: `Error: ${fileError.message}`,
        context: {
          filePath,
          error: fileError.message,
          timestamp: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
      })

      return NextResponse.json(
        { error: `Failed to read file: ${fileError.message}` },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Read file route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

    // Return information about the file reading capabilities
    return NextResponse.json({
      success: true,
      info: {
        description: 'Admin file reading tool',
        allowedPaths: [
          'app/',
          'components/',
          'lib/',
          'hooks/',
          'public/',
          'styles/',
          'utils/',
          'config/',
          'data/',
        ],
        supportedEncodings: ['utf8', 'ascii', 'base64', 'binary'],
        usage: 'POST with { filePath: string, encoding?: string }',
      },
    })
  } catch (error) {
    console.error('File reader info error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
