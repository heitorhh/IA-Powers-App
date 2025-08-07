"use client"

import { useState, useEffect, useCallback } from 'react'

export interface NotificationData {
  id: string
  title: string
  body: string
  type: 'message' | 'task' | 'reminder' | 'system'
  priority: 'low' | 'medium' | 'high'
  timestamp: string
  read: boolean
  data?: any
  actions?: Array<{
    action: string
    title: string
  }>
}

export interface NotificationSettings {
  enabled: boolean
  whatsapp: boolean
  tasks: boolean
  reminders: boolean
  system: boolean
  sound: boolean
  vibration: boolean
  desktop: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    whatsapp: true,
    tasks: true,
    reminders: true,
    system: true,
    sound: true,
    vibration: true,
    desktop: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  })
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  // Check if notifications are supported
  useEffect(() => {
    setIsSupported('Notification' in window && 'serviceWorker' in navigator)
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notification-settings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Error loading notification settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    localStorage.setItem('notification-settings', JSON.stringify(updatedSettings))
  }, [settings])

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }, [isSupported])

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return null

    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', registration)
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return null
    }
  }, [])

  // Check if in quiet hours
  const isInQuietHours = useCallback(() => {
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

  // Show notification
  const showNotification = useCallback(async (data: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => {
    if (!settings.enabled || isInQuietHours()) return

    // Check type-specific settings
    if (data.type === 'message' && !settings.whatsapp) return
    if (data.type === 'task' && !settings.tasks) return
    if (data.type === 'reminder' && !settings.reminders) return
    if (data.type === 'system' && !settings.system) return

    const notification: NotificationData = {
      ...data,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    }

    // Add to notifications list
    setNotifications(prev => [notification, ...prev.slice(0, 49)]) // Keep only last 50

    // Show desktop notification if permission granted
    if (permission === 'granted' && settings.desktop) {
      try {
        const registration = await navigator.serviceWorker.ready
        
        await registration.showNotification(data.title, {
          body: data.body,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          tag: notification.id,
          vibrate: settings.vibration ? [100, 50, 100] : undefined,
          silent: !settings.sound,
          data: {
            ...data.data,
            notificationId: notification.id,
            type: data.type
          },
          actions: data.actions || [
            {
              action: 'view',
              title: 'Ver'
            },
            {
              action: 'dismiss',
              title: 'Dispensar'
            }
          ]
        })
      } catch (error) {
        console.error('Error showing notification:', error)
        
        // Fallback to browser notification
        if (Notification.permission === 'granted') {
          new Notification(data.title, {
            body: data.body,
            icon: '/icon-192x192.png'
          })
        }
      }
    }

    return notification
  }, [settings, permission, isInQuietHours])

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }, [])

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    settings,
    permission,
    isSupported,
    unreadCount,
    updateSettings,
    requestPermission,
    registerServiceWorker,
    showNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  }
}
