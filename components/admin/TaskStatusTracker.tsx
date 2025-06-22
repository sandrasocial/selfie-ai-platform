'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Play } from 'lucide-react';

interface TaskStatusTrackerProps {
  agentId: string;
}

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  created_at: string;
  agent: string;
}

export function TaskStatusTracker({ agentId }: TaskStatusTrackerProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch tasks from API
    // For now, using mock data
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Build chat interface',
        status: 'completed',
        created_at: new Date().toISOString(),
        agent: agentId
      },
      {
        id: '2',
        title: 'Implement agent handoffs',
        status: 'in_progress',
        created_at: new Date().toISOString(),
        agent: agentId
      },
      {
        id: '3',
        title: 'Add AI responses',
        status: 'pending',
        created_at: new Date().toISOString(),
        agent: agentId
      }
    ];

    setTasks(mockTasks);
    setLoading(false);
  }, [agentId]);

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-warm-gray" />;
      case 'in_progress':
        return <Play className="w-4 h-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-warm-gray" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return 'text-warm-gray';
      case 'in_progress':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-warm-gray';
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<TaskStatus, number>);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Summary */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-luxury-black">Task Status</h3>
        <div className="flex gap-4 text-xs">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="flex items-center gap-1">
              {getStatusIcon(status as TaskStatus)}
              <span className={getStatusColor(status as TaskStatus)}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 bg-white border border-warm-gray/20 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(task.status)}
              <div>
                <p className="text-sm font-medium text-luxury-black">{task.title}</p>
                <p className="text-xs text-warm-gray">
                  {new Date(task.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className={`text-xs font-medium ${getStatusColor(task.status)}`}>
              {getStatusText(task.status)}
            </span>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-warm-gray">No tasks found for this agent</p>
        </div>
      )}
    </div>
  );
} 