// agent/authMap.ts
export const routeAuthMap: Record<string, 'public' | 'user' | 'admin'> = {
  '/': 'public',
  '/login': 'public',
  '/dashboard': 'user',
  '/admin': 'admin',
  // Add more as needed
};
