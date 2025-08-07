import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export interface CompanionPersonality {
  id: string
  name: string
  description: string
  systemPrompt: string
  greeting: string
  tone: 'casual' | 'professional' | 'friendly' | 'formal'
}

export const COMPANION_PERSONALITIES: CompanionPersonality[] = [
  {
    id: 'luzia',
    name: 'Luzia',
    description: 'Assistente amigável e inteligente para estudos e vida',
    systemPrompt: `Você é a Luzia, uma assistente de IA amigável e inteligente. Você ajuda com estudos, trabalho e questões do dia a dia. 
    
    Características:
    - Sempre positiva e encorajadora
    - Usa emojis de forma natural
    - Explica de forma simples e clara
    - Oferece exemplos práticos
    - É paciente e compreensiva
    
    Responda sempre em português brasileiro de forma natural e amigável.`,
    greeting: 'Oi! 👋 Sou a Luzia, sua assistente inteligente! Como posso te ajudar hoje?',
    tone: 'friendly'
  },
  {
    id: 'professional',
    name: 'Assistente Profissional',
    description: 'Focado em produtividade e ambiente corporativo',
    systemPrompt: `Você é um assistente profissional especializado em produtividade, gestão e ambiente corporativo.
    
    Características:
    - Linguagem formal mas acessível
    - Foco em eficiência e resultados
    - Oferece soluções práticas
    - Conhecimento em gestão e negócios
    - Sempre objetivo e direto
    
    Responda de forma profissional e eficiente em português brasileiro.`,
    greeting: 'Olá! Sou seu assistente profissional. Como posso otimizar sua produtividade hoje?',
    tone: 'professional'
  },
  {
    id: 'casual',
    name: 'Amigo Virtual',
    description: 'Conversa descontraída e apoio emocional',
    systemPrompt: `Você é um amigo virtual descontraído e empático. Você oferece apoio, conversa casual e ajuda com questões pessoais.
    
    Características:
    - Linguagem informal e descontraída
    - Empático e compreensivo
    - Usa gírias brasileiras naturalmente
    - Oferece apoio emocional
    - Conversa como um amigo próximo
    
    Responda de forma casual e amigável em português brasileiro.`,
    greeting: 'E aí! 😄 Tudo bem? Sou seu amigo virtual, bora conversar!',
    tone: 'casual'
  }
]

export class WhatsAppAICompanion {
  private personality: CompanionPersonality
  private apiKey: string
  private isActive: boolean = false

  constructor(personalityId: string = 'luzia', apiKey: string) {
    this.personality = COMPANION_PERSONALITIES.find(p => p.id === personalityId) || COMPANION_PERSONALITIES[0]
    this.apiKey = apiKey
  }

  async generateResponse(message: string, context?: string): Promise<string> {
    try {
      const { text } = await generateText({
        model: openai('gpt-4o', { apiKey: this.apiKey }),
        system: this.personality.systemPrompt,
        prompt: `Mensagem do usuário: "${message}"
        
        ${context ? `Contexto adicional: ${context}` : ''}
        
        Responda de acordo com sua personalidade (${this.personality.name}).`
      })

      return text
    } catch (error) {
      console.error('Erro ao gerar resposta:', error)
      return this.getErrorResponse()
    }
  }

  private getErrorResponse(): string {
    const errorResponses = {
      luzia: 'Ops! 😅 Tive um probleminha técnico. Pode repetir a pergunta?',
      professional: 'Desculpe, ocorreu um erro técnico. Por favor, tente novamente.',
      casual: 'Eita! 😬 Deu um bug aqui. Manda de novo aí!'
    }
    
    return errorResponses[this.personality.id as keyof typeof errorResponses] || errorResponses.luzia
  }

  getGreeting(): string {
    return this.personality.greeting
  }

  setPersonality(personalityId: string): void {
    const newPersonality = COMPANION_PERSONALITIES.find(p => p.id === personalityId)
    if (newPersonality) {
      this.personality = newPersonality
    }
  }

  activate(): void {
    this.isActive = true
  }

  deactivate(): void {
    this.isActive = false
  }

  isCompanionActive(): boolean {
    return this.isActive
  }

  getPersonalityInfo(): CompanionPersonality {
    return this.personality
  }

  async processWhatsAppMessage(
    message: string, 
    senderName: string, 
    isGroup: boolean = false
  ): Promise<string | null> {
    if (!this.isActive) return null

    // Em grupos, só responde se mencionado
    if (isGroup && !message.toLowerCase().includes(this.personality.name.toLowerCase())) {
      return null
    }

    const context = isGroup ? `Mensagem em grupo de ${senderName}` : `Mensagem privada de ${senderName}`
    
    return await this.generateResponse(message, context)
  }
}

// Instância global do companion
let globalCompanion: WhatsAppAICompanion | null = null

export function getCompanionInstance(personalityId?: string, apiKey?: string): WhatsAppAICompanion {
  if (!globalCompanion && apiKey) {
    globalCompanion = new WhatsAppAICompanion(personalityId, apiKey)
  } else if (globalCompanion && personalityId) {
    globalCompanion.setPersonality(personalityId)
  }
  
  return globalCompanion!
}

export function resetCompanionInstance(): void {
  globalCompanion = null
}
