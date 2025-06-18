import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Download, FileText, Loader2, Clock, CheckCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

interface PDFTemplate {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const pdfTemplates: PDFTemplate[] = [
  {
    type: 'blueprint',
    title: 'Brand Blueprint',
    description: 'Complete brand strategy and positioning guide',
    icon: <FileText className="h-5 w-5" />
  },
  {
    type: 'caption',
    title: 'Caption Strategy',
    description: 'Social media caption templates and strategies',
    icon: <FileText className="h-5 w-5" />
  },
  {
    type: 'editing',
    title: 'Editing Routine',
    description: 'Photo editing workflow and techniques',
    icon: <FileText className="h-5 w-5" />
  },
  {
    type: 'design',
    title: 'Design CEO Guide',
    description: 'Design leadership and visual strategy',
    icon: <FileText className="h-5 w-5" />
  }
];

interface PDFGeneratorProps {
  className?: string;
}

export function PDFGenerator({ className }: PDFGeneratorProps) {
  const [generatingPdfs, setGeneratingPdfs] = useState<Set<string>>(new Set());

  // Fetch PDF history
  const { data: pdfHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['/api/pdf-history'],
    retry: false
  });

  const generatePDF = async (templateType: string, templateTitle: string) => {
    setGeneratingPdfs(prev => new Set(prev).add(templateType));

    try {
      const response = await fetch(`/api/generate-pdf/${templateType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "PDF Generated Successfully",
          description: `Your ${templateTitle} has been generated and is ready for download.`,
        });

        // Refresh history to show new PDF
        refetchHistory();

        // If downloadUrl is provided, open it in a new tab
        if (data.downloadUrl) {
          window.open(data.downloadUrl, '_blank');
        }
      } else {
        throw new Error(data.error || 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Generation Failed",
        description: `Failed to generate ${templateTitle}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setGeneratingPdfs(prev => {
        const updated = new Set(prev);
        updated.delete(templateType);
        return updated;
      });
    }
  };

  const recentPdfs = pdfHistory?.pdfs?.slice(0, 3) || [];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* PDF Generation Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pdfTemplates.map((template) => (
          <Card key={template.type} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {template.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => generatePDF(template.type, template.title)}
                disabled={generatingPdfs.has(template.type)}
                className="w-full"
                variant="outline"
              >
                {generatingPdfs.has(template.type) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate PDF
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PDF History Section */}
      {recentPdfs.length > 0 && (
        <>
          <Separator className="my-6" />
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent PDFs
            </h3>
            <div className="space-y-3">
              {recentPdfs.map((pdf: any) => (
                <Card key={pdf.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <div>
                        <p className="font-medium">{pdf.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Generated {new Date(pdf.generatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!pdf.pdfUrl}
                      onClick={() => pdf.pdfUrl && window.open(pdf.pdfUrl, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      {pdf.pdfUrl ? 'Download' : 'Processing'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}