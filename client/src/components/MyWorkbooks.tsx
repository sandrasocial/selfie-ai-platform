import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar, BookOpen } from "lucide-react";
import { format } from "date-fns";
import type { Workbook } from "@shared/schema";

export function MyWorkbooks() {
  const { data: workbooks = [], isLoading } = useQuery<Workbook[]>({
    queryKey: ["/api/workbooks"],
  });

  const handleDownloadPDF = async (workbookId: number, title: string) => {
    try {
      const response = await fetch(`/api/workbook/${workbookId}/pdf`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-[#3C3A35]" />
          <h2 className="text-2xl font-bold text-[#3C3A35]" style={{ fontFamily: 'Prata, serif' }}>
            My Framework Workbooks
          </h2>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (workbooks.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Workbooks Yet</h3>
        <p className="text-gray-500 mb-6">
          Complete the framework mastery exercises in any module to create your first personalized workbook.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-[#3C3A35]" />
        <h2 className="text-2xl font-bold text-[#3C3A35]" style={{ fontFamily: 'Prata, serif' }}>
          My Framework Workbooks
        </h2>
      </div>
      
      <div className="grid gap-4">
        {workbooks.map((workbook) => (
          <Card key={workbook.id} className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-[#3C3A35] mb-1">
                    {workbook.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    Module {workbook.moduleId}: {workbook.moduleTitle}
                  </CardDescription>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('PDF download is being improved! Your workbook content is perfectly saved and viewable here.');
                  }}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-[#3C3A35] hover:text-white transition-colors"
                  disabled
                >
                  <Download className="w-4 h-4" />
                  PDF Coming Soon
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {workbook.personalizedStrategy.substring(0, 120)}...
                </p>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    Created {format(new Date(workbook.createdAt!), "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{Array.isArray(workbook.actionItems) ? workbook.actionItems.length : 0} Action Items</span>
                      <span>{Array.isArray(workbook.customFrameworks) ? workbook.customFrameworks.length : 0} Frameworks</span>
                    </div>
                    <Button
                      onClick={() => {
                        window.location.href = `/workbook?id=${workbook.id}`;
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-[#3C3A35] hover:bg-[#3C3A35] hover:text-white"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Full Workbook
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}