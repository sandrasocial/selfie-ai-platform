import { supabase, User, UserProfile, GeneratedContent } from '@/lib/supabaseClient';

// Interfaces for existing tables
interface WorkbookAnswer {
  id?: string;
  user_id: string;
  module_id: string;
  question_id: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
}

interface PhotoLibraryItem {
  id?: string;
  user_id: string;
  uploadcare_uuid: string;
  file_url: string;
  file_name?: string;
  file_size?: number;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

interface SubscriptionStatus {
  id?: string;
  user_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan: 'FREE' | 'PRO' | 'VIP';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start?: string;
  current_period_end?: string;
  created_at?: string;
  updated_at?: string;
}

export class SupabaseService {
  // User Management
  static async createUser(userData: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Profile Management
  static async createOrUpdateProfile(userId: string, profileData: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({ user_id: userId, ...profileData })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Content Management
  static async saveGeneratedContent(content: Partial<GeneratedContent>) {
    const { data, error } = await supabase
      .from('generated_content')
      .insert(content)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserContent(userId: string, type?: string) {
    let query = supabase
      .from('generated_content')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Calendar Management
  static async scheduleContent(userId: string, contentId: string, scheduledDate: string, platform = 'instagram') {
    const { data, error } = await supabase
      .from('content_calendar')
      .insert({
        user_id: userId,
        content_id: contentId,
        scheduled_date: scheduledDate,
        platform,
        status: 'scheduled'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserCalendar(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('content_calendar')
      .select(`
        *,
        generated_content (*)
      `)
      .eq('user_id', userId)
      .order('scheduled_date', { ascending: true });
    
    if (startDate) {
      query = query.gte('scheduled_date', startDate);
    }
    
    if (endDate) {
      query = query.lte('scheduled_date', endDate);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Usage Tracking
  static async trackUsage(userId: string, featureType: string) {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('usage_tracking')
      .upsert({
        user_id: userId,
        feature_type: featureType,
        usage_date: today,
        usage_count: 1
      }, {
        onConflict: 'user_id,feature_type,usage_date'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserUsage(userId: string, featureType?: string, date?: string) {
    let query = supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', userId);
    
    if (featureType) {
      query = query.eq('feature_type', featureType);
    }
    
    if (date) {
      query = query.eq('usage_date', date);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Workbook Answers Management (AI Modules)
  static async saveWorkbookAnswer(answer: Partial<WorkbookAnswer>) {
    const { data, error } = await supabase
      .from('workbook_answers')
      .upsert(answer, {
        onConflict: 'user_id,module_id,question_id'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getWorkbookAnswers(userId: string, moduleId?: string) {
    let query = supabase
      .from('workbook_answers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (moduleId) {
      query = query.eq('module_id', moduleId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getModuleProgress(userId: string, moduleId: string) {
    const { data, error } = await supabase
      .from('workbook_answers')
      .select('question_id')
      .eq('user_id', userId)
      .eq('module_id', moduleId);
    
    if (error) throw error;
    return data?.length || 0;
  }

  // Photo Library Management (Uploadcare Integration)
  static async savePhotoToLibrary(photoData: Partial<PhotoLibraryItem>) {
    const { data, error } = await supabase
      .from('photo_library')
      .insert({
        user_id: photoData.user_id,
        uploadcare_uuid: photoData.uploadcare_uuid,
        file_url: photoData.file_url,
        file_name: photoData.file_name,
        file_size: photoData.file_size,
        tags: photoData.tags || []
      })
      .select()
      .single();
    
    if (error) {
      console.error('Save photo error:', error);
      throw error;
    }
    return data;
  }

  // AI Visual Strategy methods
  static async saveAIVisualStrategy(strategyData: {
    id: string;
    user_id: string;
    type: string;
    brand_profile_snapshot?: any;
    content_generated: any;
  }) {
    const { data, error } = await supabase
      .from('ai_visual_strategies')
      .insert(strategyData)
      .select()
      .single();
    
    if (error) {
      console.error('Save AI strategy error:', error);
      throw error;
    }
    return data;
  }

  static async getUserAIStrategies(userId: string) {
    const { data, error } = await supabase
      .from('ai_visual_strategies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Get AI strategies error:', error);
      throw error;
    }
    return data || [];
  }

  static async getUserPhotos(userId: string, tags?: string[]) {
    let query = supabase
      .from('photo_library')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (tags && tags.length > 0) {
      query = query.contains('tags', tags);
    }
    
    const { data, error } = await query;
    if (error) {
      console.error('Photo library query error:', error);
      throw error;
    }
    return data || [];
  }

  static async deletePhoto(userId: string, photoId: string) {
    const { error } = await supabase
      .from('photo_library')
      .delete()
      .eq('id', photoId)
      .eq('user_id', userId);
    
    if (error) throw error;
    return true;
  }

  static async updatePhotoTags(userId: string, photoId: string, tags: string[]) {
    const { data, error } = await supabase
      .from('photo_library')
      .update({ tags })
      .eq('id', photoId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Subscription Status Management (Stripe Integration)
  static async getSubscriptionStatus(userId: string) {
    const { data, error } = await supabase
      .from('subscription_status')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateSubscriptionStatus(userId: string, subscriptionData: Partial<SubscriptionStatus>) {
    const { data, error } = await supabase
      .from('subscription_status')
      .upsert({ user_id: userId, ...subscriptionData })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createSubscriptionFromStripe(stripeData: {
    userId: string;
    customerId: string;
    subscriptionId: string;
    plan: 'PRO' | 'VIP';
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
  }) {
    const subscriptionData: Partial<SubscriptionStatus> = {
      user_id: stripeData.userId,
      stripe_customer_id: stripeData.customerId,
      stripe_subscription_id: stripeData.subscriptionId,
      plan: stripeData.plan,
      status: stripeData.status as any,
      current_period_start: stripeData.currentPeriodStart,
      current_period_end: stripeData.currentPeriodEnd
    };

    return await this.updateSubscriptionStatus(stripeData.userId, subscriptionData);
  }

  static async cancelSubscription(userId: string) {
    const { data, error } = await supabase
      .from('subscription_status')
      .update({ 
        status: 'canceled',
        plan: 'FREE'
      })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Hybrid Auth Support - Check if user exists in both systems
  static async getUserFromBothSystems(userId: string) {
    const [supabaseUser, subscriptionStatus] = await Promise.all([
      this.getUser(userId),
      this.getSubscriptionStatus(userId)
    ]);

    return {
      user: supabaseUser,
      subscription: subscriptionStatus
    };
  }

  // Sync existing user data to Supabase
  static async syncUserToSupabase(existingUser: any) {
    try {
      const supabaseUser = await this.createUser({
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.firstName || existingUser.name || '',
        plan: existingUser.plan || 'FREE'
      });

      // If user has profile data, sync that too
      if (existingUser.businessName || existingUser.industry) {
        await this.createOrUpdateProfile(existingUser.id, {
          business_name: existingUser.businessName,
          industry: existingUser.industry,
          target_audience: existingUser.targetAudience,
          brand_voice: existingUser.brandVoice
        });
      }

      return supabaseUser;
    } catch (error) {
      console.error('Error syncing user to Supabase:', error);
      throw error;
    }
  }
}