interface EvolutionAPIConfig {
  baseUrl: string
  apiKey: string
  instanceName: string
}

interface EvolutionInstance {
  instanceName: string
  status: "open" | "close" | "connecting"
  serverUrl: string
  apikey: string
  qrcode?: {
    pairingCode?: string
    code: string
    base64: string
  }
  profileName?: string
  profilePicUrl?: string
  integration?: string
}

interface EvolutionMessage {
  key: {
    remoteJid: string
    fromMe: boolean
    id: string
  }
  message: {
    conversation?: string
    extendedTextMessage?: {
      text: string
    }
  }
  messageTimestamp: number
  pushName?: string
  status?: string
}

interface EvolutionContact {
  id: string
  pushName: string
  profilePicUrl?: string
}

export class EvolutionAPI {
  private config: EvolutionAPIConfig

  constructor(config: EvolutionAPIConfig) {
    this.config = config
  }

  private async makeRequest(endpoint: string, method: "GET" | "POST" | "DELETE" = "GET", data?: any) {
    const url = `${this.config.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      apikey: this.config.apiKey,
    }

    const options: RequestInit = {
      method,
      headers,
      ...(data && { body: JSON.stringify(data) }),
    }

    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`Evolution API Error: ${response.status} - ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Evolution API Request Error:", error)
      throw error
    }
  }

  // Criar nova instância
  async createInstance(instanceName: string, webhookUrl?: string): Promise<EvolutionInstance> {
    const data = {
      instanceName,
      integration: "WHATSAPP-BAILEYS",
      ...(webhookUrl && {
        webhook: {
          url: webhookUrl,
          events: [
            "APPLICATION_STARTUP",
            "QRCODE_UPDATED",
            "CONNECTION_UPDATE",
            "MESSAGES_UPSERT",
            "MESSAGES_UPDATE",
            "SEND_MESSAGE",
          ],
        },
      }),
    }

    return this.makeRequest("/instance/create", "POST", data)
  }

  // Conectar instância (gerar QR Code)
  async connectInstance(instanceName: string): Promise<EvolutionInstance> {
    return this.makeRequest(`/instance/connect/${instanceName}`, "POST")
  }

  // Buscar status da instância
  async getInstanceStatus(instanceName: string): Promise<EvolutionInstance> {
    return this.makeRequest(`/instance/connectionState/${instanceName}`)
  }

  // Buscar QR Code
  async getQRCode(instanceName: string): Promise<{ qr: string; base64: string }> {
    const response = await this.makeRequest(`/instance/qr/${instanceName}`)
    return {
      qr: response.qr,
      base64: response.base64,
    }
  }

  // Buscar perfil da instância
  async getProfile(instanceName: string): Promise<any> {
    return this.makeRequest(`/chat/whatsappProfile/${instanceName}`)
  }

  // Desconectar instância
  async logoutInstance(instanceName: string): Promise<any> {
    return this.makeRequest(`/instance/logout/${instanceName}`, "DELETE")
  }

  // Deletar instância
  async deleteInstance(instanceName: string): Promise<any> {
    return this.makeRequest(`/instance/delete/${instanceName}`, "DELETE")
  }

  // Listar conversas
  async getChats(instanceName: string): Promise<any[]> {
    return this.makeRequest(`/chat/findChats/${instanceName}`)
  }

  // Buscar mensagens de uma conversa
  async getMessages(instanceName: string, remoteJid: string, limit = 50): Promise<EvolutionMessage[]> {
    const data = {
      where: {
        key: {
          remoteJid,
        },
      },
      limit,
    }

    const response = await this.makeRequest(`/chat/findMessages/${instanceName}`, "POST", data)
    return response.messages || []
  }

  // Buscar mensagens dos últimos X dias
  async getRecentMessages(instanceName: string, days = 7): Promise<EvolutionMessage[]> {
    const since = new Date()
    since.setDate(since.getDate() - days)

    const data = {
      where: {
        messageTimestamp: {
          $gte: Math.floor(since.getTime() / 1000),
        },
      },
      limit: 1000,
    }

    const response = await this.makeRequest(`/chat/findMessages/${instanceName}`, "POST", data)
    return response.messages || []
  }

  // Enviar mensagem
  async sendMessage(instanceName: string, remoteJid: string, message: string): Promise<any> {
    const data = {
      number: remoteJid,
      textMessage: {
        text: message,
      },
    }

    return this.makeRequest(`/message/sendText/${instanceName}`, "POST", data)
  }

  // Buscar contatos
  async getContacts(instanceName: string): Promise<EvolutionContact[]> {
    return this.makeRequest(`/chat/findContacts/${instanceName}`)
  }

  // Verificar se número existe no WhatsApp
  async checkWhatsAppNumber(instanceName: string, numbers: string[]): Promise<any> {
    const data = { numbers }
    return this.makeRequest(`/chat/whatsappNumbers/${instanceName}`, "POST", data)
  }

  // Obter informações da instância
  async getInstanceInfo(instanceName: string): Promise<EvolutionInstance> {
    return this.makeRequest(`/instance/fetchInstances?instanceName=${instanceName}`)
  }

  // Listar todas as instâncias
  async getAllInstances(): Promise<EvolutionInstance[]> {
    const response = await this.makeRequest("/instance/fetchInstances")
    return Array.isArray(response) ? response : [response]
  }
}

// Classe para gerenciar múltiplas instâncias
export class EvolutionManager {
  private instances: Map<string, EvolutionAPI> = new Map()
  private defaultConfig: Omit<EvolutionAPIConfig, "instanceName">

  constructor(config: Omit<EvolutionAPIConfig, "instanceName">) {
    this.defaultConfig = config
  }

  // Criar ou obter instância
  getInstance(instanceName: string): EvolutionAPI {
    if (!this.instances.has(instanceName)) {
      const api = new EvolutionAPI({
        ...this.defaultConfig,
        instanceName,
      })
      this.instances.set(instanceName, api)
    }

    return this.instances.get(instanceName)!
  }

  // Remover instância do cache
  removeInstance(instanceName: string): void {
    this.instances.delete(instanceName)
  }

  // Listar instâncias ativas
  getActiveInstances(): string[] {
    return Array.from(this.instances.keys())
  }
}

// Configuração padrão da Evolution API
export const getEvolutionConfig = (): Omit<EvolutionAPIConfig, "instanceName"> => {
  return {
    baseUrl: process.env.EVOLUTION_API_URL || "http://localhost:8080",
    apiKey: process.env.EVOLUTION_API_KEY || "your-api-key-here",
  }
}

// Singleton do manager
let evolutionManager: EvolutionManager | null = null

export const getEvolutionManager = (): EvolutionManager => {
  if (!evolutionManager) {
    evolutionManager = new EvolutionManager(getEvolutionConfig())
  }
  return evolutionManager
}
