import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { readdir, stat } from 'fs/promises'
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

    const { directory = '.', maxDepth = 3, includeHidden = false } = await request.json()

    // Security: Only allow scanning specific directories
    const allowedDirs = [
      '.',
      'app',
      'components',
      'lib',
      'hooks',
      'public',
      'styles',
      'utils',
      'config',
      'data',
    ]

    if (!allowedDirs.includes(directory)) {
      return NextResponse.json({ error: 'Access denied to this directory' }, { status: 403 })
    }

    async function scanDirectory(dirPath: string, currentDepth: number = 0): Promise<any> {
      if (currentDepth > maxDepth) {
        return null
      }

      try {
        const fullPath = join(process.cwd(), dirPath)
        const items = await readdir(fullPath)
        const result: any = {
          name: dirPath === '.' ? 'root' : dirPath.split('/').pop(),
          path: dirPath,
          type: 'directory',
          children: [],
        }

        for (const item of items) {
          // Skip hidden files unless specifically requested
          if (!includeHidden && item.startsWith('.')) {
            continue
          }

          // Skip node_modules and other large directories
          if (['node_modules', '.git', '.next', 'dist', 'build'].includes(item)) {
            continue
          }

          const itemPath = join(dirPath, item)
          const fullItemPath = join(process.cwd(), itemPath)

          try {
            const itemStat = await stat(fullItemPath)

            if (itemStat.isDirectory()) {
              const subDir = await scanDirectory(itemPath, currentDepth + 1)
              if (subDir) {
                result.children.push(subDir)
              }
            } else {
              result.children.push({
                name: item,
                path: itemPath,
                type: 'file',
                size: itemStat.size,
                modified: itemStat.mtime,
              })
            }
          } catch (itemError) {
            // Skip files that can't be accessed
            continue
          }
        }

        return result
      } catch (error) {
        return null
      }
    }

    const projectStructure = await scanDirectory(directory)

    // Log the scan for audit
    await supabase.from('admin_agent_logs').insert({
      user_id: user.id,
      agent_type: 'project_scanner',
      message: `Scanned project directory: ${directory}`,
      response: `Successfully scanned project structure`,
      context: {
        directory,
        maxDepth,
        includeHidden,
        timestamp: new Date().toISOString(),
      },
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      data: projectStructure,
      scannedAt: new Date().toISOString(),
      parameters: {
        directory,
        maxDepth,
        includeHidden,
      },
    })
  } catch (error) {
    console.error('Project scan error:', error)
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

    // Return information about the project scanner
    return NextResponse.json({
      success: true,
      info: {
        description: 'Admin project structure scanner',
        allowedDirectories: [
          '.',
          'app',
          'components',
          'lib',
          'hooks',
          'public',
          'styles',
          'utils',
          'config',
          'data',
        ],
        excludedDirectories: ['node_modules', '.git', '.next', 'dist', 'build'],
        usage: 'POST with { directory?: string, maxDepth?: number, includeHidden?: boolean }',
      },
    })
  } catch (error) {
    console.error('Project scanner info error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
