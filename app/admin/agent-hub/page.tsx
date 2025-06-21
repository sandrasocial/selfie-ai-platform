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
  Zap,
  ArrowRight,
  Eye,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Users,
  ChevronRight,
  User
} from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

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
  status: 'pending' | 'in_progress' | 'needs_next_agent' | 'in_review' | 'ready_for_preview' | 'changes_requested' | 'approved' | 'completed'
  completed_at?: string
  workflow: string[]
  current_agent_index: number
  agent_notes: Record<string, any>
  preview_url?: string
  ready_for_review: boolean
}

type ActivityLog = {
  id: string
  task_id: string
  agent_name: string
  activity: string
  created_at: string
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
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    agent: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    file_path: '',
    workflow: [] as string[]
  })
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  const [changeRequestMessage, setChangeRequestMessage] = useState('')
  const [showChangeRequestModal, setShowChangeRequestModal] = useState<string | null>(null)

  // Fetch tasks and activity logs on component mount
  useEffect(() => {
    fetchTasks()
    fetchActivityLogs()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('tasks_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_tasks' }, () => {
        fetchTasks()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_activity_log' }, () => {
        fetchActivityLogs()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
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

  const fetchActivityLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setActivityLogs(data || [])
    } catch (error) {
      console.error('Error fetching activity logs:', error)
    }
  }

  const logActivity = async (taskId: string, agentName: string, activity: string) => {
    try {
      await supabase.from('agent_activity_log').insert({
        task_id: taskId,
        agent_name: agentName,
        activity
      })
    } catch (error) {
      console.error('Error logging activity:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const taskData = {
        ...formData,
        status: 'pending' as const,
        workflow: selectedAgents,
        agent: selectedAgents.length > 0 ? selectedAgents[0] : formData.agent
      }

      const { data, error } = await supabase
        .from('admin_tasks')
        .insert([taskData])
        .select()

      if (error) throw error

      if (data && data[0]) {
        await logActivity(data[0].id, 'System', `Task created with workflow: ${selectedAgents.join(' → ')}`)
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        agent: '',
        priority: 'medium',
        file_path: '',
        workflow: []
      })
      setSelectedAgents([])
      setShowWorkflowBuilder(false)

      // Refresh tasks
      fetchTasks()
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const updateTaskStatus = async (taskId: string, status: Task['status'], notes?: string) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      if (!task) return

      const updateData: any = { status }
      
      // Handle workflow progression
      if (status === 'needs_next_agent' && task.workflow.length > 0) {
        const nextIndex = task.current_agent_index + 1
        if (nextIndex < task.workflow.length) {
          updateData.current_agent_index = nextIndex
          updateData.agent = task.workflow[nextIndex]
          updateData.status = 'pending'
          await logActivity(taskId, task.agent, 'Completed their part and passed to next agent')
        } else {
          updateData.status = 'ready_for_preview'
          updateData.ready_for_review = true
          await logActivity(taskId, task.agent, 'Completed final step - ready for Sandra\'s review')
        }
      }

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
        updateData.ready_for_review = false
      }

      if (status === 'approved') {
        await logActivity(taskId, 'Sandra', 'Approved the task')
      }

      if (status === 'changes_requested' && notes) {
        updateData.agent_notes = {
          ...task.agent_notes,
          change_requests: [
            ...(task.agent_notes.change_requests || []),
            { message: notes, timestamp: new Date().toISOString() }
          ]
        }
        updateData.current_agent_index = 0
        updateData.agent = task.workflow[0] || task.agent
        await logActivity(taskId, 'Sandra', `Requested changes: ${notes}`)
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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(selectedAgents)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSelectedAgents(items)
  }

  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgents(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    )
  }

  const readyForReviewTasks = tasks.filter(t => t.ready_for_review)
  const activeTasks = tasks.filter(t => !t.ready_for_review && t.status !== 'completed')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-warm-gray'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-700'
      case 'in_progress': return 'bg-blue-100 text-blue-700'
      case 'needs_next_agent': return 'bg-yellow-100 text-yellow-700'
      case 'in_review': return 'bg-purple-100 text-purple-700'
      case 'ready_for_preview': return 'bg-green-100 text-green-700'
      case 'changes_requested': return 'bg-red-100 text-red-700'
      case 'approved': return 'bg-green-200 text-green-800'
      case 'completed': return 'bg-gray-200 text-gray-800'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getAgentIcon = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    return agent ? agent.icon : Bot
  }

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    return agent ? agent.name : agentId
  }

  return (
    <div className="min-h-screen bg-soft-white p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bodoni text-luxury-black mb-2">Agent Central Hub</h1>
        <p className="text-warm-gray">Let's get your AI squad working on what matters.</p>
      </div>

      {/* Ready for Review Alert - Only show if there are tasks */}
      {readyForReviewTasks.length > 0 && (
        <div className="bg-luxury-black text-white p-8 mb-8">
          <h2 className="text-2xl font-bodoni mb-6">
            {readyForReviewTasks.length} {readyForReviewTasks.length === 1 ? 'Task' : 'Tasks'} Ready for Your Review
          </h2>
          
          <div className="space-y-4">
            {readyForReviewTasks.map(task => (
              <div key={task.id} className="bg-white text-luxury-black p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                    <p className="text-sm text-warm-gray mb-3">
                      Completed by: {task.workflow.map(w => getAgentName(w)).join(' → ')}
                    </p>
                    {task.preview_url && (
                      <a 
                        href={task.preview_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Preview Live
                      </a>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        updateTaskStatus(task.id, 'approved')
                        updateTaskStatus(task.id, 'completed')
                      }}
                      className="bg-luxury-black text-white px-6 py-3 hover:bg-warm-gray transition-colors flex items-center gap-2"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Approve & Deploy
                    </button>
                    <button
                      onClick={() => setShowChangeRequestModal(task.id)}
                      className="border border-luxury-black px-6 py-3 hover:bg-luxury-black hover:text-white transition-colors flex items-center gap-2"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Request Changes
                    </button>
                  </div>
                </div>
                
                {/* Task Activity Timeline */}
                {expandedTask === task.id && (
                  <div className="mt-6 pt-6 border-t border-warm-gray/20">
                    <h4 className="font-semibold mb-3">Activity Timeline</h4>
                    <div className="space-y-2">
                      {activityLogs
                        .filter(log => log.task_id === task.id)
                        .slice(0, 5)
                        .map(log => (
                          <div key={log.id} className="flex items-start gap-3 text-sm">
                            <User className="w-4 h-4 text-warm-gray mt-0.5" />
                            <div>
                              <span className="font-medium">{log.agent_name}:</span> {log.activity}
                              <span className="text-warm-gray ml-2">
                                {new Date(log.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                  className="text-sm text-warm-gray hover:text-luxury-black mt-4"
                >
                  {expandedTask === task.id ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
                  Single agent or workflow?
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowWorkflowBuilder(false)}
                    className={`flex-1 p-2 border ${!showWorkflowBuilder ? 'bg-luxury-black text-white' : 'border-warm-gray/20'}`}
                  >
                    Single Agent
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWorkflowBuilder(true)}
                    className={`flex-1 p-2 border ${showWorkflowBuilder ? 'bg-luxury-black text-white' : 'border-warm-gray/20'}`}
                  >
                    Workflow
                  </button>
                </div>
              </div>

              {!showWorkflowBuilder ? (
                <div>
                  <label className="block text-sm text-luxury-black mb-2">
                    Who's on it?
                  </label>
                  <select
                    value={formData.agent}
                    onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
                    className="w-full p-3 border border-warm-gray/20 focus:border-luxury-black outline-none transition-colors"
                    required={!showWorkflowBuilder}
                  >
                    <option value="">Pick an agent</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-luxury-black mb-2">
                    Build your workflow (check and drag to reorder)
                  </label>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="agents">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                          {agents.map((agent, index) => (
                            <Draggable key={agent.id} draggableId={agent.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`flex items-center gap-3 p-3 border ${
                                    selectedAgents.includes(agent.id) 
                                      ? 'border-luxury-black bg-luxury-black/5' 
                                      : 'border-warm-gray/20'
                                  } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedAgents.includes(agent.id)}
                                    onChange={() => toggleAgentSelection(agent.id)}
                                    className="w-4 h-4"
                                  />
                                  <agent.icon className="w-5 h-5" />
                                  <span className="text-sm">{agent.name}</span>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  
                  {selectedAgents.length > 0 && (
                    <div className="mt-3 p-3 bg-soft-white">
                      <p className="text-xs text-warm-gray mb-1">Workflow order:</p>
                      <p className="text-sm text-luxury-black">
                        {selectedAgents.map(id => getAgentName(id)).join(' → ')}
                      </p>
                    </div>
                  )}
                </div>
              )}

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

          {/* Activity Feed */}
          <div className="bg-white p-6 border border-warm-gray/20 mt-6">
            <h3 className="text-lg font-semibold text-luxury-black mb-4">Recent Activity</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {activityLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <Clock className="w-4 h-4 text-warm-gray mt-0.5" />
                  <div className="flex-1">
                    <span className="font-medium">{log.agent_name}</span> {log.activity}
                    <p className="text-xs text-warm-gray">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
                  const isWorkflow = task.workflow && task.workflow.length > 0
                  
                  return (
                    <div key={task.id} className="bg-white p-6 border border-warm-gray/20">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <AgentIcon className="w-6 h-6 text-luxury-black mt-1" />
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-luxury-black">{task.title}</h3>
                            <p className="text-sm text-warm-gray mt-1">{task.description}</p>
                            {task.file_path && (
                              <div className="flex items-center gap-2 mt-2">
                                <FileText className="w-4 h-4 text-warm-gray" />
                                <span className="text-sm text-warm-gray">{task.file_path}</span>
                              </div>
                            )}
                            
                            {/* Workflow Progress Indicator */}
                            {isWorkflow && (
                              <div className="mt-4 p-3 bg-soft-white">
                                <p className="text-xs text-warm-gray mb-2">Workflow Progress:</p>
                                <div className="flex items-center gap-2">
                                  {task.workflow.map((agentId, index) => {
                                    const WfIcon = getAgentIcon(agentId)
                                    const isActive = index === task.current_agent_index
                                    const isComplete = index < task.current_agent_index
                                    
                                    return (
                                      <div key={index} className="flex items-center">
                                        <div className={`flex items-center gap-1 p-2 ${
                                          isActive ? 'bg-luxury-black text-white' : 
                                          isComplete ? 'bg-green-100 text-green-700' : 
                                          'bg-gray-100 text-gray-400'
                                        }`}>
                                          <WfIcon className="w-4 h-4" />
                                          <span className="text-xs">{getAgentName(agentId)}</span>
                                        </div>
                                        {index < task.workflow.length - 1 && (
                                          <ChevronRight className="w-4 h-4 text-warm-gray mx-1" />
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-xs px-2 py-1 ${getStatusColor(task.status)}`}>
                            {task.status.replace(/_/g, ' ')}
                          </span>
                          <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Normal' : 'Low'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-warm-gray">
                          {isWorkflow 
                            ? `Step ${task.current_agent_index + 1} of ${task.workflow.length}`
                            : `Assigned to ${getAgentName(task.agent)}`
                          }
                        </span>
                        <div className="flex gap-2">
                          {task.status === 'pending' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'in_progress')}
                              className="text-sm px-3 py-1 border border-luxury-black text-luxury-black hover:bg-luxury-black hover:text-white transition-colors"
                            >
                              Start
                            </button>
                          )}
                          {task.status === 'in_progress' && isWorkflow && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'needs_next_agent')}
                              className="text-sm px-3 py-1 bg-luxury-black text-white hover:bg-warm-gray transition-colors"
                            >
                              Pass to Next Agent
                            </button>
                          )}
                          {task.status === 'in_progress' && !isWorkflow && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'ready_for_preview')}
                              className="text-sm px-3 py-1 bg-luxury-black text-white hover:bg-warm-gray transition-colors"
                            >
                              Mark for Review
                            </button>
                          )}
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
                              {task.workflow.length > 0 
                                ? `Completed by ${task.workflow.map(w => getAgentName(w)).join(' → ')}`
                                : `Completed by ${getAgentName(task.agent)}`
                              }
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

      {/* Change Request Modal */}
      {showChangeRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 max-w-md w-full">
            <h3 className="text-2xl font-bodoni text-luxury-black mb-4">Request Changes</h3>
            <textarea
              value={changeRequestMessage}
              onChange={(e) => setChangeRequestMessage(e.target.value)}
              className="w-full p-4 border border-warm-gray/20 focus:border-luxury-black outline-none h-32 resize-none mb-4"
              placeholder="What needs to be changed?"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  updateTaskStatus(showChangeRequestModal, 'changes_requested', changeRequestMessage)
                  setShowChangeRequestModal(null)
                  setChangeRequestMessage('')
                }}
                className="flex-1 bg-luxury-black text-white py-3 hover:bg-warm-gray transition-colors"
              >
                Send Changes
              </button>
              <button
                onClick={() => {
                  setShowChangeRequestModal(null)
                  setChangeRequestMessage('')
                }}
                className="flex-1 border border-luxury-black py-3 hover:bg-luxury-black hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 