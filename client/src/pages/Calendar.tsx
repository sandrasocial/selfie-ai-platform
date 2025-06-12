
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { Calendar as UICalendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface CalendarEntry {
  id: number;
  dayNumber: number;
  contentText: string;
  templateName?: string;
  isStrategy: boolean;
  hookText: string;
  hashtags: string;
  createdAt: string;
  day?: string;
}

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    contentText: '',
    hookText: '',
    hashtags: '',
    day: ''
  });
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCalendarEntries();
  }, []);

  const fetchCalendarEntries = async () => {
    try {
      const response = await fetch('/api/calendar', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCalendarEntries(data);
      }
    } catch (error) {
      console.error('Failed to fetch calendar entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCalendarEntry = async () => {
    if (!newEntry.contentText || !newEntry.day) {
      toast({
        title: "Missing Information",
        description: "Please fill in content and select a day.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/calendar/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          dayNumber: getDayNumber(newEntry.day),
          contentText: newEntry.contentText,
          hookText: newEntry.hookText,
          hashtags: newEntry.hashtags,
          isStrategy: false,
          templateName: null
        }),
      });

      if (response.ok) {
        await fetchCalendarEntries();
        setNewEntry({ contentText: '', hookText: '', hashtags: '', day: '' });
        setIsDialogOpen(false);
        toast({
          title: "Entry Added",
          description: "Your content has been added to the calendar.",
        });
      }
    } catch (error) {
      console.error('Failed to add calendar entry:', error);
      toast({
        title: "Error",
        description: "Failed to add entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteEntry = async (id: number) => {
    try {
      const response = await fetch(`/api/calendar/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await fetchCalendarEntries();
        toast({
          title: "Entry Deleted",
          description: "Calendar entry has been removed.",
        });
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const getDayNumber = (day: string): number => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.indexOf(day) + 1;
  };

  const getDayName = (dayNumber: number): string => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber - 1] || 'Unknown';
  };

  const groupedEntries = calendarEntries.reduce((acc, entry) => {
    const dayName = getDayName(entry.dayNumber);
    if (!acc[dayName]) {
      acc[dayName] = [];
    }
    acc[dayName].push(entry);
    return acc;
  }, {} as Record<string, CalendarEntry[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#171719] mx-auto"></div>
          <p 
            className="text-sm text-[#4C4B4B]"
            style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
          >
            Loading calendar...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F1F1F1' }}>
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-[120px]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url(https://i.postimg.cc/YC0mdvs0/IMG-3198.jpg)',
            filter: 'grayscale(100%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 
            className="text-6xl md:text-7xl font-normal text-white leading-tight mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Plan Your Empire, Day by Day
          </h1>
          <div className="w-24 h-px bg-[#4C4B4B] mx-auto mb-8" />
          <p 
            className="text-lg font-light text-white max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
          >
            A visual flow for building consistency and confidence. Your content calendar becomes your strategic advantage.
          </p>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-[#F1F1F1] text-center">
        <div className="container mx-auto px-4">
          <h2 
            className="text-4xl font-normal italic text-[#171719] mb-8"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Consistency is your new superpower.
          </h2>
          <div className="w-32 h-px bg-[#4C4B4B] mx-auto" />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Calendar Widget */}
            <Card className="bg-white border border-[#B5B5B3] shadow-sm">
              <CardHeader className="text-center pb-8">
                <CardTitle 
                  className="text-3xl font-normal text-[#171719] mb-4"
                  style={{ fontFamily: 'Cormorant Garamond, serif' }}
                >
                  Select Date
                </CardTitle>
                <div className="w-16 h-px bg-[#4C4B4B] mx-auto" />
              </CardHeader>
              <CardContent className="flex justify-center p-8">
                <UICalendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-none border-0"
                />
              </CardContent>
            </Card>

            {/* Add Entry Card */}
            <Card className="bg-white border border-[#B5B5B3] shadow-sm">
              <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                  <CardTitle 
                    className="text-3xl font-normal text-[#171719]"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    Quick Actions
                  </CardTitle>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="px-8 py-3 text-sm font-medium uppercase tracking-wide"
                        style={{ 
                          backgroundColor: '#171719',
                          color: '#F1F1F1',
                          border: '2px solid #171719',
                          borderRadius: '0px',
                          fontFamily: 'Neue Einstellung, sans-serif',
                          letterSpacing: '0.5px'
                        }}
                      >
                        ADD CONTENT
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-white">
                      <DialogHeader>
                        <DialogTitle 
                          className="text-xl font-normal text-[#171719]"
                          style={{ fontFamily: 'Cormorant Garamond, serif' }}
                        >
                          Add New Entry
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div>
                          <Label 
                            htmlFor="day" 
                            className="text-sm font-medium text-[#171719]"
                            style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                          >
                            Day
                          </Label>
                          <Select value={newEntry.day} onValueChange={(value) => setNewEntry({...newEntry, day: value})}>
                            <SelectTrigger className="mt-2 bg-transparent border border-[#B5B5B3] text-[#171719]">
                              <SelectValue placeholder="Select day..." />
                            </SelectTrigger>
                            <SelectContent>
                              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                <SelectItem key={day} value={day}>{day}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label 
                            htmlFor="content" 
                            className="text-sm font-medium text-[#171719]"
                            style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                          >
                            Content
                          </Label>
                          <Textarea
                            id="content"
                            placeholder="What will you post?"
                            value={newEntry.contentText}
                            onChange={(e) => setNewEntry({...newEntry, contentText: e.target.value})}
                            rows={3}
                            className="mt-2 border border-[#B5B5B3] bg-transparent text-[#171719]"
                          />
                        </div>

                        <div>
                          <Label 
                            htmlFor="hook" 
                            className="text-sm font-medium text-[#171719]"
                            style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                          >
                            Hook (Optional)
                          </Label>
                          <Input
                            id="hook"
                            placeholder="Compelling hook..."
                            value={newEntry.hookText}
                            onChange={(e) => setNewEntry({...newEntry, hookText: e.target.value})}
                            className="mt-2 border border-[#B5B5B3] bg-transparent text-[#171719]"
                          />
                        </div>

                        <div>
                          <Label 
                            htmlFor="hashtags" 
                            className="text-sm font-medium text-[#171719]"
                            style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                          >
                            Hashtags (Optional)
                          </Label>
                          <Input
                            id="hashtags"
                            placeholder="#hashtags #here"
                            value={newEntry.hashtags}
                            onChange={(e) => setNewEntry({...newEntry, hashtags: e.target.value})}
                            className="mt-2 border border-[#B5B5B3] bg-transparent text-[#171719]"
                          />
                        </div>

                        <div className="flex gap-3">
                          <Button 
                            onClick={addCalendarEntry} 
                            className="flex-1 px-6 py-3 text-sm font-medium uppercase tracking-wide"
                            style={{ 
                              backgroundColor: '#171719',
                              color: '#F1F1F1',
                              border: '2px solid #171719',
                              borderRadius: '0px',
                              fontFamily: 'Neue Einstellung, sans-serif',
                              letterSpacing: '0.5px'
                            }}
                          >
                            ADD ENTRY
                          </Button>
                          <Button 
                            onClick={() => setIsDialogOpen(false)}
                            className="px-6 py-3 text-sm font-medium uppercase tracking-wide"
                            style={{ 
                              backgroundColor: 'transparent',
                              color: '#171719',
                              border: '2px solid #171719',
                              borderRadius: '0px',
                              fontFamily: 'Neue Einstellung, sans-serif',
                              letterSpacing: '0.5px'
                            }}
                          >
                            CANCEL
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <p 
                    className="text-[#4C4B4B] font-light leading-relaxed"
                    style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                  >
                    Use the button above to add new content to your calendar
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Weekly Content Grid */}
      {Object.keys(groupedEntries).length > 0 && (
        <section className="py-20 px-4" style={{ backgroundColor: '#171719' }}>
          <div className="container mx-auto">
            <div className="text-center mb-20">
              <h2 
                className="text-4xl font-normal text-white mb-8"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                Your Content Week
              </h2>
              <div className="w-32 h-px bg-[#4C4B4B] mx-auto mb-8" />
              <p 
                className="text-lg font-light text-white max-w-2xl mx-auto leading-relaxed"
                style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
              >
                Your weekly editorial calendar, designed for strategic consistency.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <Card 
                  key={day} 
                  className="border-0 shadow-lg transition-transform duration-300 hover:scale-102 hover:shadow-xl" 
                  style={{ backgroundColor: '#F1F1F1' }}
                >
                  <CardHeader className="pb-4">
                    <CardTitle 
                      className="text-xl text-center uppercase tracking-wide text-[#171719]"
                      style={{ fontFamily: 'Cormorant Garamond, serif' }}
                    >
                      {day}
                    </CardTitle>
                    <div className="w-16 h-px bg-[#4C4B4B] mx-auto" />
                  </CardHeader>
                  <CardContent>
                    {groupedEntries[day] ? (
                      <div className="space-y-4">
                        {groupedEntries[day].map((entry) => (
                          <div 
                            key={entry.id} 
                            className="p-4" 
                            style={{ backgroundColor: '#B5B5B3' }}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <Button
                                onClick={() => deleteEntry(entry.id)}
                                className="text-[#4C4B4B] hover:text-[#171719] h-auto p-1 bg-transparent"
                                style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                              >
                                ×
                              </Button>
                            </div>
                            <p 
                              className="text-sm leading-relaxed mb-3 text-[#171719]"
                              style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                            >
                              {entry.contentText}
                            </p>
                            {entry.hookText && (
                              <p 
                                className="text-xs font-medium italic mb-2 text-[#171719]"
                                style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                              >
                                Hook: {entry.hookText}
                              </p>
                            )}
                            {entry.hashtags && (
                              <p 
                                className="text-xs text-[#4C4B4B]"
                                style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                              >
                                {entry.hashtags}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p 
                          className="text-sm text-[#4C4B4B] font-light"
                          style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
                        >
                          No content planned
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {Object.keys(groupedEntries).length === 0 && (
        <section className="py-20 px-4 bg-[#F1F1F1] text-center">
          <div className="container mx-auto">
            <h3 
              className="text-4xl font-normal text-[#171719] mb-8"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              Your Calendar Awaits
            </h3>
            <div className="w-32 h-px bg-[#4C4B4B] mx-auto mb-8" />
            <p 
              className="text-lg text-[#4C4B4B] max-w-lg mx-auto mb-12 leading-relaxed"
              style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
            >
              Start planning your content strategy by adding your first entry above. Your future self will thank you.
            </p>
            <div className="mt-12">
              <p 
                className="text-sm italic text-[#4C4B4B]"
                style={{ fontFamily: 'Neue Einstellung, sans-serif' }}
              >
                Build your empire, one post at a time
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
