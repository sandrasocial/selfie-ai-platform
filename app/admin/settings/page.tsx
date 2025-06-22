'use client'

import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  Save, 
  Database, 
  Mail, 
  Shield, 
  Palette, 
  Globe,
  Bell,
  Key,
  Server
} from 'lucide-react'
import AdminLayout from '@/app/components/admin/AdminLayout'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    site: {
      name: 'SELFIE AI™',
      description: 'Transform your selfies into stunning photography',
      url: 'https://selfieai.com',
      maintainanceMode: false
    },
    email: {
      provider: 'supabase',
      fromName: 'SELFIE AI™',
      fromEmail: 'hello@selfieai.com',
      supportEmail: 'support@selfieai.com'
    },
    api: {
      openaiKey: '*********************',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      stripeKey: '*********************'
    },
    security: {
      twoFactorEnabled: true,
      sessionTimeout: 30,
      passwordMinLength: 8
    },
    ai: {
      sandraPersonality: 'professional',
      responseLength: 'medium',
      creativityLevel: 'balanced'
    }
  })

  const [activeTab, setActiveTab] = useState('general')
  const [hasChanges, setHasChanges] = useState(false)

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'api', name: 'API Keys', icon: Key },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'ai', name: 'AI Settings', icon: Server },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ]

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings)
    setHasChanges(false)
  }

  const updateSetting = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bodoni text-[#171719] mb-2">Platform Settings</h1>
          <p className="text-[#B5B5B3]">Let's get your settings dialed in just right</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Settings Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white border border-[#B5B5B3]/20">
              <nav className="space-y-1 p-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#171719] text-white'
                        : 'text-[#171719] hover:bg-[#171719]/5'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.name}
                  </button>
                ))}
              </nav>
              
              {hasChanges && (
                <div className="p-4 border-t border-[#B5B5B3]/20">
                  <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#171719] text-white hover:bg-[#171719]/90 transition-colors"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            <div className="bg-white border border-[#B5B5B3]/20 p-8">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bodoni text-[#171719] mb-4">General Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#171719] mb-2">Site Name</label>
                    <input
                      type="text"
                      value={settings.site.name}
                      onChange={(e) => updateSetting('site', 'name', e.target.value)}
                      className="w-full p-3 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#171719] mb-2">Site Description</label>
                    <textarea
                      value={settings.site.description}
                      onChange={(e) => updateSetting('site', 'description', e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#171719] mb-2">Site URL</label>
                    <input
                      type="url"
                      value={settings.site.url}
                      onChange={(e) => updateSetting('site', 'url', e.target.value)}
                      className="w-full p-3 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="maintenance"
                      checked={settings.site.maintainanceMode}
                      onChange={(e) => updateSetting('site', 'maintainanceMode', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="maintenance" className="text-sm text-[#171719]">
                      Enable Maintenance Mode
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'email' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bodoni text-[#171719] mb-4">Email Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#171719] mb-2">From Name</label>
                    <input
                      type="text"
                      value={settings.email.fromName}
                      onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                      className="w-full p-3 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#171719] mb-2">From Email</label>
                    <input
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                      className="w-full p-3 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#171719] mb-2">Support Email</label>
                    <input
                      type="email"
                      value={settings.email.supportEmail}
                      onChange={(e) => updateSetting('email', 'supportEmail', e.target.value)}
                      className="w-full p-3 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'api' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bodoni text-[#171719] mb-4">API Configuration</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#171719] mb-2">OpenAI API Key</label>
                    <input
                      type="password"
                      value={settings.api.openaiKey}
                      onChange={(e) => updateSetting('api', 'openaiKey', e.target.value)}
                      className="w-full p-3 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#171719] mb-2">Supabase URL</label>
                    <input
                      type="url"
                      value={settings.api.supabaseUrl}
                      onChange={(e) => updateSetting('api', 'supabaseUrl', e.target.value)}
                      className="w-full p-3 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#171719] mb-2">Stripe API Key</label>
                    <input
                      type="password"
                      value={settings.api.stripeKey}
                      onChange={(e) => updateSetting('api', 'stripeKey', e.target.value)}
                      className="w-full p-3 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bodoni text-[#171719] mb-4">AI Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#171719] mb-2">Sandra's Personality</label>
                    <select
                      value={settings.ai.sandraPersonality}
                      onChange={(e) => updateSetting('ai', 'sandraPersonality', e.target.value)}
                      className="w-full p-3 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="casual">Casual</option>
                      <option value="encouraging">Encouraging</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#171719] mb-2">Response Length</label>
                    <select
                      value={settings.ai.responseLength}
                      onChange={(e) => updateSetting('ai', 'responseLength', e.target.value)}
                      className="w-full p-3 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#171719] mb-2">Creativity Level</label>
                    <select
                      value={settings.ai.creativityLevel}
                      onChange={(e) => updateSetting('ai', 'creativityLevel', e.target.value)}
                      className="w-full p-3 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
                    >
                      <option value="conservative">Conservative</option>
                      <option value="balanced">Balanced</option>
                      <option value="creative">Creative</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bodoni text-[#171719] mb-4">Security Settings</h2>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="twoFactor"
                      checked={settings.security.twoFactorEnabled}
                      onChange={(e) => updateSetting('security', 'twoFactorEnabled', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="twoFactor" className="text-sm text-[#171719]">
                      Enable Two-Factor Authentication
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#171719] mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full p-3 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#171719] mb-2">Minimum Password Length</label>
                    <input
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                      className="w-full p-3 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bodoni text-[#171719] mb-4">Notification Settings</h2>
                  <p className="text-[#B5B5B3] mb-6">Configure when and how you receive notifications</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-[#B5B5B3]/20">
                      <div>
                        <h3 className="font-medium text-[#171719]">New User Signups</h3>
                        <p className="text-sm text-[#B5B5B3]">Get notified when new users join</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-[#B5B5B3]/20">
                      <div>
                        <h3 className="font-medium text-[#171719]">Course Completions</h3>
                        <p className="text-sm text-[#B5B5B3]">When users complete courses</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-[#B5B5B3]/20">
                      <div>
                        <h3 className="font-medium text-[#171719]">Payment Events</h3>
                        <p className="text-sm text-[#B5B5B3]">Purchases and subscription changes</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
