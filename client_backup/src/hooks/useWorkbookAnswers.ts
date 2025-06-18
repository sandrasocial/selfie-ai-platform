import { useState, useEffect } from 'react';
import { SupabaseService } from '@/lib/supabaseService';
import { useToast } from '@/hooks/use-toast';

export function useWorkbookAnswers(userId: string, moduleId?: string) {
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadAnswers();
      if (moduleId) {
        loadProgress();
      }
    }
  }, [userId, moduleId]);

  const loadAnswers = async () => {
    try {
      const data = await SupabaseService.getWorkbookAnswers(userId, moduleId);
      setAnswers(data || []);
    } catch (error: any) {
      console.error('Error loading workbook answers:', error);
      toast({
        title: "Load Failed",
        description: "Unable to load your answers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    if (!moduleId) return;
    
    try {
      const progressCount = await SupabaseService.getModuleProgress(userId, moduleId);
      setProgress(progressCount);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveAnswer = async (questionId: string, answer: string) => {
    if (!moduleId) return;

    try {
      const savedAnswer = await SupabaseService.saveWorkbookAnswer({
        user_id: userId,
        module_id: moduleId,
        question_id: questionId,
        answer
      });

      // Update local state
      setAnswers(prev => {
        const filtered = prev.filter(a => a.question_id !== questionId);
        return [...filtered, savedAnswer];
      });

      await loadProgress(); // Refresh progress count

      toast({
        title: "Answer Saved",
        description: "Your response has been saved",
      });

      return savedAnswer;
    } catch (error: any) {
      console.error('Error saving answer:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save your answer",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getAnswer = (questionId: string) => {
    return answers.find(a => a.question_id === questionId)?.answer || '';
  };

  const getAllAnswersForModule = (targetModuleId: string) => {
    return answers.filter(a => a.module_id === targetModuleId);
  };

  return {
    answers,
    loading,
    progress,
    saveAnswer,
    getAnswer,
    getAllAnswersForModule,
    refreshAnswers: loadAnswers
  };
}