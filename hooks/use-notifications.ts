'use client'

import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'whatsapp' | 'tasks' | 'meetings' | 'system' | 'reminder'
  priority: 'low' | 'medium' | 'high'
  timestamp: Date
  read: boolean
  actions?: NotificationAction[]
}

export interface NotificationAction {
  id: string
  label: string
  action: () => void
}

export interface NotificationSettings {
  enabled: boolean
  sound: boolean
  vibration: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  types: {
    whatsapp: boolean
    tasks: boolean
    meetings: boolean
    system: boolean
    reminder: boolean
  }
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  sound: true,
  vibration: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  },
  types: {
    whatsapp: true,
    tasks: true,
    meetings: true,
    system: true,
    reminder: true
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  // Initialize notifications
  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }

    // Register service worker with proper error handling
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      // Check if sw.js exists before registering
      fetch('/sw.js', { method: 'HEAD' })
        .then(response => {
          if (response.ok && response.headers.get('content-type')?.includes('javascript')) {
            return navigator.serviceWorker.register('/sw.js', {
              scope: '/',
              updateViaCache: 'none'
            })
          } else {
            console.log('Service Worker not available or invalid MIME type')
            return null
          }
        })
        .then((registration) => {
          if (registration) {
            console.log('Service Worker registered successfully:', registration)
          }
        })
        .catch((error) => {
          console.log('Service Worker registration skipped:', error.message)
          // Don't throw error, just log it
        })
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notification-settings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Error parsing notification settings:', error)
      }
    }

    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('notifications')
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications)
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })))
      } catch (error) {
        console.error('Error parsing notifications:', error)
      }
    }
  }, [])

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('notification-settings', JSON.stringify(settings))
  }, [settings])

  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      return permission
    }
    return 'denied'
  }, [])

  const isQuietHours = useCallback(() => {
    if (!settings.quietHours.enabled) return false
    
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    const [startHour, startMin] = settings.quietHours.start.split(':').map(Number)
    const [endHour, endMin] = settings.quietHours.end.split(':').map(Number)
    
    const startTime = startHour * 60 + startMin
    const endTime = endHour * 60 + endMin
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime
    } else {
      return currentTime >= startTime || currentTime <= endTime
    }
  }, [settings.quietHours])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }

    // Check if notifications are enabled for this type
    if (!settings.enabled || !settings.types[notification.type]) {
      return
    }

    // Check quiet hours
    if (isQuietHours() && notification.priority !== 'high') {
      return
    }

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]) // Keep only 50 notifications

    // Show browser notification
    if (permission === 'granted' && settings.enabled) {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/placeholder.svg?height=64&width=64',
        badge: '/placeholder.svg?height=32&width=32',
        vibrate: settings.vibration ? [100, 50, 100] : undefined,
        silent: !settings.sound,
        tag: notification.type,
        requireInteraction: notification.priority === 'high'
      })

      browserNotification.onclick = () => {
        window.focus()
        browserNotification.close()
        markAsRead(newNotification.id)
      }

      // Auto close after 5 seconds for non-high priority
      if (notification.priority !== 'high') {
        setTimeout(() => {
          browserNotification.close()
        }, 5000)
      }
    }

    // Show toast notification
    const toastOptions = {
      duration: notification.priority === 'high' ? 8000 : 4000,
      position: 'top-right' as const,
      style: {
        background: notification.priority === 'high' ? '#ef4444' : 
                   notification.priority === 'medium' ? '#f59e0b' : '#10b981',
        color: 'white'
      }
    }

    toast(notification.message, toastOptions)
  }, [settings, permission, isQuietHours])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    settings,
    permission,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    updateSettings,
    requestPermission
  }
}
