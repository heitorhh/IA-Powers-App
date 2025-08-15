// Service Worker for IA Powers
const CACHE_NAME = 'iapowers-v1.0.0'
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json'
]

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching essential resources')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        console.log('Service Worker installed successfully')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker installation failed:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker activated successfully')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response
            const responseToCache = response.clone()

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })

            return response
          })
          .catch((error) => {
            console.log('Fetch failed, serving offline page:', error)
            // You could return a custom offline page here
            return new Response('Offline - Please check your connection', {
              status: 503,
              statusText: 'Service Unavailable'
            })
          })
      })
  )
})

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  let notificationData = {
    title: 'IA Powers',
    body: 'Nova notificação disponível',
    icon: '/placeholder.svg?height=192&width=192',
    badge: '/placeholder.svg?height=72&width=72',
    tag: 'default',
    requireInteraction: false,
    vibrate: [100, 50, 100],
    data: {
      url: '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/placeholder.svg?height=32&width=32'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/placeholder.svg?height=32&width=32'
      }
    ]
  }

  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json()
      notificationData = { ...notificationData, ...pushData }
    } catch (error) {
      console.error('Error parsing push data:', error)
      notificationData.body = event.data.text() || notificationData.body
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
      .then(() => {
        console.log('Notification shown successfully')
      })
      .catch((error) => {
        console.error('Error showing notification:', error)
      })
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()

  const action = event.action
  const notificationData = event.notification.data || {}
  
  if (action === 'close') {
    return
  }

  // Default action or 'open' action
  const urlToOpen = notificationData.url || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        
        // If no existing window/tab, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
      .catch((error) => {
        console.error('Error handling notification click:', error)
      })
  )
})

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timestamp: Date.now(),
          type: 'background-sync'
        })
      })
      .then((response) => {
        if (response.ok) {
          console.log('Background sync completed successfully')
        } else {
          console.error('Background sync failed:', response.status)
        }
      })
      .catch((error) => {
        console.error('Background sync error:', error)
      })
    )
  }
})

// Handle service worker errors
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error)
})

// Handle unhandled promise rejections
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled promise rejection:', event.reason)
})

console.log('Service Worker script loaded successfully')
