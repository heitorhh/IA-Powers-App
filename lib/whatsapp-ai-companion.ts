export interface CompanionPersonality {
  id: string
  name: string
  description: string
  systemPrompt: string
  responseStyle: string
  emoji: string
}

export const COMPANION_PERSONALITIES: CompanionPersonality[] = [
  {
    id: "luzia",
    name: "Luzia",
    description: "Assistente profissional e eficiente",
    systemPrompt:
      "Você é Luzia, uma assistente virtual profissional e eficiente. Responda de forma clara, objetiva e sempre prestativa. Use um tom formal mas amigável.",
    responseStyle: "professional",
    emoji: "🤖",
  },
  {
    id: "professional",
    name: "Profissional",
    description: "Focado em negócios e produtividade",
    systemPrompt:
      "Você é um assistente focado em negócios e produtividade. Suas respostas devem ser diretas, orientadas a resultados e sempre profissionais.",
    responseStyle: "business",
    emoji: "💼",
  },
  {
    id: "casual",
    name: "Casual",
    description: "Amigável e descontraído",
    systemPrompt:
      "Você é um assistente casual e amigável. Use um tom descontraído, seja empático e use emojis quando apropriado. Mantenha as conversas leves e agradáveis.",
    responseStyle: "friendly",
    emoji: "😊",
  },
]

export interface WhatsAppMessage {
  id: string
  from: string
  to: string
  body: string
  timestamp: number
  type: "text" | "image" | "audio" | "video" | "document"
  isFromMe: boolean
}

export interface CompanionContext {
  userId: string
  conversationHistory: WhatsAppMessage[]
  personality: CompanionPersonality
  lastInteraction: number
  preferences: {
    autoReply: boolean
    responseDelay: number
    maxHistoryLength: number
  }
}

export class WhatsAppAICompanion {
  private contexts: Map<string, CompanionContext> = new Map()
  private defaultPersonality: CompanionPersonality

  constructor() {
    this.defaultPersonality = COMPANION_PERSONALITIES[0] // Luzia como padrão
  }

  public setPersonality(userId: string, personalityId: string): boolean {
    const personality = COMPANION_PERSONALITIES.find((p) => p.id === personalityId)
    if (!personality) return false

    const context = this.getOrCreateContext(userId)
    context.personality = personality
    this.contexts.set(userId, context)
    return true
  }

  public async processMessage(message: WhatsAppMessage): Promise<string | null> {
    const context = this.getOrCreateContext(message.from)

    // Adicionar mensagem ao histórico
    context.conversationHistory.push(message)
    context.lastInteraction = Date.now()

    // Limitar histórico
    if (context.conversationHistory.length > context.preferences.maxHistoryLength) {
      context.conversationHistory = context.conversationHistory.slice(-context.preferences.maxHistoryLength)
    }

    // Verificar se deve responder automaticamente
    if (!context.preferences.autoReply) {
      return null
    }

    // Filtros para não responder
    if (this.shouldIgnoreMessage(message)) {
      return null
    }

    // Gerar resposta
    return await this.generateResponse(context, message)
  }

  private getOrCreateContext(userId: string): CompanionContext {
    if (!this.contexts.has(userId)) {
      this.contexts.set(userId, {
        userId,
        conversationHistory: [],
        personality: this.defaultPersonality,
        lastInteraction: Date.now(),
        preferences: {
          autoReply: true,
          responseDelay: 2000,
          maxHistoryLength: 50,
        },
      })
    }
    return this.contexts.get(userId)!
  }

  private shouldIgnoreMessage(message: WhatsAppMessage): boolean {
    // Não responder a próprias mensagens
    if (message.isFromMe) return true

    // Não responder a mensagens muito antigas (mais de 5 minutos)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    if (message.timestamp < fiveMinutesAgo) return true

    // Não responder a mensagens de mídia por enquanto
    if (message.type !== "text") return true

    // Não responder a mensagens muito curtas ou comandos
    if (message.body.length < 3) return true
    if (message.body.startsWith("/")) return true

    return false
  }

