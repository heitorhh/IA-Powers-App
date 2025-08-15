export interface CompanionPersonality {
  id: string
  name: string
  description: string
  systemPrompt: string
  avatar: string
  traits: string[]
}

export const COMPANION_PERSONALITIES: CompanionPersonality[] = [
  {
    id: "luzia",
    name: "Luzia",
    description: "Assistente profissional e eficiente para WhatsApp",
    systemPrompt: `Você é Luzia, uma assistente virtual profissional e eficiente. 
    Você ajuda usuários com tarefas do WhatsApp de forma clara e objetiva.
    Sempre seja educada, prestativa e mantenha um tom profissional.
    Responda de forma concisa e útil.`,
    avatar: "🤖",
    traits: ["Profissional", "Eficiente", "Objetiva", "Prestativa"],
  },
  {
    id: "professional",
    name: "Profissional",
    description: "Focado em negócios e produtividade",
    systemPrompt: `Você é um assistente focado em negócios e produtividade.
    Ajude com tarefas corporativas, agendamentos, lembretes e comunicação empresarial.
    Mantenha sempre um tom formal e profissional.
    Priorize eficiência e resultados.`,
    avatar: "💼",
    traits: ["Formal", "Produtivo", "Empresarial", "Eficiente"],
  },
  {
    id: "casual",
    name: "Casual",
    description: "Amigável e descontraído",
    systemPrompt: `Você é um assistente amigável e descontraído.
    Use um tom casual e amigável, como se fosse um amigo próximo.
    Seja prestativo mas mantenha a conversa leve e divertida.
    Use emojis quando apropriado.`,
    avatar: "😊",
    traits: ["Amigável", "Descontraído", "Divertido", "Casual"],
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

export interface WhatsAppChat {
  id: string
  name: string
  lastMessage: string
  timestamp: number
  unreadCount: number
  isGroup: boolean
  participants?: string[]
}

export class WhatsAppAICompanion {
  private personality: CompanionPersonality
  private apiKey: string

  constructor(personalityId = "luzia", apiKey = "") {
    const personality = COMPANION_PERSONALITIES.find((p) => p.id === personalityId)
    if (!personality) {
      throw new Error(`Personality ${personalityId} not found`)
    }
    this.personality = personality
    this.apiKey = apiKey
  }

  async generateResponse(message: string, context?: string): Promise<string> {
    try {
      // Simular resposta da IA baseada na personalidade
      const responses = this.getPersonalityResponses(message)
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      // Adicionar delay para simular processamento
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      return randomResponse
    } catch (error) {
      console.error("Erro ao gerar resposta:", error)
      return "Desculpe, não consegui processar sua mensagem no momento."
    }
  }

  private getPersonalityResponses(message: string): string[] {
    const lowerMessage = message.toLowerCase()

    if (this.personality.id === "luzia") {
      if (lowerMessage.includes("olá") || lowerMessage.includes("oi")) {
        return ["Olá! Como posso ajudá-lo hoje?", "Oi! Em que posso ser útil?", "Olá! Estou aqui para ajudar."]
      }
      if (lowerMessage.includes("ajuda")) {
        return [
          "Claro! Posso ajudar com automação do WhatsApp, gerenciamento de mensagens e muito mais.",
          "Estou aqui para ajudar! O que você precisa?",
          "Com certeza! Como posso auxiliá-lo?",
        ]
      }
      return [
        "Entendi. Como posso ajudar com isso?",
        "Interessante. Precisa de alguma assistência?",
        "Compreendo. Em que posso ser útil?",
      ]
    }

    if (this.personality.id === "professional") {
      if (lowerMessage.includes("reunião") || lowerMessage.includes("meeting")) {
        return [
          "Posso ajudar a agendar reuniões e enviar lembretes automáticos.",
          "Vou organizar sua agenda de reuniões de forma eficiente.",
          "Reuniões agendadas com sucesso. Lembretes serão enviados automaticamente.",
        ]
      }
      return [
        "Entendido. Vou processar sua solicitação de forma eficiente.",
        "Recebido. Implementando a solução mais adequada.",
        "Compreendido. Executando com foco em resultados.",
      ]
    }

    if (this.personality.id === "casual") {
      if (lowerMessage.includes("oi") || lowerMessage.includes("olá")) {
        return ["Oi! Tudo bem? 😊", "Olá! Como você está hoje? 🌟", "Oi! Que bom te ver por aqui! 👋"]
      }
      return [
        "Legal! Vamos resolver isso juntos! 🚀",
        "Entendi! Deixa comigo que vai dar tudo certo! ✨",
        "Show! Vou te ajudar com isso! 💪",
      ]
    }

    return ["Como posso ajudar?"]
  }

  getPersonality(): CompanionPersonality {
    return this.personality
  }

  setPersonality(personalityId: string): void {
    const personality = COMPANION_PERSONALITIES.find((p) => p.id === personalityId)
    if (!personality) {
      throw new Error(`Personality ${personalityId} not found`)
    }
    this.personality = personality
  }

  async processWhatsAppMessage(message: WhatsAppMessage): Promise<string> {
    const context = `Mensagem recebida de ${message.from} às ${new Date(message.timestamp).toLocaleString()}`
    return await this.generateResponse(message.body, context)
  }

  async handleAutoReply(chat: WhatsAppChat, message: WhatsAppMessage): Promise<string | null> {
    // Lógica para auto-resposta baseada em regras
    if (message.isFromMe) {
      return null // Não responder às próprias mensagens
    }

    const lowerBody = message.body.toLowerCase()

    // Respostas automáticas básicas
    if (lowerBody.includes("horário") || lowerBody.includes("funcionamento")) {
      return "Nosso horário de funcionamento é de segunda a sexta, das 9h às 18h."
    }

    if (lowerBody.includes("preço") || lowerBody.includes("valor")) {
      return "Para informações sobre preços, entre em contato conosco pelo telefone ou agende uma consulta."
    }

    if (lowerBody.includes("obrigado") || lowerBody.includes("obrigada")) {
      return "De nada! Estou sempre aqui para ajudar! 😊"
    }

    return null // Sem resposta automática
  }
}

export default WhatsAppAICompanion
