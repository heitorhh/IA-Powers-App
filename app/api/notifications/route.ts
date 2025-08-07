import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo (use database in production)
let notifications: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Filter by user if provided
    let userNotifications = notifications
    if (userId) {
      userNotifications = notifications.filter(n => n.userId === userId)
    }

    // Sort by timestamp (newest first)
    userNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Apply pagination
    const paginatedNotifications = userNotifications.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      notifications: paginatedNotifications,
      total: userNotifications.length,
      unread: userNotifications.filter(n => !n.read).length
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: body.title || 'Nova notificação',
      body: body.body || '',
      type: body.type || 'system',
      priority: body.priority || 'medium',
      userId: body.userId,
      timestamp: new Date().toISOString(),
      read: false,
      data: body.data || {},
      actions: body.actions || []
    }

    notifications.unshift(notification)

    // Keep only last 1000 notifications
    if (notifications.length > 1000) {
      notifications = notifications.slice(0, 1000)
    }

    // Here you could trigger push notification to user's devices
    // await sendPushNotification(notification)

    return NextResponse.json({
      success: true,
      notification
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, read, action } = body

    if (action === 'markAllRead') {
      const userId = body.userId
      notifications = notifications.map(n => 
        (!userId || n.userId === userId) ? { ...n, read: true } : n
      )
      
      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      })
    }

    const notificationIndex = notifications.findIndex(n => n.id === id)
    if (notificationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      )
    }

    notifications[notificationIndex] = {
      ...notifications[notificationIndex],
      read: read !== undefined ? read : notifications[notificationIndex].read
    }

    return NextResponse.json({
      success: true,
      notification: notifications[notificationIndex]
    })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const action = searchParams.get('action')

    if (action === 'clearAll') {
      const userId = searchParams.get('userId')
      if (userId) {
        notifications = notifications.filter(n => n.userId !== userId)
      } else {
        notifications = []
      }
      
      return NextResponse.json({
        success: true,
        message: 'All notifications cleared'
      })
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Notification ID required' },
        { status: 400 }
      )
    }

    const initialLength = notifications.length
    notifications = notifications.filter(n => n.id !== id)

    if (notifications.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Notification deleted'
    })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
}
