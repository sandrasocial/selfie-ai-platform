'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { 
  Bot, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Sparkles,
  Code,
  Palette,
  Mic,
  TestTube,
  Zap
} from 'lucide-react'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Task = {
  id: string
  created_at: string
  title: string
  description: string
  agent: string
  priority: 'low' | 'medium' | 'high'
  file_path?: string
  status: 'pending' | 'active' | 'completed'
  completed_at?: string
}

const agents = [
  { id: 'director', name: 'Director AI', icon: Sparkles, description: 'Oversees all operations' },
  { id: 'ux', name: 'UX AI', icon: Palette, description: 'Designs beautiful interfaces' },
  { id: 'voice', name: 'Voice AI', icon: Mic, description: 'Writes in Sandra\'s voice' },
  { id: 'dev', name: 'Dev AI', icon: Code, description: 'Builds the tech magic' },
  { id: 'qa', name: 'QA AI', icon: TestTube, description: 'Tests everything' },
  { id: 'automation', name: 'Automation AI', icon: Zap, description: 'Handles workflows' }
]

export default function AgentHub() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    agent: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    file_path: ''
  })

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data, error } = await supabase
        .from('admin_tasks')
        .insert([
          {
            ...formData,
            status: 'pending'
          }
        ])
        .select()

      if (error) throw error

      // Reset form
      setFormData({
        title: '',
        description: '',
        agent: '',
        priority: 'medium',
        file_path: ''
      })

      // Refresh tasks
      fetchTasks()
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const updateTaskStatus = async (taskId: string, status: 'active' | 'completed') => {
    try {
      const updateData: any = { status }
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('admin_tasks')
        .update(updateData)
        .eq('id', taskId)

      if (error) throw error
      fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const activeTasks = tasks.filter(t => t.status !== 'completed')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-warm-gray'
    }
  }

  const getAgentIcon = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    return agent ? agent.icon : Bot
  }

  return (
    <div className="min-h-screen bg-soft-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bodoni text-luxury-black mb-2">Agent Central Hub</h1>
        <p className="text-warm-gray">Let's get your AI squad working on what matters.</p>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white p-4 border border-warm-gray/20 hover:border-luxury-black transition-colors duration-300"
          >
            <agent.icon className="w-8 h-8 text-luxury-black mb-2" />
            <h3 className="font-medium text-luxury-black text-sm">{agent.name}</h3>
            <p className="text-xs text-warm-gray mt-1">{agent.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Creation Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 border border-warm-gray/20">
            <h2 className="text-2xl font-bodoni text-luxury-black mb-6">Create New Task</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-luxury-black mb-2">
                  What needs to get done?
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-warm-gray/20 focus:border-luxury-black outline-none transition-colors"
                  placeholder="Quick task title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-luxury-black mb-2">
                  Tell them the details
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-warm-gray/20 focus:border-luxury-black outline-none transition-colors h-24 resize-none"
                  placeholder="What should they know?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-luxury-black mb-2">
                  Who's on it?
                </label>
                <select
                  value={formData.agent}
                  onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
                  className="w-full p-3 border border-warm-gray/20 focus:border-luxury-black outline-none transition-colors"
                  required
                >
                  <option value="">Pick an agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-luxury-black mb-2">
                  How urgent is this?
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full p-3 border border-warm-gray/20 focus:border-luxury-black outline-none transition-colors"
                >
                  <option value="low">Whenever you can</option>
                  <option value="medium">Pretty soon please</option>
                  <option value="high">Drop everything</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-luxury-black mb-2">
                  Any files they need? (optional)
                </label>
                <input
                  type="text"
                  value={formData.file_path}
                  onChange={(e) => setFormData({ ...formData, file_path: e.target.value })}
                  className="w-full p-3 border border-warm-gray/20 focus:border-luxury-black outline-none transition-colors"
                  placeholder="/path/to/file"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-luxury-black text-white p-3 hover:bg-warm-gray transition-colors duration-300"
              >
                Send it to the squad
              </button>
            </form>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bodoni text-luxury-black mb-6">What's in Progress</h2>
            
            {loading ? (
              <p className="text-warm-gray">Loading tasks...</p>
            ) : activeTasks.length === 0 ? (
              <div className="bg-white p-8 border border-warm-gray/20 text-center">
                <p className="text-warm-gray">Nothing going on right now. Create a task to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeTasks.map((task) => {
                  const AgentIcon = getAgentIcon(task.agent)
                  return (
                    <div key={task.id} className="bg-white p-6 border border-warm-gray/20">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <AgentIcon className="w-6 h-6 text-luxury-black mt-1" />
                          <div>
                            <h3 className="text-lg font-medium text-luxury-black">{task.title}</h3>
                            <p className="text-sm text-warm-gray mt-1">{task.description}</p>
                            {task.file_path && (
                              <div className="flex items-center gap-2 mt-2">
                                <FileText className="w-4 h-4 text-warm-gray" />
                                <span className="text-sm text-warm-gray">{task.file_path}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Normal' : 'Low'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-warm-gray">
                          Assigned to {agents.find(a => a.id === task.agent)?.name}
                        </span>
                        <div className="flex gap-2">
                          {task.status === 'pending' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'active')}
                              className="text-sm px-3 py-1 border border-luxury-black text-luxury-black hover:bg-luxury-black hover:text-white transition-colors"
                            >
                              Start
                            </button>
                          )}
                          <button
                            onClick={() => updateTaskStatus(task.id, 'completed')}
                            className="text-sm px-3 py-1 bg-luxury-black text-white hover:bg-warm-gray transition-colors"
                          >
                            Mark Complete
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Completed Tasks */}
          <div>
            <h2 className="text-2xl font-bodoni text-luxury-black mb-6">Recently Completed</h2>
            
            {completedTasks.length === 0 ? (
              <div className="bg-white p-8 border border-warm-gray/20 text-center">
                <p className="text-warm-gray">No completed tasks yet. Keep building!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedTasks.slice(0, 5).map((task) => {
                  const AgentIcon = getAgentIcon(task.agent)
                  return (
                    <div key={task.id} className="bg-soft-white p-4 border border-warm-gray/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <AgentIcon className="w-5 h-5 text-warm-gray" />
                          <div>
                            <h4 className="text-luxury-black">{task.title}</h4>
                            <p className="text-xs text-warm-gray">
                              Completed by {agents.find(a => a.id === task.agent)?.name}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-warm-gray">
                          {task.completed_at && new Date(task.completed_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 