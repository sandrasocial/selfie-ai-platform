import { createRouteHandlerClient } from '@/utils/supabase/route-handler'
import { NextRequest, NextResponse } from 'next/server'

// Force rebuild
export async function PATCH(
  req: NextRequest
) {
  try {
    const supabase = createRouteHandlerClient()
    const updateData = await req.json()
    const id = req.nextUrl.searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }
    
    const { data, error } = await supabase
      .from('admin_tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 