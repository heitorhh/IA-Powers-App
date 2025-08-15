import { NextRequest, NextResponse } from 'next/server'
import { whatsappCompanion } from '@/lib/whatsapp-ai-companion'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, message, personality, delay } = body

    switch (action) {
      case 'activate':
        whatsappCompanion.activate()
        return NextResponse.json({ 
          success: true, 
          message: 'Companion ativado',
          personality: whatsappCompanion.getCurrentPersonality()
        })

      case 'deactivate':
        whatsappCompanion.deactivate()
        return NextResponse.json({ 
          success: true, 
          message: 'Companion desativado' 
        })

      case 'setPersonality':
        if (personality) {
          whatsappCompanion.setPersonality(personality)
          return NextResponse.json({ 
            success: true, 
            message: `Personalidade alterada para ${personality}`,
            personality: whatsappCompanion.getCurrentPersonality()
          })
        }
        return NextResponse.json({ 
          success: false, 
          message: 'Personalidade não especificada' 
        }, { status: 400 })

      case 'processMessage':
        if (message) {
          const response = await whatsappCompanion.processMessage({
            id: Date.now().toString(),
            from: message.from || 'unknown',
            body: message.body || '',
            timestamp: new Date(),
            isFromMe: false
          })
          
          return NextResponse.json({ 
            success: true, 
            response,
            isActive: whatsappCompanion.isCompanionActive()
          })
        }
        return NextResponse.json({ 
          success: false, 
          message: 'Mensagem não especificada' 
        }, { status: 400 })

      case 'setDelay':
        if (typeof delay === 'number') {
          whatsappCompanion.setResponseDelay(delay)
          return NextResponse.json({ 
            success: true, 
            message: `Delay alterado para ${delay}ms` 
          })
        }
        return NextResponse.json({ 
          success: false, 
          message: 'Delay inválido' 
        }, { status: 400 })

      case 'getStatus':
        return NextResponse.json({
          success: true,
          isActive: whatsappCompanion.isCompanionActive(),
          personality: whatsappCompanion.getCurrentPersonality(),
          personalities: whatsappCompanion.getPersonalities()
        })

      default:
        return NextResponse.json({ 
          success: false, 
          message: 'Ação não reconhecida' 
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Erro no WhatsApp Companion:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      isActive: whatsappCompanion.isCompanionActive(),
      personality: whatsappCompanion.getCurrentPersonality(),
      personalities: whatsappCompanion.getPersonalities()
    })
  } catch (error) {
    console.error('Erro ao obter status do Companion:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
