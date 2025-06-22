import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/utils/supabase/route-handler';

export const dynamic = 'force-dynamic';

async function logActivity(supabase: any, message: string) {
    // A simple logger to record critical actions
    await supabase.from('agent_activity_log').insert({
        agent_name: 'System',
        activity: message,
    });
}

export async function POST() {
    console.log("EMERGENCY STOP TRIGGERED");
    const supabase = createRouteHandlerClient();

    try {
        const statusesToCancel = ['pending', 'in_progress', 'needs_next_agent'];

        // Note: Supabase `update` does not return the updated rows by default.
        // We select 'id' to get a count, but we must enable `returning: 'representation'`
        // or `returning: 'minimal'` if we want the actual data. For a count, this is sufficient.
        const { error, count } = await supabase
            .from('admin_tasks')
            .update({ 
                status: 'cancelled'
             })
            .in('status', statusesToCancel);

        if (error) {
            console.error("Error during emergency stop:", error);
            await logActivity(supabase, `Emergency stop failed: ${error.message}`);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        const cancelledCount = count || 0;
        console.log(`Successfully cancelled ${cancelledCount} tasks.`);
        await logActivity(supabase, `Emergency stop successful. Cancelled ${cancelledCount} tasks.`);

        return NextResponse.json({
            success: true,
            message: 'All active agent tasks have been cancelled.',
            cancelled_count: cancelledCount,
        });

    } catch (error: any) {
        console.error("Fatal error in emergency stop:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
} 