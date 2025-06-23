'use client'

import { useState } from 'react'
import { 
  FileText, 
  Code, 
  Palette, 
  Users, 
  Database, 
  GitBranch,
  Sparkles,
  Target,
  Book,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  MessageSquare
} from 'lucide-react'

export default function ProjectOverview() {
  const [activeSection, setActiveSection] = useState<string>('mission')

  const sections = [
    { id: 'mission', label: 'Project Mission', icon: Target },
    { id: 'agents', label: 'AI Agent Team', icon: Users },
    { id: 'collaboration', label: 'Collaboration Workflow', icon: GitBranch },
    { id: 'structure', label: 'Project Structure', icon: FileText },
    { id: 'database', label: 'Database Schema', icon: Database },
    { id: 'design', label: 'Design System', icon: Palette },
    { id: 'voice', label: 'Voice Guidelines', icon: Sparkles },
    { id: 'stack', label: 'Tech Stack', icon: Code },
    { id: 'deployment', label: 'Deployment', icon: Book }
  ]

  const agents = [
    {
      id: 'DIANA',
      name: 'Director AI (DIANA)',
      role: 'Project Orchestrator',
      responsibilities: [
        'Oversees all project operations',
        'Assigns tasks to other agents',
        'Maintains project vision and quality',
        'Makes architectural decisions',
        'Reviews agent collaboration'
      ],
      cannotDo: [
        'Override Sandra\'s decisions',
        'Deploy to production without approval',
        'Change core brand elements',
        'Access payment systems'
      ]
    },
    // Maya temporarily disabled due to deployment conflicts
    // {
    //   id: 'MAYA',
    //   name: 'Dev AI (MAYA)',
    //   role: 'Technical Implementation',
    //   responsibilities: [
    //     'Builds React components and features',
    //     'Implements API endpoints',
    //     'Manages database operations',
    //     'Writes TypeScript code',
    //     'Handles technical integrations'
    //   ],
    //   cannotDo: [
    //     'Change design without VICTORIA\'s input',
    //     'Modify copy without RACHEL\'s approval',
    //     'Skip testing phase',
    //     'Deploy without QUINN\'s review'
    //   ]
    // },
    {
      id: 'VICTORIA',
      name: 'UX AI (VICTORIA)',
      role: 'Design Excellence',
      responsibilities: [
        'Creates UI/UX designs',
        'Maintains luxury aesthetic',
        'Ensures mobile responsiveness',
        'Designs component layouts',
        'Reviews visual consistency'
      ],
      cannotDo: [
        'Use rounded corners or gradients',
        'Add colors outside the palette',
        'Include emojis in designs',
        'Compromise on whitespace'
      ]
    },
    {
      id: 'RACHEL',
      name: 'Voice AI (RACHEL)',
      role: 'Brand Voice & Copy',
      responsibilities: [
        'Writes all platform copy',
        'Maintains Sandra\'s voice',
        'Creates email templates',
        'Reviews all text content',
        'Ensures consistent messaging'
      ],
      cannotDo: [
        'Use exclamation marks',
        'Write corporate jargon',
        'Use generic empowerment speak',
        'Create copy over 5 words for headlines'
      ]
    },
    {
      id: 'QUINN',
      name: 'QA AI (QUINN)',
      role: 'Quality Assurance',
      responsibilities: [
        'Tests all features thoroughly',
        'Checks mobile responsiveness',
        'Validates user flows',
        'Ensures accessibility',
        'Reviews performance metrics'
      ],
      cannotDo: [
        'Skip testing on mobile',
        'Approve with known bugs',
        'Ignore loading times over 3s',
        'Pass work with console errors'
      ]
    },
    {
      id: 'AVA',
      name: 'Automation AI (AVA)',
      role: 'Workflow Automation',
      responsibilities: [
        'Sets up email sequences',
        'Creates automation flows',
        'Manages integrations',
        'Handles webhook setup',
        'Optimizes workflows'
      ],
      cannotDo: [
        'Send emails without testing',
        'Create infinite loops',
        'Access production keys',
        'Modify payment workflows alone'
      ]
    }
  ]

  const workflowPatterns = [
    {
      name: 'Feature Build',
      workflow: ['VICTORIA', 'RACHEL', 'QUINN'], // Maya temporarily disabled
      description: 'Complete feature development from code to deployment-ready',
      example: 'Building a new AI tool or dashboard component'
    },
    {
      name: 'Design Update',
      workflow: ['VICTORIA', 'RACHEL'],
      description: 'Visual changes that need copy adjustments',
      example: 'Updating a landing page layout'
    },
    {
      name: 'Copy Update',
      workflow: ['RACHEL', 'QUINN'],
      description: 'Text changes that need testing',
      example: 'Rewriting tool descriptions or CTAs'
    },
    {
      name: 'Bug Fix',
      workflow: ['QUINN'], // Maya temporarily disabled - manual fix required
      description: 'Technical fixes that need validation',
      example: 'Fixing the Safari download bug'
    },
    {
      name: 'Full Stack Feature',
      workflow: ['VICTORIA', 'RACHEL', 'AVA', 'QUINN'], // Maya temporarily disabled
      description: 'Complex features touching all systems',
      example: 'Implementing a new pricing tier with automation'
    }
  ]

  const collaborationRules = [
    {
      title: 'When to Pass Work',
      icon: ArrowRight,
      rules: [
        'Your part is complete and tested',
        'All edge cases are handled',
        'Code is commented and clean',
        'You\'ve added helpful notes for the next agent',
        'Any blockers are documented'
      ]
    },
    {
      title: 'Writing Handoff Notes',
      icon: MessageSquare,
      rules: [
        'Summarize what you completed',
        'List any decisions you made',
        'Highlight areas needing attention',
        'Include relevant file paths',
        'Mention any dependencies'
      ]
    },
    {
      title: 'Ready for Preview Means',
      icon: CheckCircle,
      rules: [
        'All agents have completed their parts',
        'Feature is fully functional',
        'Design matches luxury standards',
        'Copy sounds like Sandra',
        'Testing shows no issues',
        'Preview URL is available'
      ]
    },
    {
      title: 'Notify Sandra Only When',
      icon: AlertCircle,
      rules: [
        'Task marked "ready for preview"',
        'Major decision needed',
        'Blocking issue discovered',
        'Scope needs clarification',
        'Timeline at risk'
      ]
    }
  ]

  const projectStructure = `
/app
  /(marketing)      # Public pages (homepage, pricing, etc.)
  /(dashboard)      # User dashboard pages
  /(admin)          # Admin pages (this section)
  /tools           # AI tools (Glow Check, etc.)
  /api             # API routes
    /agents        # Agent communication endpoints
    /tasks         # Task management
    /github        # GitHub integration
    
/components
  /ui              # Base components (buttons, forms)
  /marketing       # Public site components
  /dashboard       # User dashboard components
  /admin          # Admin components
  /tools          # Tool-specific components
  
/lib              # Utilities and services
  /supabase       # Database client
  /github         # GitHub integration
  /agents         # Agent utilities
  
/public           # Static assets
  /images         # Brand images
  /fonts          # Custom fonts
  `.trim()

  const databaseSchema = [
    {
      table: 'users',
      purpose: 'User accounts and profiles',
      key_fields: ['id', 'email', 'full_name', 'avatar_url', 'subscription_status']
    },
    {
      table: 'admin_tasks',
      purpose: 'Agent task management and collaboration',
      key_fields: ['id', 'title', 'status', 'workflow[]', 'agent_notes', 'ready_for_review']
    },
    {
      table: 'agent_activity_log',
      purpose: 'Track all agent actions',
      key_fields: ['id', 'task_id', 'agent_name', 'activity', 'created_at']
    },
    {
      table: 'tools_usage',
      purpose: 'Track AI tool usage',
      key_fields: ['id', 'user_id', 'tool_name', 'usage_data', 'created_at']
    },
    {
      table: 'subscriptions',
      purpose: 'User subscription management',
      key_fields: ['id', 'user_id', 'plan', 'status', 'stripe_subscription_id']
    }
  ]

  return (
    <div className="min-h-screen bg-soft-white">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-warm-gray/20 min-h-screen p-6 fixed">
          <h2 className="text-lg font-bodoni text-luxury-black mb-6">Project Sections</h2>
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-luxury-black text-white'
                      : 'hover:bg-soft-white text-luxury-black'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{section.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-8">
          <div className="max-w-5xl">
            <h1 className="text-5xl font-bodoni text-luxury-black mb-2">
              SELFIE AI™ Master Instructions
            </h1>
            <p className="text-xl text-warm-gray mb-12">
              Everything you need to know about building and maintaining the platform.
            </p>

            {/* Mission Section */}
            {activeSection === 'mission' && (
              <section className="space-y-8">
                <div className="bg-white p-8 border border-warm-gray/20">
                  <h2 className="text-3xl font-bodoni text-luxury-black mb-6">Project Mission</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Core Mission</h3>
                      <p className="text-lg leading-relaxed">
                        "Your Selfie is Your Brand. Let's make it work for you."
                      </p>
                      <p className="mt-3 text-warm-gray">
                        SELFIE AI™ is a luxury personal brand platform that helps women show up 
                        confidently online through AI-powered tools and strategic content guidance.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3">Brand Essence</h3>
                      <p className="text-lg font-bodoni">"Vogue meets your best friend"</p>
                      <p className="mt-3 text-warm-gray">
                        Luxury editorial design with approachable warmth. Every interaction should 
                        feel like receiving advice from someone impeccably stylish who genuinely 
                        cares about your success.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3">Target Audience</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <span>Women 25-45 building personal brands</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <span>Entrepreneurs and professionals</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <span>Those starting over (divorce, career change)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <span>Women who struggle with confidence in photos</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3">Success Metrics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-soft-white p-4">
                          <p className="text-sm text-warm-gray">Free → Starter Kit</p>
                          <p className="text-2xl font-bodoni">15% conversion</p>
                        </div>
                        <div className="bg-soft-white p-4">
                          <p className="text-sm text-warm-gray">Starter → Branded</p>
                          <p className="text-2xl font-bodoni">45% conversion</p>
                        </div>
                        <div className="bg-soft-white p-4">
                          <p className="text-sm text-warm-gray">Page Load Time</p>
                          <p className="text-2xl font-bodoni">&lt;3 seconds</p>
                        </div>
                        <div className="bg-soft-white p-4">
                          <p className="text-sm text-warm-gray">User Sentiment</p>
                          <p className="text-2xl font-bodoni">"Expensive but approachable"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* AI Agents Section */}
            {activeSection === 'agents' && (
              <section className="space-y-8">
                <h2 className="text-3xl font-bodoni text-luxury-black mb-6">AI Agent Team</h2>
                
                <div className="bg-luxury-black text-white p-6 mb-8">
                  <p className="text-lg">
                    Each agent has specific responsibilities and limitations. They work together 
                    as a team, passing tasks between each other to deliver complete features.
                  </p>
                </div>

                {agents.map((agent) => (
                  <div key={agent.id} className="bg-white p-8 border border-warm-gray/20">
                    <h3 className="text-2xl font-bodoni text-luxury-black mb-2">{agent.name}</h3>
                    <p className="text-warm-gray mb-6">{agent.role}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          Can Do
                        </h4>
                        <ul className="space-y-2">
                          {agent.responsibilities.map((item, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <span className="text-warm-gray">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          Cannot Do
                        </h4>
                        <ul className="space-y-2">
                          {agent.cannotDo.map((item, index) => (
                            <li key={index} className="text-sm flex items-start gap-2">
                              <span className="text-warm-gray">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Collaboration Workflow Section */}
            {activeSection === 'collaboration' && (
              <section className="space-y-8">
                <h2 className="text-3xl font-bodoni text-luxury-black mb-6">Collaboration Workflow</h2>
                
                <div className="bg-luxury-black text-white p-8 mb-8">
                  <h3 className="text-2xl font-bodoni mb-4">Team Philosophy</h3>
                  <p className="text-lg mb-4">
                    You're not working alone - you're part of a luxury brand team. Every handoff 
                    should be smooth, every note helpful, and every output polished.
                  </p>
                  <p>
                    Think of it like a high-end fashion house: the designer creates, the copywriter 
                    refines the message, quality control ensures perfection, then Sandra gives final approval.
                  </p>
                </div>

                {/* Workflow Patterns */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bodoni text-luxury-black mb-6">Standard Workflow Patterns</h3>
                  <div className="space-y-4">
                    {workflowPatterns.map((pattern, index) => (
                      <div key={index} className="bg-white p-6 border border-warm-gray/20">
                        <h4 className="font-semibold text-lg mb-2">{pattern.name}</h4>
                        <div className="flex items-center gap-2 mb-3">
                          {pattern.workflow.map((agent, i) => (
                            <div key={i} className="flex items-center">
                              <span className="bg-luxury-black text-white px-3 py-1 text-sm">
                                {agent}
                              </span>
                              {i < pattern.workflow.length - 1 && (
                                <ArrowRight className="w-4 h-4 mx-2 text-warm-gray" />
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-warm-gray mb-1">{pattern.description}</p>
                        <p className="text-sm"><strong>Example:</strong> {pattern.example}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collaboration Rules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {collaborationRules.map((rule, index) => {
                    const Icon = rule.icon
                    return (
                      <div key={index} className="bg-white p-6 border border-warm-gray/20">
                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <Icon className="w-5 h-5 text-luxury-black" />
                          {rule.title}
                        </h4>
                        <ul className="space-y-2">
                          {rule.rules.map((item, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>

                {/* Handoff Best Practices */}
                <div className="bg-soft-white p-8 mt-8">
                  <h3 className="text-xl font-bodoni text-luxury-black mb-4">Handoff Best Practices</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Example Good Handoff Note:</h4>
                      <div className="bg-white p-4 border border-warm-gray/20 text-sm">
                        <p className="mb-2">
                          <strong>MAYA to VICTORIA:</strong> "Homepage hero section complete. 
                          Implemented responsive grid at /app/(marketing)/page.tsx. Used new 
                          coastal images from today's vibe. Need your eye on mobile breakpoint 
                          - text might need size adjustment. Preview at localhost:3000"
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">What Makes a Task "Ready for Preview":</h4>
                      <div className="bg-white p-4 border border-warm-gray/20">
                        <ul className="space-y-2 text-sm">
                          <li>✓ All workflow agents have signed off</li>
                          <li>✓ Feature works on desktop and mobile</li>
                          <li>✓ Copy sounds like Sandra (Rachel approved)</li>
                          <li>✓ Design follows luxury standards (Victoria approved)</li>
                          <li>✓ No console errors or warnings (Quinn tested)</li>
                          <li>✓ Preview URL is live and accessible</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Internal vs. Sandra Decisions:</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white p-4 border border-warm-gray/20">
                          <p className="font-semibold mb-2">Handle Internally:</p>
                          <ul className="space-y-1">
                            <li>• Component styling choices</li>
                            <li>• Code implementation details</li>
                            <li>• Copy tweaks under 5 words</li>
                            <li>• Bug fixes</li>
                            <li>• Performance optimizations</li>
                          </ul>
                        </div>
                        <div className="bg-white p-4 border border-warm-gray/20">
                          <p className="font-semibold mb-2">Notify Sandra:</p>
                          <ul className="space-y-1">
                            <li>• New feature ready for review</li>
                            <li>• Major design direction needed</li>
                            <li>• Pricing or offer changes</li>
                            <li>• Integration decisions</li>
                            <li>• Timeline concerns</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Project Structure Section */}
            {activeSection === 'structure' && (
              <section className="space-y-8">
                <h2 className="text-3xl font-bodoni text-luxury-black mb-6">Project Structure</h2>
                
                <div className="bg-white p-8 border border-warm-gray/20">
                  <pre className="bg-luxury-black text-white p-6 overflow-x-auto text-sm">
                    <code>{projectStructure}</code>
                  </pre>
                  
                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Key Directories:</h4>
                      <ul className="space-y-2 text-sm">
                        <li><strong>/(marketing)</strong> - Public-facing pages, no auth required</li>
                        <li><strong>/(dashboard)</strong> - User dashboard, requires authentication</li>
                        <li><strong>/(admin)</strong> - Admin tools (where you are now)</li>
                        <li><strong>/tools</strong> - AI tools like The Glow Check™</li>
                        <li><strong>/api/agents</strong> - Agent communication endpoints</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Naming Conventions:</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Components: PascalCase (e.g., <code>GlowCheck.tsx</code>)</li>
                        <li>• Routes: kebab-case (e.g., <code>agent-hub</code>)</li>
                        <li>• Utilities: camelCase (e.g., <code>formatDate.ts</code>)</li>
                        <li>• Database: snake_case (e.g., <code>admin_tasks</code>)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Database Schema Section */}
            {activeSection === 'database' && (
              <section className="space-y-8">
                <h2 className="text-3xl font-bodoni text-luxury-black mb-6">Database Schema</h2>
                
                <div className="bg-luxury-black text-white p-6 mb-8">
                  <p>
                    All data is stored in Supabase PostgreSQL. Row Level Security (RLS) is enabled 
                    on all tables. Always use proper types when querying.
                  </p>
                </div>

                {databaseSchema.map((table, index) => (
                  <div key={index} className="bg-white p-6 border border-warm-gray/20">
                    <h3 className="text-xl font-bodoni text-luxury-black mb-2">
                      {table.table}
                    </h3>
                    <p className="text-warm-gray mb-4">{table.purpose}</p>
                    <div className="bg-soft-white p-4">
                      <p className="text-sm font-semibold mb-2">Key Fields:</p>
                      <div className="flex flex-wrap gap-2">
                        {table.key_fields.map((field, i) => (
                          <code key={i} className="bg-white px-2 py-1 text-sm border border-warm-gray/20">
                            {field}
                          </code>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-soft-white p-6">
                  <h4 className="font-semibold mb-3">Database Best Practices:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Always handle errors gracefully</li>
                    <li>• Use proper TypeScript types for all queries</li>
                    <li>• Index frequently queried columns</li>
                    <li>• Use transactions for multi-table operations</li>
                    <li>• Keep sensitive data encrypted</li>
                  </ul>
                </div>
              </section>
            )}

            {/* Design System Section */}
            {activeSection === 'design' && (
              <section className="space-y-8">
                <h2 className="text-3xl font-bodoni text-luxury-black mb-6">Design System</h2>
                
                <div className="bg-luxury-black text-white p-8 mb-8">
                  <h3 className="text-2xl font-bodoni mb-4">The Non-Negotiables</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="font-semibold mb-1">NO Rounded Corners</p>
                      <p className="text-sm opacity-80">Everything stays sharp</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">NO Gradients</p>
                      <p className="text-sm opacity-80">Solid colors only</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">NO Drop Shadows</p>
                      <p className="text-sm opacity-80">Clean, flat design</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">NO Emojis</p>
                      <p className="text-sm opacity-80">Professional always</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="bg-[#171719] aspect-square flex items-center justify-center">
                    <div className="text-center text-white">
                      <p className="font-bodoni text-2xl mb-2">Luxury Black</p>
                      <p className="text-sm opacity-80">#171719</p>
                    </div>
                  </div>
                  <div className="bg-[#F1F1F1] aspect-square flex items-center justify-center border border-warm-gray/20">
                    <div className="text-center">
                      <p className="font-bodoni text-2xl mb-2">Soft White</p>
                      <p className="text-sm opacity-80">#F1F1F1</p>
                    </div>
                  </div>
                  <div className="bg-[#B5B5B3] aspect-square flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-bodoni text-2xl mb-2">Warm Gray</p>
                      <p className="text-sm opacity-80">#B5B5B3</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 border border-warm-gray/20">
                  <h3 className="text-xl font-bodoni text-luxury-black mb-4">Typography</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="font-bodoni text-4xl mb-2">Bodoni Moda - Headlines</p>
                      <p className="text-sm text-warm-gray">Used for all headlines, hero text, and emphasis</p>
                    </div>
                    <div>
                      <p className="text-xl mb-2">Inter - Body Text</p>
                      <p className="text-sm text-warm-gray">Used for all body copy, UI elements, and navigation</p>
                    </div>
                  </div>
                </div>

                <div className="bg-soft-white p-6">
                  <p className="text-center text-lg">
                    For complete design guidelines, visit{' '}
                    <a href="/admin/design-manual" className="underline">
                      /admin/design-manual
                    </a>
                  </p>
                </div>
              </section>
            )}

            {/* Voice Guidelines Section */}
            {activeSection === 'voice' && (
              <section className="space-y-8">
                <h2 className="text-3xl font-bodoni text-luxury-black mb-6">Voice Guidelines</h2>
                
                <div className="bg-white p-8 border border-warm-gray/20">
                  <h3 className="text-2xl font-bodoni text-luxury-black mb-4">The Voice Formula</h3>
                  <p className="text-xl text-center py-8">
                    Rachel from FRIENDS + Personal Brand Expertise = Sandra's Voice
                  </p>
                  <p className="text-warm-gray text-center">
                    Warm, relatable, like talking to your best friend who happens to know about style and business.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 border border-warm-gray/20">
                    <h4 className="font-semibold mb-3 text-green-600">✓ Sandra Sounds Like</h4>
                    <ul className="space-y-2 text-sm">
                      <li>"Okay, so here's the thing..."</li>
                      <li>"You know that feeling when..."</li>
                      <li>"Listen, I get it."</li>
                      <li>"Let's fix this together"</li>
                      <li>"You've got this."</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 border border-warm-gray/20">
                    <h4 className="font-semibold mb-3 text-red-600">✗ Never Like This</h4>
                    <ul className="space-y-2 text-sm line-through text-warm-gray">
                      <li>"Unlock your potential!"</li>
                      <li>"Transform your life!"</li>
                      <li>"You are a goddess!"</li>
                      <li>"Revolutionary AI technology!"</li>
                      <li>"Proven strategies for success!"</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-soft-white p-6">
                  <p className="text-center text-lg">
                    For complete voice guidelines and examples, visit{' '}
                    <a href="/admin/voice-guidelines" className="underline">
                      /admin/voice-guidelines
                    </a>
                  </p>
                </div>
              </section>
            )}

            {/* Tech Stack Section */}
            {activeSection === 'stack' && (
              <section className="space-y-8">
                <h2 className="text-3xl font-bodoni text-luxury-black mb-6">Tech Stack</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 border border-warm-gray/20">
                    <h3 className="text-xl font-semibold mb-4">Frontend</h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span>Framework</span>
                        <code className="text-sm bg-soft-white px-2 py-1">Next.js 14 (App Router)</code>
                      </li>
                      <li className="flex justify-between">
                        <span>Language</span>
                        <code className="text-sm bg-soft-white px-2 py-1">TypeScript</code>
                      </li>
                      <li className="flex justify-between">
                        <span>Styling</span>
                        <code className="text-sm bg-soft-white px-2 py-1">Tailwind CSS</code>
                      </li>
                      <li className="flex justify-between">
                        <span>Components</span>
                        <code className="text-sm bg-soft-white px-2 py-1">Custom + Lucide Icons</code>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-6 border border-warm-gray/20">
                    <h3 className="text-xl font-semibold mb-4">Backend</h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span>Database</span>
                        <code className="text-sm bg-soft-white px-2 py-1">Supabase (PostgreSQL)</code>
                      </li>
                      <li className="flex justify-between">
                        <span>Auth</span>
                        <code className="text-sm bg-soft-white px-2 py-1">Supabase Auth</code>
                      </li>
                      <li className="flex justify-between">
                        <span>Storage</span>
                        <code className="text-sm bg-soft-white px-2 py-1">Uploadcare</code>
                      </li>
                      <li className="flex justify-between">
                        <span>Payments</span>
                        <code className="text-sm bg-soft-white px-2 py-1">Stripe</code>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-6 border border-warm-gray/20">
                    <h3 className="text-xl font-semibold mb-4">Infrastructure</h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span>Hosting</span>
                        <code className="text-sm bg-soft-white px-2 py-1">Vercel</code>
                      </li>
                      <li className="flex justify-between">
                        <span>Email</span>
                        <code className="text-sm bg-soft-white px-2 py-1">Resend</code>
                      </li>
                      <li className="flex justify-between">
                        <span>Version Control</span>
                        <code className="text-sm bg-soft-white px-2 py-1">GitHub</code>
                      </li>
                      <li className="flex justify-between">
                        <span>CI/CD</span>
                        <code className="text-sm bg-soft-white px-2 py-1">Vercel + GitHub</code>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-6 border border-warm-gray/20">
                    <h3 className="text-xl font-semibold mb-4">AI Integration</h3>
                    <ul className="space-y-3">
                      <li className="flex justify-between">
                        <span>Agent System</span>
                        <code className="text-sm bg-soft-white px-2 py-1">Custom API Routes</code>
                      </li>
                      <li className="flex justify-between">
                        <span>GitHub API</span>
                        <code className="text-sm bg-soft-white px-2 py-1">Octokit</code>
                      </li>
                      <li className="flex justify-between">
                        <span>Task Queue</span>
                        <code className="text-sm bg-soft-white px-2 py-1">Supabase + Webhooks</code>
                      </li>
                      <li className="flex justify-between">
                        <span>Real-time</span>
                        <code className="text-sm bg-soft-white px-2 py-1">Supabase Realtime</code>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-soft-white p-6">
                  <h4 className="font-semibold mb-3">Development Standards:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Always use TypeScript with proper types</li>
                    <li>• Mobile-first responsive design</li>
                    <li>• Optimize for Core Web Vitals</li>
                    <li>• Use 'use client' for components with hooks/browser APIs</li>
                    <li>• Follow React best practices and Next.js conventions</li>
                  </ul>
                </div>
              </section>
            )}

            {/* Deployment Section */}
            {activeSection === 'deployment' && (
              <section className="space-y-8">
                <h2 className="text-3xl font-bodoni text-luxury-black mb-6">Deployment Process</h2>
                
                <div className="bg-white p-8 border border-warm-gray/20">
                  <h3 className="text-xl font-semibold mb-4">Automatic Deployment Pipeline</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-luxury-black text-white px-4 py-2 text-sm">
                        1. Agent Commits
                      </div>
                      <ArrowRight className="w-5 h-5 text-warm-gray" />
                      <p className="text-sm">Agent pushes code to GitHub</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="bg-luxury-black text-white px-4 py-2 text-sm">
                        2. GitHub Webhook
                      </div>
                      <ArrowRight className="w-5 h-5 text-warm-gray" />
                      <p className="text-sm">Triggers Vercel build</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="bg-luxury-black text-white px-4 py-2 text-sm">
                        3. Build & Test
                      </div>
                      <ArrowRight className="w-5 h-5 text-warm-gray" />
                      <p className="text-sm">Vercel runs build and checks</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="bg-luxury-black text-white px-4 py-2 text-sm">
                        4. Preview Deploy
                      </div>
                      <ArrowRight className="w-5 h-5 text-warm-gray" />
                      <p className="text-sm">Creates preview URL</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="bg-luxury-black text-white px-4 py-2 text-sm">
                        5. Sandra Reviews
                      </div>
                      <ArrowRight className="w-5 h-5 text-warm-gray" />
                      <p className="text-sm">Approves or requests changes</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="bg-green-600 text-white px-4 py-2 text-sm">
                        6. Production
                      </div>
                      <ArrowRight className="w-5 h-5 text-warm-gray" />
                      <p className="text-sm">Live on selfie-ai.com</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-6 border border-warm-gray/20">
                    <h4 className="font-semibold mb-3">Environment Variables</h4>
                    <ul className="space-y-2 text-sm">
                      <li><code>NEXT_PUBLIC_SUPABASE_URL</code></li>
                      <li><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
                      <li><code>SUPABASE_SERVICE_KEY</code></li>
                      <li><code>GITHUB_TOKEN</code></li>
                      <li><code>STRIPE_SECRET_KEY</code></li>
                      <li><code>RESEND_API_KEY</code></li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 border border-warm-gray/20">
                    <h4 className="font-semibold mb-3">Branch Strategy</h4>
                    <ul className="space-y-2 text-sm">
                      <li><strong>main</strong> - Production branch</li>
                      <li><strong>dev</strong> - Development branch</li>
                      <li><strong>feature/*</strong> - Feature branches</li>
                      <li><strong>fix/*</strong> - Bug fix branches</li>
                    </ul>
                    <p className="text-xs text-warm-gray mt-3">
                      Agents always work on feature branches, never directly on main.
                    </p>
                  </div>
                </div>

                <div className="bg-luxury-black text-white p-6">
                  <h4 className="font-semibold mb-3">Critical Deployment Rules:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Never deploy with console errors</li>
                    <li>• Always test on mobile before marking ready</li>
                    <li>• Ensure all environment variables are set</li>
                    <li>• Check loading time is under 3 seconds</li>
                    <li>• Verify all images are optimized</li>
                  </ul>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 