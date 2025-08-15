import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simulate fetching notifications from database
    const notifications = [
      {
        id: '1',
        title: 'Nova mensagem WhatsApp',
        message: 'Cliente ABC enviou uma mensagem',
        type: 'whatsapp',
        priority: 'medium',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        title: 'Tarefa vencendo',
        message: 'Revisar proposta comercial vence em 2 horas',
        type: 'tasks',
        priority: 'high',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false
      }
    ]

    return NextResponse.json({
      success: true,
      notifications
    })
  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, notificationId, settings } = body

    switch (action) {
      case 'markAsRead':
        // Simulate marking notification as read
        console.log(`Marking notification ${notificationId} as read`)
        return NextResponse.json({
          success: true,
          message: 'Notificação marcada como lida'
        })

      case 'updateSettings':
        // Simulate updating notification settings
        console.log('Updating notification settings:', settings)
        return NextResponse.json({
          success: true,
          message: 'Configurações atualizadas'
        })

      case 'clearAll':
        // Simulate clearing all notifications
        console.log('Clearing all notifications')
        return NextResponse.json({
          success: true,
          message: 'Todas as notificações foram removidas'
        })

      default:
        return NextResponse.json({
          success: false,
          message: 'Ação não reconhecida'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Erro na API de notificações:', error)
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 })
  }
}
