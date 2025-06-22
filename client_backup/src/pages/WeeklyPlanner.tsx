
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar,
  Sparkles,
  Plus,
  Edit3,
  Check,
  Camera,
  Brain,
  PenTool,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import Header from '@/components/layout/Header';

type PlannerItem = {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  task: string;
  createdBy: "user" | "sandraAI";
  completed: boolean;
};

type DayActivity = {
  selfie: boolean;
  posted: boolean;
  reflected: boolean;
};

export default function WeeklyPlanner() {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dailyActivities, setDailyActivities] = useState<Record<string, DayActivity>>({});
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current week's dates
  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Start from Monday
    start.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  // Get Monday of current week for API calls
  const getWeekStart = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    return start.toISOString().split('T')[0];
  };

  const weekDates = getWeekDates(currentWeek);
  const today = new Date().toISOString().split('T')[0];
  const weekStart = getWeekStart(currentWeek);

  // Get authenticated user info
  const { data: user } = useQuery({ 
    queryKey: ['/api/me'],
    retry: false 
  });

  // Fetch weekly planner data
  const { 
    data: plannerItems = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['/api/weekly-planner', weekStart],
    queryFn: async () => {
      if (!user) return [];
      try {
        const response = await apiRequest('GET', `/api/weekly-planner?week=${weekStart}`);
        return response || [];
      } catch (error) {
        console.error('Failed to fetch planner data:', error);
        return [];
      }
    },
    enabled: !!user,
    retry: false
  });

  // Mutation for creating new planner items
  const createPlannerItemMutation = useMutation({
    mutationFn: async (newItem: Omit<PlannerItem, 'id' | 'userId'>) => {
      return await apiRequest('POST', '/api/weekly-planner', newItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/weekly-planner', weekStart] });
      toast({
        title: "Task Added",
        description: "Your content plan has been updated.",
        className: "bg-luxury-beige border-luxury-beige text-luxury-black",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
      console.error('Failed to create planner item:', error);
    }
  });

  // Mutation for updating planner items
  const updatePlannerItemMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PlannerItem> }) => {
      return await apiRequest('PUT', `/api/weekly-planner/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/weekly-planner', weekStart] });
      toast({
        title: "Task Updated",
        description: "Your content plan has been updated.",
        className: "bg-luxury-beige border-luxury-beige text-luxury-black",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
      console.error('Failed to update planner item:', error);
    }
  });

  // Initialize daily activities with mock data for now
  useEffect(() => {
    const mockActivities: Record<string, DayActivity> = {};
    weekDates.forEach((date, index) => {
      const dateStr = date.toISOString().split('T')[0];
      mockActivities[dateStr] = {
        selfie: index < 2,
        posted: index < 1,
        reflected: index < 3
      };
    });
    setDailyActivities(mockActivities);
  }, [currentWeek]);

  const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const getTasksForDay = (date: string) => {
    return plannerItems.filter(item => item.date === date);
  };

  const handleDayClick = (date: string) => {
    setSelectedDay(date);
    setEditingTask('');
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleTaskEdit = (task: PlannerItem) => {
    setEditingTask(task.task);
    setEditingId(task.id);
    setSelectedDay(task.date);
    setIsModalOpen(true);
  };

  const saveTask = () => {
    if (!selectedDay || !editingTask.trim() || !user) return;

    if (editingId) {
      // Update existing task
      updatePlannerItemMutation.mutate({
        id: editingId,
        updates: { task: editingTask.trim() }
      });
    } else {
      // Add new task
      createPlannerItemMutation.mutate({
        date: selectedDay,
        task: editingTask.trim(),
        createdBy: 'user',
        completed: false
      });
    }

    setIsModalOpen(false);
    setEditingTask('');
    setEditingId(null);
    setSelectedDay(null);
  };

  const toggleTaskComplete = (id: string) => {
    const item = plannerItems.find(item => item.id === id);
    if (!item) return;

    updatePlannerItemMutation.mutate({
      id,
      updates: { completed: !item.completed }
    });
  };

  const toggleDailyActivity = (date: string, activity: keyof DayActivity) => {
    setDailyActivities(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [activity]: !prev[date]?.[activity]
      }
    }));
  };

  const getSandrasuggestion = () => {
    if (!user) return;

    const suggestions = [
      "Record a reel answering a DM question",
      "Share a quick tutorial on your morning routine",
      "Post a carousel about overcoming self-doubt",
      "Show your workspace setup and productivity tips",
      "Share a behind-the-scenes moment from your day"
    ];
    
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    const randomDate = weekDates[Math.floor(Math.random() * 7)].toISOString().split('T')[0];
    
    createPlannerItemMutation.mutate({
      date: randomDate,
      task: randomSuggestion,
      createdBy: 'sandraAI',
      completed: false
    });
    
    toast({
      title: "Sandra's Suggestion Added! ✨",
      description: `Added: "${randomSuggestion}"`,
      className: "bg-luxury-beige border-luxury-beige text-luxury-black",
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
    
    // Pre-fetch data for the new week
    const newWeekStart = getWeekStart(newWeek);
    queryClient.prefetchQuery({
      queryKey: ['/api/weekly-planner', newWeekStart],
      queryFn: async () => {
        if (!user) return [];
        try {
          const response = await apiRequest('GET', `/api/weekly-planner?week=${newWeekStart}`);
          return response || [];
        } catch (error) {
          console.error('Failed to prefetch planner data:', error);
          return [];
        }
      }
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div 
              className="w-8 h-8 border-2 border-[#171719] border-t-transparent rounded-full animate-spin mx-auto"
            />
            <p 
              className="text-sm"
              style={{ 
                fontFamily: 'Neue Einstellung, sans-serif',
                color: '#4C4B4B'
              }}
            >
              Loading your weekly planner...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show auth required state
  if (!user) {
    return (
      <div className="min-h-screen bg-luxury-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-6 max-w-md">
            <h2 
              className="text-2xl font-normal"
              style={{ 
                fontFamily: 'Cormorant Garamond, serif',
                color: '#171719'
              }}
            >
              Sign In Required
            </h2>
            <p 
              className="text-sm"
              style={{ 
                fontFamily: 'Neue Einstellung, sans-serif',
                color: '#4C4B4B'
              }}
            >
              Please sign in to access your weekly planner.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-white">
      <Header />

      {/* Hero Section */}
      <section className="section-black section-luxury-alt">
        <div className="container mx-auto px-6 md:px-4 text-center animate-fadeInUp">
          {/* Section Label */}
          <div className="mb-6">
            <p 
              className="text-xs uppercase tracking-widest mb-2"
              style={{ 
                fontFamily: 'Neue Einstellung, sans-serif',
                letterSpacing: '0.3em',
                color: '#B5B5B3'
              }}
            >
              WEEKLY PLANNER
            </p>
            <div 
              className="w-16 h-px mx-auto"
              style={{ backgroundColor: '#B5B5B3', opacity: '0.6' }}
            />
          </div>

          <h1 
            className="text-4xl md:text-5xl font-normal text-luxury-white mb-6 uppercase tracking-wide leading-tight"
            className="font-cormorant"
          >
            This Week's Content
          </h1>
          
          <div className="luxury-divider mb-8"></div>
          
          <p 
            className="text-lg text-luxury-light-gray max-w-2xl mx-auto"
            style={{ 
              fontFamily: 'Neue Einstellung, sans-serif',
              fontSize: '18px'
            }}
          >
            Your brand is built in the moments you choose to show up.
          </p>
        </div>
      </section>

      {/* Weekly Mood Quote */}
      <section className="py-8 px-6" style={{ backgroundColor: '#F1F1F1' }}>
        <div className="max-w-6xl mx-auto text-center">
          <p 
            className="text-lg italic opacity-80"
            style={{ 
              fontFamily: 'Cormorant Garamond, serif',
              color: '#4C4B4B'
            }}
          >
            "Visibility creates clarity. Take the first step."
          </p>
        </div>
      </section>

      {/* Main Planner */}
      <section className="py-16 px-6" style={{ backgroundColor: '#F1F1F1' }}>
        <div className="max-w-7xl mx-auto">
          
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-12">
            <Button
              variant="ghost"
              onClick={() => navigateWeek('prev')}
              className="p-2"
              style={{ color: '#4C4B4B' }}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <h2 
              className="text-2xl font-normal"
              style={{ 
                fontFamily: 'Cormorant Garamond, serif',
                color: '#171719'
              }}
            >
              Week of {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </h2>
            
            <Button
              variant="ghost"
              onClick={() => navigateWeek('next')}
              className="p-2"
              style={{ color: '#4C4B4B' }}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-7 gap-6 mb-12">
            {weekDates.map((date, index) => {
              const dateStr = date.toISOString().split('T')[0];
              const tasks = getTasksForDay(dateStr);
              const isToday = dateStr === today;
              const activities = dailyActivities[dateStr] || { selfie: false, posted: false, reflected: false };

              return (
                <Card
                  key={dateStr}
                  className={`relative cursor-pointer transition-all duration-300 border-0 ${
                    isToday ? 'ring-2 ring-[#171719] shadow-lg' : ''
                  }`}
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0px',
                    boxShadow: isToday ? '0 0 20px rgba(23, 23, 25, 0.3)' : '0 2px 12px rgba(0, 0, 0, 0.08)',
                    minHeight: '320px'
                  }}
                  onClick={() => handleDayClick(dateStr)}
                  onMouseEnter={() => setHoveredDay(dateStr)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  {/* Today Glow Effect */}
                  {isToday && (
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, rgba(23, 23, 25, 0.05) 0%, transparent 100%)',
                        borderRadius: '0px'
                      }}
                    />
                  )}

                  <CardHeader className="pb-4">
                    <CardTitle 
                      className="text-center text-sm font-medium uppercase tracking-wide"
                      style={{ 
                        fontFamily: 'Neue Einstellung, sans-serif',
                        color: '#171719',
                        letterSpacing: '0.3em'
                      }}
                    >
                      {dayNames[index]}
                    </CardTitle>
                    
                    <div className="text-center mt-2">
                      <span 
                        className="text-2xl font-light"
                        style={{ 
                          fontFamily: 'Cormorant Garamond, serif',
                          color: '#4C4B4B'
                        }}
                      >
                        {date.getDate()}
                      </span>
                    </div>

                    {/* Task Indicator */}
                    <div className="flex justify-center mt-4">
                      <div 
                        className={`w-3 h-3 rounded-full ${
                          tasks.length > 0 ? 'bg-[#171719]' : 'bg-[#B5B5B3]'
                        }`}
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 px-4 pb-4">
                    {/* Task Preview */}
                    {tasks.length > 0 && (hoveredDay === dateStr || tasks.length <= 2) && (
                      <div className="space-y-2 mb-4">
                        {tasks.slice(0, 2).map((task) => (
                          <div 
                            key={task.id} 
                            className={`text-xs p-2 rounded transition-opacity ${
                              task.completed ? 'opacity-50 line-through' : ''
                            }`}
                            style={{ 
                              backgroundColor: '#F1F1F1',
                              fontFamily: 'Neue Einstellung, sans-serif',
                              color: '#4C4B4B'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskEdit(task);
                            }}
                          >
                            <p className="line-clamp-2">{task.task}</p>
                            {task.createdBy === 'sandraAI' && (
                              <Badge 
                                className="mt-1 text-xs"
                                style={{
                                  backgroundColor: '#171719',
                                  color: '#F1F1F1',
                                  fontSize: '10px'
                                }}
                              >
                                <Sparkles className="w-3 h-3 mr-1" />
                                Sandra AI
                              </Badge>
                            )}
                          </div>
                        ))}
                        {tasks.length > 2 && (
                          <p 
                            className="text-xs text-center opacity-60"
                            style={{ 
                              fontFamily: 'Neue Einstellung, sans-serif',
                              color: '#4C4B4B'
                            }}
                          >
                            +{tasks.length - 2} more
                          </p>
                        )}
                      </div>
                    )}

                    {/* Daily Ritual Tracker */}
                    <div className="flex justify-center space-x-3 mt-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDailyActivity(dateStr, 'selfie');
                        }}
                        className={`p-1 rounded transition-colors ${
                          activities.selfie ? 'text-[#171719]' : 'text-[#B5B5B3]'
                        }`}
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDailyActivity(dateStr, 'posted');
                        }}
                        className={`p-1 rounded transition-colors ${
                          activities.posted ? 'text-[#171719]' : 'text-[#B5B5B3]'
                        }`}
                      >
                        <Brain className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDailyActivity(dateStr, 'reflected');
                        }}
                        className={`p-1 rounded transition-colors ${
                          activities.reflected ? 'text-[#171719]' : 'text-[#B5B5B3]'
                        }`}
                      >
                        <PenTool className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Mobile Stack */}
          <div className="md:hidden space-y-4 mb-12">
            {weekDates.map((date, index) => {
              const dateStr = date.toISOString().split('T')[0];
              const tasks = getTasksForDay(dateStr);
              const isToday = dateStr === today;
              const activities = dailyActivities[dateStr] || { selfie: false, posted: false, reflected: false };

              return (
                <Card
                  key={dateStr}
                  className={`cursor-pointer transition-all duration-300 border-0 ${
                    isToday ? 'ring-2 ring-[#171719]' : ''
                  }`}
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderRadius: '0px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
                  }}
                  onClick={() => handleDayClick(dateStr)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle 
                          className="text-sm font-medium uppercase tracking-wide"
                          style={{ 
                            fontFamily: 'Neue Einstellung, sans-serif',
                            color: '#171719',
                            letterSpacing: '0.3em'
                          }}
                        >
                          {dayNames[index]} {date.getDate()}
                        </CardTitle>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {/* Task Indicator */}
                        <div 
                          className={`w-3 h-3 rounded-full ${
                            tasks.length > 0 ? 'bg-[#171719]' : 'bg-[#B5B5B3]'
                          }`}
                        />
                        
                        {/* Daily Activities */}
                        <div className="flex space-x-2">
                          <Camera className={`w-4 h-4 ${activities.selfie ? 'text-[#171719]' : 'text-[#B5B5B3]'}`} />
                          <Brain className={`w-4 h-4 ${activities.posted ? 'text-[#171719]' : 'text-[#B5B5B3]'}`} />
                          <PenTool className={`w-4 h-4 ${activities.reflected ? 'text-[#171719]' : 'text-[#B5B5B3]'}`} />
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {tasks.length > 0 ? (
                      <div className="space-y-2">
                        {tasks.slice(0, 3).map((task) => (
                          <p 
                            key={task.id}
                            className={`text-sm ${task.completed ? 'opacity-50 line-through' : ''}`}
                            style={{ 
                              fontFamily: 'Neue Einstellung, sans-serif',
                              color: '#4C4B4B'
                            }}
                          >
                            {task.task}
                          </p>
                        ))}
                        {tasks.length > 3 && (
                          <p 
                            className="text-xs opacity-60"
                            style={{ 
                              fontFamily: 'Neue Einstellung, sans-serif',
                              color: '#4C4B4B'
                            }}
                          >
                            +{tasks.length - 3} more tasks
                          </p>
                        )}
                      </div>
                    ) : (
                      <p 
                        className="text-sm opacity-60"
                        style={{ 
                          fontFamily: 'Neue Einstellung, sans-serif',
                          color: '#4C4B4B'
                        }}
                      >
                        No tasks planned
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Sandra Suggests Floating Box */}
          <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
            <Card 
              className="border-0 shadow-lg"
              style={{ 
                backgroundColor: '#F1F1F1',
                borderRadius: '0px',
                width: '280px'
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4" style={{ color: '#171719' }} />
                  <span 
                    className="text-sm font-medium"
                    style={{ 
                      fontFamily: 'Neue Einstellung, sans-serif',
                      color: '#171719'
                    }}
                  >
                    Sandra Suggests...
                  </span>
                </div>
                <p 
                  className="text-sm mb-3"
                  style={{ 
                    fontFamily: 'Neue Einstellung, sans-serif',
                    color: '#4C4B4B'
                  }}
                >
                  "Record a reel answering a DM question."
                </p>
                <Button
                  onClick={getSandrasuggestion}
                  className="w-full text-xs"
                  style={{ 
                    backgroundColor: '#171719',
                    color: '#F1F1F1',
                    borderRadius: '0px',
                    fontFamily: 'Neue Einstellung, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3em'
                  }}
                >
                  Add to Planner
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* CTA Zone */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="px-8 py-4 text-sm font-medium uppercase tracking-wide transition-all duration-300"
              style={{ 
                backgroundColor: 'transparent',
                color: '#171719',
                border: '2px solid #171719',
                borderRadius: '0px',
                fontFamily: 'Neue Einstellung, sans-serif',
                letterSpacing: '0.5px'
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Manage Calendar
            </Button>
            
            <Button
              onClick={getSandrasuggestion}
              className="px-8 py-4 text-sm font-medium uppercase tracking-wide transition-all duration-300"
              style={{ 
                backgroundColor: '#171719',
                color: '#F1F1F1',
                border: '2px solid #171719',
                borderRadius: '0px',
                fontFamily: 'Neue Einstellung, sans-serif',
                letterSpacing: '0.5px'
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Sandra's Suggestion
            </Button>
          </div>
        </div>
      </section>

      {/* Task Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent 
          className="sm:max-w-md border-0"
          style={{ 
            backgroundColor: '#F1F1F1',
            borderRadius: '0px'
          }}
        >
          <DialogHeader>
            <DialogTitle 
              className="text-xl font-normal"
              style={{ 
                fontFamily: 'Cormorant Garamond, serif',
                color: '#171719'
              }}
            >
              {editingId ? 'Edit Task' : 'Add New Task'}
            </DialogTitle>
            <DialogDescription 
              style={{ 
                fontFamily: 'Neue Einstellung, sans-serif',
                color: '#4C4B4B'
              }}
            >
              {selectedDay && `For ${new Date(selectedDay).toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric' 
              })}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              value={editingTask}
              onChange={(e) => setEditingTask(e.target.value)}
              placeholder="What content will you create today?"
              className="border-0 bg-white"
              style={{ 
                fontFamily: 'Neue Einstellung, sans-serif',
                borderRadius: '0px'
              }}
            />

            {selectedDay && (
              <div className="space-y-3">
                <h4 
                  className="text-sm font-medium"
                  style={{ 
                    fontFamily: 'Neue Einstellung, sans-serif',
                    color: '#171719'
                  }}
                >
                  Existing Tasks:
                </h4>
                {getTasksForDay(selectedDay).map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-white"
                    style={{ borderRadius: '0px' }}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskComplete(task.id)}
                      />
                      <span 
                        className={`text-sm ${task.completed ? 'line-through opacity-50' : ''}`}
                        style={{ 
                          fontFamily: 'Neue Einstellung, sans-serif',
                          color: '#4C4B4B'
                        }}
                      >
                        {task.task}
                      </span>
                      {task.createdBy === 'sandraAI' && (
                        <Badge 
                          className="text-xs"
                          style={{
                            backgroundColor: '#171719',
                            color: '#F1F1F1'
                          }}
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTaskEdit(task)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="outline"
                className="flex-1"
                style={{ 
                  borderRadius: '0px',
                  fontFamily: 'Neue Einstellung, sans-serif'
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={saveTask}
                disabled={!editingTask.trim()}
                className="flex-1"
                style={{ 
                  backgroundColor: '#171719',
                  color: '#F1F1F1',
                  borderRadius: '0px',
                  fontFamily: 'Neue Einstellung, sans-serif'
                }}
              >
                <Check className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
