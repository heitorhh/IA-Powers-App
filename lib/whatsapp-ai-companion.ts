interface Message {
  id: string
  from: string
  body: string
  timestamp: Date
  isFromMe: boolean
}

interface CompanionPersonality {
  name: string
  description: string
  responseStyle: string
  emoji: string
}

export class WhatsAppAICompanion {
  private isActive: boolean = false
  private personality: CompanionPersonality
  private responseDelay: number = 2000 // 2 seconds

  private personalities: CompanionPersonality[] = [
    {
      name: 'Luzia',
      description: 'Assistente profissional e eficiente',
      responseStyle: 'formal',
      emoji: '🤖'
    },
    {
      name: 'Profissional',
      description: 'Focado em negócios e produtividade',
      responseStyle: 'business',
      emoji: '💼'
    },
    {
      name: 'Casual',
      description: 'Amigável e descontraído',
      responseStyle: 'friendly',
      emoji: '😊'
    }
  ]

  constructor() {
    this.personality = this.personalities[0] // Default to Luzia
  }

  setPersonality(personalityName: string) {
    const personality = this.personalities.find(p => p.name === personalityName)
    if (personality) {
      this.personality = personality
    }
  }

  activate() {
    this.isActive = true
    console.log(`${this.personality.emoji} ${this.personality.name} ativada!`)
  }

  deactivate() {
    this.isActive = false
    console.log(`${this.personality.emoji} ${this.personality.name} desativada.`)
  }

  isCompanionActive(): boolean {
    return this.isActive
  }

  async processMessage(message: Message): Promise<string | null> {
    if (!this.isActive) return null

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, this.responseDelay))

    return this.generateResponse(message)
  }

  private generateResponse(message: Message): string {
    const body = message.body.toLowerCase()
    
    // Context-aware responses based on message content
    if (body.includes('reunião') || body.includes('meeting')) {
      return this.getResponseByStyle([
        'Posso ajudar a agendar a reunião. Que horário seria melhor?',
        'Vou verificar a agenda. Prefere manhã ou tarde?',
        'Reunião marcada! Vou enviar o convite em breve.'
      ])
    }

    if (body.includes('projeto') || body.includes('project')) {
      return this.getResponseByStyle([
        'Sobre qual projeto você gostaria de falar?',
        'Vou buscar as informações do projeto para você.',
        'Projeto em andamento! Precisa de alguma atualização?'
      ])
    }

    if (body.includes('relatório') || body.includes('report')) {
      return this.getResponseByStyle([
        'O relatório está sendo preparado. Envio em alguns minutos.',
        'Qual período você precisa no relatório?',
        'Relatório pronto! Posso enviar por email também?'
      ])
    }

    if (body.includes('obrigad') || body.includes('thank')) {
      return this.getResponseByStyle([
        'Por nada! Estou aqui para ajudar sempre que precisar.',
        'Fico feliz em ajudar! Qualquer coisa, é só chamar.',
        'De nada! Conte comigo para o que precisar.'
      ])
    }

    if (body.includes('bom dia') || body.includes('boa tarde') || body.includes('boa noite')) {
      return this.getResponseByStyle([
        'Olá! Como posso ajudar você hoje?',
        'Oi! Espero que esteja tendo um ótimo dia!',
        'Oi! Em que posso ser útil hoje?'
      ])
    }

    // Default responses
    return this.getResponseByStyle([
      'Entendi. Como posso ajudar com isso?',
      'Interessante! Precisa de alguma informação específica?',
      'Vou verificar isso para você. Um momento!',
      'Posso ajudar você com essa questão.',
      'Deixe-me processar essa informação...'
    ])
  }

  private getResponseByStyle(responses: string[]): string {
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    switch (this.personality.responseStyle) {
      case 'formal':
        return `${this.personality.emoji} ${randomResponse}`
      case 'business':
        return `${this.personality.emoji} ${randomResponse} Posso providenciar mais detalhes se necessário.`
      case 'friendly':
        return `${this.personality.emoji} ${randomResponse} 😊`
      default:
        return `${this.personality.emoji} ${randomResponse}`
    }
  }

  getPersonalities(): CompanionPersonality[] {
    return this.personalities
  }

  getCurrentPersonality(): CompanionPersonality {
    return this.personality
  }

  setResponseDelay(delay: number) {
    this.responseDelay = delay
  }
}

// Singleton instance
export const whatsappCompanion = new WhatsAppAICompanion()
