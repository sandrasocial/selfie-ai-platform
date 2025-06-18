
import { ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CourseLayoutProps {
  children: ReactNode;
  courseName: string;
  courseType: "STARTER COURSE" | "PREMIUM COURSE";
  upgradeUrl?: string;
  upgradeText?: string;
}

export function CourseLayout({ 
  children, 
  courseName, 
  courseType, 
  upgradeUrl, 
  upgradeText 
}: CourseLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F1F1F1] font-light">
      {/* Navigation */}
      <nav className="px-6 py-4 bg-[#F1F1F1] border-b border-[#B5B5B3]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <div className="text-xl text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>
              SELFIE AI™
            </div>
          </Link>
          {upgradeUrl && upgradeText && (
            <Link href={upgradeUrl}>
              <Button className="bg-[#171719] text-white hover:bg-[#4C4B4B] border-0 px-6 py-2 font-light text-sm">
                {upgradeText}
              </Button>
            </Link>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Badge className="bg-[#171719] text-white px-4 py-2 font-light border-0">
              {courseType}
            </Badge>
          </div>
          <h1 className="text-5xl lg:text-6xl mb-6 text-[#171719]" style={{ fontFamily: 'Cormorant Garamond' }}>
            {courseName}
          </h1>
        </div>

        {children}
      </div>
    </div>
  );
}
