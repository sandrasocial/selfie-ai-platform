import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar, FileText } from 'lucide-react';
import Header from '@/components/layout/Header';

const fetchUserWorkbooks = async () => {
  const response = await fetch('/api/workbooks/user');
  if (!response.ok) {
    throw new Error('Failed to fetch workbooks');
  }
  return response.json();
};

const MyWorkbooks = () => {
  const { data: workbooks, isLoading, error } = useQuery({
    queryKey: ['workbooks'],
    queryFn: fetchUserWorkbooks
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-24">
          <div className="text-center px-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#171719] mx-auto mb-4"></div>
            <p className="text-[#4C4B4B] font-light">Loading your workbooks...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl mb-6">Your Workbooks</h1>
            <p className="text-[#4C4B4B] font-light">Unable to load workbooks. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="page-container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl lg:text-6xl font-normal text-[#171719] mb-4">
            Your Workbooks
          </h1>
          <p className="text-lg sm:text-xl text-[#4C4B4B] font-light max-w-2xl mx-auto">
            All your personalized AI-generated workbooks in one place
          </p>
        </div>

        {!workbooks || !Array.isArray(workbooks) || workbooks.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-[#B5B5B3] mx-auto mb-6" />
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl text-[#171719] mb-4">
              No Workbooks Yet
            </h2>
            <p className="text-[#4C4B4B] font-light mb-8 max-w-md mx-auto">
              Complete course modules and generate personalized workbooks to see them here.
            </p>
            <Button 
              onClick={() => window.location.href = '/courses/starter-kit'}
              className="bg-[#171719] text-white hover:bg-[#2A2A2A] focus:bg-[#2A2A2A] border-0 px-8 py-4 text-lg uppercase tracking-wider"
            >
              Start Learning
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(workbooks || []).map((workbook: any) => (
              <Card key={workbook.id} className="workbook-card border border-[#B5B5B3] hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h2 className="font-['Cormorant_Garamond'] text-xl sm:text-2xl text-[#171719] mb-2">
                      {workbook.title}
                    </h2>
                    <div className="flex items-center text-[#4C4B4B] text-sm font-light mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(workbook.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    {workbook.moduleId && (
                      <span className="inline-block bg-[#F1F1F1] text-[#4C4B4B] text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                        {workbook.moduleId.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={() => window.open(workbook.downloadUrl || '#', '_blank')}
                      disabled={!workbook.downloadUrl}
                      className="button-outline w-full bg-transparent border-2 border-[#171719] text-[#171719] hover:bg-[#171719] hover:text-white focus:bg-[#171719] focus:text-white py-3 text-sm uppercase tracking-wider transition-all"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {workbook.downloadUrl ? 'View Workbook' : 'Processing...'}
                    </Button>
                    
                    {workbook.status && (
                      <div className="text-center text-xs text-[#B5B5B3] uppercase tracking-wider">
                        Status: {workbook.status}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWorkbooks;