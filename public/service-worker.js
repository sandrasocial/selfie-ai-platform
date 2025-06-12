const CACHE_NAME = 'selfie-ai-v1.0.0';
const STATIC_CACHE = 'selfie-ai-static-v1.0.0';
const DYNAMIC_CACHE = 'selfie-ai-dynamic-v1.0.0';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/sandra/daily-quote',
  '/api/me',
  '/api/subscription',
  '/api/tool-access'
];

// Course content cache patterns
const COURSE_CACHE_PATTERNS = [
  '/api/course-content/',
  '/api/course-progress/'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle different types of requests with appropriate caching strategies
  if (isStaticAsset(url.pathname)) {
    // Cache First for static assets
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(url.pathname)) {
    // Network First with cache fallback for API requests
    event.respondWith(networkFirstWithCache(request));
  } else if (isCourseContent(url.pathname)) {
    // Stale While Revalidate for course content
    event.respondWith(staleWhileRevalidate(request));
  } else {
    // Network First for navigation requests
    event.respondWith(networkFirstNavigation(request));
  }
});

// Message event - handle cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_COURSE_CONTENT') {
    cacheUserCourseContent(event.data.userId);
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearAllCaches();
  }
});

// Caching strategies
async function cacheFirst(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache First strategy failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirstWithCache(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', request.url);
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'This feature requires an internet connection'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

async function networkFirstNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Return offline page for navigation requests
    const cache = await caches.open(STATIC_CACHE);
    const offlineResponse = await cache.match('/offline.html');
    return offlineResponse || new Response('Offline', { status: 503 });
  }
}

// Helper functions
function isStaticAsset(pathname) {
  return pathname.includes('/icons/') || 
         pathname.includes('/assets/') || 
         pathname.endsWith('.png') || 
         pathname.endsWith('.jpg') || 
         pathname.endsWith('.svg') || 
         pathname.endsWith('.css') || 
         pathname.endsWith('.js');
}

function isAPIRequest(pathname) {
  return API_CACHE_PATTERNS.some(pattern => pathname.includes(pattern));
}

function isCourseContent(pathname) {
  return COURSE_CACHE_PATTERNS.some(pattern => pathname.includes(pattern));
}

// Cache user-specific course content for offline access
async function cacheUserCourseContent(userId) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    // Cache user's course progress
    const progressUrl = `/api/course-progress/starter-kit?userId=${userId}`;
    const progressResponse = await fetch(progressUrl);
    if (progressResponse.ok) {
      cache.put(progressUrl, progressResponse.clone());
    }
    
    // Cache course content
    const contentUrl = `/api/course-content/starter-kit?userId=${userId}`;
    const contentResponse = await fetch(contentUrl);
    if (contentResponse.ok) {
      cache.put(contentUrl, contentResponse.clone());
    }
    
    console.log('Course content cached for offline access');
  } catch (error) {
    console.error('Failed to cache course content:', error);
  }
}

// Clear all caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('All caches cleared');
  } catch (error) {
    console.error('Failed to clear caches:', error);
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'course-progress-sync') {
    event.waitUntil(syncCourseProgress());
  }
  
  if (event.tag === 'content-generation-sync') {
    event.waitUntil(syncContentGeneration());
  }
});

// Sync course progress when back online
async function syncCourseProgress() {
  try {
    // Get pending progress updates from IndexedDB
    const pendingUpdates = await getPendingProgressUpdates();
    
    for (const update of pendingUpdates) {
      await fetch('/api/course-progress/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update)
      });
    }
    
    // Clear pending updates
    await clearPendingProgressUpdates();
    console.log('Course progress synced');
  } catch (error) {
    console.error('Failed to sync course progress:', error);
  }
}

// Sync content generation when back online
async function syncContentGeneration() {
  try {
    // Implementation for syncing AI-generated content
    console.log('Content generation sync completed');
  } catch (error) {
    console.error('Failed to sync content generation:', error);
  }
}

// IndexedDB helpers (simplified for demonstration)
async function getPendingProgressUpdates() {
  // Implementation would use IndexedDB to get pending updates
  return [];
}

async function clearPendingProgressUpdates() {
  // Implementation would clear pending updates from IndexedDB
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: data.data,
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/dashboard';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});