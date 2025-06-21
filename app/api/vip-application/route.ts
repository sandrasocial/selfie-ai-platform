import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'instagram',
      'currentRevenue', 'revenueGoal', 'biggestChallenge',
      'previousInvestment', 'whyNow', 'commitment', 'timeline'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Get the current user (optional - applications can be submitted without auth)
    const { data: { user } } = await supabase.auth.getUser();

    // Insert application into database
    const { data, error: dbError } = await supabase
      .from('vip_applications')
      .insert({
        user_id: user?.id || null,
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        instagram: body.instagram,
        current_revenue: body.currentRevenue,
        revenue_goal: body.revenueGoal,
        biggest_challenge: body.biggestChallenge,
        previous_investment: body.previousInvestment,
        why_now: body.whyNow,
        commitment: body.commitment,
        timeline: body.timeline,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      );
    }

    // Send notification email to Sandra
    await sendNotificationEmail(data);

    // Send confirmation email to applicant
    await sendConfirmationEmail(data);

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: data.id
    });

  } catch (error) {
    console.error('VIP application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get all applications (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin (you'll need to implement this check based on your user roles)
    // For now, we'll just check if the user email matches Sandra's
    const ADMIN_EMAILS = ['sandra@selfieai.com']; // Replace with actual admin email
    
    if (!ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get filter parameters from query
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('vip_applications')
      .select('*', { count: 'exact' })
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      applications: data,
      total: count,
      limit,
      offset
    });

  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update application status (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    
    // Check authentication and admin status
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const ADMIN_EMAILS = ['sandra@selfieai.com'];
    
    if (!ADMIN_EMAILS.includes(user.email || '')) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { applicationId, status, reviewerNotes } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('vip_applications')
      .update({
        status,
        reviewer_notes: reviewerNotes,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update application' },
        { status: 500 }
      );
    }

    // Send status update email to applicant
    if (status === 'accepted' || status === 'rejected') {
      await sendStatusUpdateEmail(data);
    }

    return NextResponse.json({
      success: true,
      application: data
    });

  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Email sending functions (implement with your email service)
async function sendNotificationEmail(application: any) {
  // TODO: Implement with Resend or your email service
  // This should notify Sandra about the new application
  console.log('Sending notification email for application:', application.id);
}

async function sendConfirmationEmail(application: any) {
  // TODO: Implement with Resend or your email service
  // This should send a confirmation to the applicant
  console.log('Sending confirmation email to:', application.email);
}

async function sendStatusUpdateEmail(application: any) {
  // TODO: Implement with Resend or your email service
  // This should notify the applicant about their application status
  console.log('Sending status update email to:', application.email);
} 