import { NextRequest, NextResponse } from 'next/server'
import { getCompanionInstance, COMPANION_PERSONALITIES } from '@/lib/whatsapp-ai-companion'

export async function POST(request: NextRequest) {
  try {
    const { action, personalityId, apiKey, message, senderName, isGroup } = await request.json()

    switch (action) {
      case 'activate':
        if (!apiKey) {
          return NextResponse.json({ error: 'API key é obrigatória' }, { status: 400 })
        }
        
        const companion = getCompanionInstance(personalityId, apiKey)
        companion.activate()
        
        return NextResponse.json({ 
          success: true, 
          message: 'Companion ativado',
          greeting: companion.getGreeting(),
          personality: companion.getPersonalityInfo()
        })

      case 'deactivate':
        const existingCompanion = getCompanionInstance()
        if (existingCompanion) {
          existingCompanion.deactivate()
        }
        
        return NextResponse.json({ success: true, message: 'Companion desativado' })

      case 'process-message':
        const activeCompanion = getCompanionInstance()
        if (!activeCompanion || !activeCompanion.isCompanionActive()) {
          return NextResponse.json({ response: null })
        }

        const response = await activeCompanion.processWhatsAppMessage(message, senderName, isGroup)
        return NextResponse.json({ response })

      case 'change-personality':
        const companionToChange = getCompanionInstance()
        if (companionToChange) {
          companionToChange.setPersonality(personalityId)
          return NextResponse.json({ 
            success: true, 
            personality: companionToChange.getPersonalityInfo() 
          })
        }
        return NextResponse.json({ error: 'Companion não encontrado' }, { status: 404 })

      case 'status':
        const statusCompanion = getCompanionInstance()
        return NextResponse.json({
          isActive: statusCompanion?.isCompanionActive() || false,
          personality: statusCompanion?.getPersonalityInfo() || null
        })

      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
    }
  } catch (error) {
    console.error('Erro na API do Companion:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    personalities: COMPANION_PERSONALITIES,
    status: 'API do WhatsApp AI Companion funcionando'
  })
}
