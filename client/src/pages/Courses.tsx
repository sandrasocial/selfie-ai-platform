import React from 'react';
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Course {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  route: string;
  salesRoute?: string;
}

interface UserAccess {
  starterKit: boolean;
  brandedBySelfie: boolean;
  vipEmpireBuilder: boolean;
}

interface CourseProgress {
  starterKit: number;
  brandedBySelfie: number;
  vipEmpireBuilder: number;
}

export default function Courses() {
  const { data: user } = useQuery({ queryKey: ["/api/me"], retry: false });
  const { data: userAccess } = useQuery<UserAccess>({ queryKey: ["/api/user-access"], enabled: !!user, retry: false });
  const { data: courseProgress } = useQuery<CourseProgress>({ queryKey: ["/api/course-progress"], enabled: !!user, retry: false });

  const courses: Course[] = [
    {
      id: 'starterKit',
      title: 'Selfie Starter Kit',
      subtitle: 'Master the fundamentals of personal branding through authentic selfie content',
      image: 'https://i.postimg.cc/bwYKyKCW/122.png',
      route: '/courses/starter-kit',
      salesRoute: '/products/selfie-starter-kit'
    },
    {
      id: 'brandedBySelfie',
      title: 'Branded by Selfie™',
      subtitle: 'Transform your personal brand into a powerful business asset',
      image: 'https://i.postimg.cc/nhDpf8Xx/35.png',
      route: '/courses/branded',
      salesRoute: '/products/branded-by-selfie'
    },
    {
      id: 'vipEmpireBuilder',
      title: 'VIP Empire Builder',
      subtitle: 'Elite masterclass for building a multi-figure personal brand empire',
      image: 'https://i.postimg.cc/4dBPJ9Cj/95.png',
      route: '/courses/vip',
      salesRoute: '/vip/apply'
    }
  ];

  const hasAccess = (id: string) => userAccess && userAccess[id as keyof UserAccess];
  const getProgress = (id: string) => (courseProgress ? courseProgress[id as keyof CourseProgress] || 0 : 0);

  return (
    <div className="min-h-screen bg-[#F1F1F1] text-[#171719] font-inter">
      <Header user={user} />

      <section className="py-24 px-6 text-center">
        <h1 className="text-[64px] font-['Cormorant Garamond'] leading-tight mb-6">Your Brand Training</h1>
        <div className="h-[2px] w-24 bg-[#171719] mx-auto mb-6"></div>
        <p className="text-[18px] italic max-w-2xl mx-auto text-[#4C4B4B]">
          Learn how to turn your face, voice, and vibe into a digital empire.
        </p>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map(course => {
            const access = hasAccess(course.id);
            const progress = getProgress(course.id);
            return (
              <Card key={course.id} className="bg-white border border-[#B5B5B3]">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className={`w-full h-full object-cover transition duration-300 ${!access ? 'grayscale opacity-50' : ''}`}
                  />

                  {access && progress > 0 && (
                    <div className="absolute bottom-0 w-full">
                      <Progress value={progress} className="h-1 bg-black/20" />
                    </div>
                  )}
                </div>

                <CardContent className="p-6 space-y-4">
                  <h3 className="text-[24px] font-['Cormorant Garamond'] leading-snug">{course.title}</h3>
                  <p className="text-[14px] text-[#4C4B4B] leading-relaxed">
                    {course.subtitle}
                  </p>
                  {access && progress > 0 && (
                    <p className="text-[12px] text-[#4C4B4B] italic">{progress}% complete</p>
                  )}

                  <Link href={access ? course.route : (course.salesRoute || '#')}>
                    <Button
                      variant="outline"
                      className="w-full border border-black text-black bg-transparent uppercase tracking-[0.5px] text-[14px] py-3"
                    >
                      {access ? 'ACCESS' : 'UNLOCK'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}