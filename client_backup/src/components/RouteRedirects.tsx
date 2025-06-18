
import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function RouteRedirects() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Redirect table for removed/deprecated routes
    const redirects: Record<string, string> = {
      '/prelaunch': '/dashboard',
      '/supabase-test': '/dashboard',
      '/photo-upload': '/studio/photo-vault',
      '/logout-test': '/dashboard',
      '/vip/apply': '/products/vip',
      '/weekly-planner': '/planner',
      '/workbook': '/studio/notes',
      '/courses/branded-by-selfie': '/courses/branded',
      '/module2': '/module/2',
      '/blueprint/module-two': '/module/2',
      '/course/starter-kit': '/courses/starter-kit',
      '/course/branded-by-selfie': '/courses/branded',
      '/guide/selfie-ultimate': '/freebie/selfie-guide',
    };

    if (redirects[location]) {
      setLocation(redirects[location]);
    }
  }, [location, setLocation]);

  return null;
}