  private async generateResponse(context: CompanionContext, message: WhatsAppMessage): Promise<string> {
    try {
      // Construir contexto da conversa
      const recentMessages = context.conversationHistory
        .slice(-5)
        .map((msg) => `${msg.isFromMe ? "Eu" : "Usuário"}: ${msg.body}`)
        .join("\n")

      const prompt = `${context.personality.systemPrompt}

Histórico recente da conversa:
${recentMessages}

Mensagem atual do usuário: ${message.body}

Responda de forma natural e contextual, seguindo sua personalidade.`

      // Simular resposta da IA (aqui você integraria com a API real)
      const responses = this.getSimulatedResponses(context.personality.id, message.body)
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      return randomResponse
    } catch (error) {
      console.error("Erro ao gerar resposta:", error)
      return "Desculpe, não consegui processar sua mensagem no momento. Tente novamente."
    }
  }

  private getSimulatedResponses(personalityId: string, messageBody: string): string[] {
    const lowerMessage = messageBody.toLowerCase()

    // Respostas baseadas na personalidade
    switch (personalityId) {
      case "luzia":
        if (lowerMessage.includes("olá") || lowerMessage.includes("oi")) {
          return ["Olá! Como posso ajudá-lo hoje?", "Oi! Em que posso ser útil?", "Olá! Estou aqui para ajudar."]
        }
        if (lowerMessage.includes("como") && lowerMessage.includes("você")) {
          return [
            "Estou funcionando perfeitamente e pronta para ajudar!",
            "Estou bem, obrigada por perguntar. Como posso ajudá-lo?",
            "Tudo ótimo por aqui! E você, como está?",
          ]
        }
        return [
          "Entendi sua mensagem. Como posso ajudá-lo com isso?",
          "Interessante! Precisa de alguma assistência específica?",
          "Estou aqui para ajudar. O que você gostaria de saber?",
        ]

      case "professional":
        if (lowerMessage.includes("reunião") || lowerMessage.includes("meeting")) {
          return [
            "Posso ajudá-lo a organizar sua reunião. Precisa de alguma agenda específica?",
            "Vamos estruturar essa reunião de forma eficiente. Qual o objetivo principal?",
            "Reuniões produtivas são essenciais. Como posso contribuir para o planejamento?",
          ]
        }
        return [
          "Vamos focar na solução. Como posso otimizar isso para você?",
          "Entendido. Qual seria a abordagem mais eficiente aqui?",
          "Perfeito. Vamos trabalhar nisso de forma estratégica.",
        ]

      case "casual":
        if (lowerMessage.includes("olá") || lowerMessage.includes("oi")) {
          return [
            "Oi! 😊 Tudo bem? Como posso te ajudar?",
            "Olá! 👋 Que bom te ver por aqui!",
            "Oi! 😄 Em que posso dar uma força?",
          ]
        }
        return [
          "Legal! 😊 Como posso te ajudar com isso?",
          "Interessante! 🤔 Vamos ver o que podemos fazer!",
          "Bacana! 👍 Estou aqui pra te ajudar!",
        ]

      default:
        return ["Como posso ajudá-lo?"]
    }
  }

  public getContext(userId: string): CompanionContext | undefined {
    return this.contexts.get(userId)
  }

  public updatePreferences(userId: string, preferences: Partial<CompanionContext["preferences"]>): void {
    const context = this.getOrCreateContext(userId)
    context.preferences = { ...context.preferences, ...preferences }
    this.contexts.set(userId, context)
  }

  public clearHistory(userId: string): void {
    const context = this.contexts.get(userId)
    if (context) {
      context.conversationHistory = []
      this.contexts.set(userId, context)
    }
  }

  public getStats(): {
    totalUsers: number
    activeUsers: number
    totalMessages: number
    personalityDistribution: Record<string, number>
  } {
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000

    let totalMessages = 0
    let activeUsers = 0
    const personalityDistribution: Record<string, number> = {}

    for (const context of this.contexts.values()) {
      totalMessages += context.conversationHistory.length

      if (context.lastInteraction > oneHourAgo) {
        activeUsers++
      }

      const personalityId = context.personality.id
      personalityDistribution[personalityId] = (personalityDistribution[personalityId] || 0) + 1
    }

    return {
      totalUsers: this.contexts.size,
      activeUsers,
      totalMessages,
      personalityDistribution,
    }
  }
}

// Instância singleton
export const whatsappCompanion = new WhatsAppAICompanion()
