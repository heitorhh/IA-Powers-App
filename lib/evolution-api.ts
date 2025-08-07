interface EvolutionConfig {
  baseUrl: string
  apiKey: string
}

interface InstanceInfo {
  instanceName: string
  status: 'open' | 'close' | 'connecting'
  qrcode?: string
  profilePictureUrl?: string
  profileName?: string
}

interface MessageData {
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
}

export class EvolutionAPI {
  private config: EvolutionConfig
  private instances: Map<string, InstanceInfo> = new Map()

  constructor(config: EvolutionConfig) {
    this.config = config
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.config.baseUrl}${endpoint}`
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.config.apiKey,
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Evolution API request failed:', error)
      throw error
    }
  }

  async createInstance(instanceName: string): Promise<InstanceInfo> {
    try {
      const response = await this.makeRequest(`/instance/create`, {
        method: 'POST',
        body: JSON.stringify({
          instanceName,
          token: this.config.apiKey,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS'
        }),
      })

      const instanceInfo: InstanceInfo = {
        instanceName,
        status: 'close',
        ...response.instance
      }

      this.instances.set(instanceName, instanceInfo)
      return instanceInfo
    } catch (error) {
      console.error('Failed to create instance:', error)
      throw new Error('Failed to create WhatsApp instance')
    }
  }

  async connectInstance(instanceName: string): Promise<InstanceInfo> {
    try {
      const response = await this.makeRequest(`/instance/connect/${instanceName}`, {
        method: 'GET',
      })

      const instanceInfo: InstanceInfo = {
        instanceName,
        status: 'connecting',
        qrcode: response.base64,
        ...response
      }

      this.instances.set(instanceName, instanceInfo)
      return instanceInfo
    } catch (error) {
      console.error('Failed to connect instance:', error)
      throw new Error('Failed to connect to WhatsApp')
    }
  }

  async getInstanceStatus(instanceName: string): Promise<InstanceInfo | null> {
    try {
      const response = await this.makeRequest(`/instance/connectionState/${instanceName}`)
      
      const instanceInfo: InstanceInfo = {
        instanceName,
        status: response.instance?.state === 'open' ? 'open' : 'close',
        ...response.instance
      }

      this.instances.set(instanceName, instanceInfo)
      return instanceInfo
    } catch (error) {
      console.error('Failed to get instance status:', error)
      return null
    }
  }

  async sendMessage(instanceName: string, number: string, message: string) {
    try {
      const response = await this.makeRequest(`/message/sendText/${instanceName}`, {
        method: 'POST',
        body: JSON.stringify({
          number: number.replace(/\D/g, ''),
          options: {
            delay: 1200,
            presence: 'composing'
          },
          textMessage: {
            text: message
          }
        }),
      })

      return response
    } catch (error) {
      console.error('Failed to send message:', error)
      throw new Error('Failed to send message')
    }
  }

  async getMessages(instanceName: string, remoteJid: string) {
    try {
      const response = await this.makeRequest(
        `/chat/findMessages/${instanceName}?remoteJid=${remoteJid}&limit=50`
      )
      return response.messages || []
    } catch (error) {
      console.error('Failed to get messages:', error)
      return []
    }
  }

  async getChats(instanceName: string) {
    try {
      const response = await this.makeRequest(`/chat/findChats/${instanceName}`)
      return response.chats || []
    } catch (error) {
      console.error('Failed to get chats:', error)
      return []
    }
  }

  async deleteInstance(instanceName: string): Promise<boolean> {
    try {
      await this.makeRequest(`/instance/delete/${instanceName}`, {
        method: 'DELETE',
      })

      this.instances.delete(instanceName)
      return true
    } catch (error) {
      console.error('Failed to delete instance:', error)
      return false
    }
  }

  async logoutInstance(instanceName: string): Promise<boolean> {
    try {
      await this.makeRequest(`/instance/logout/${instanceName}`, {
        method: 'DELETE',
      })

      const instance = this.instances.get(instanceName)
      if (instance) {
        instance.status = 'close'
        this.instances.set(instanceName, instance)
      }

      return true
    } catch (error) {
      console.error('Failed to logout instance:', error)
      return false
    }
  }

  getInstanceInfo(instanceName: string): InstanceInfo | undefined {
    return this.instances.get(instanceName)
  }

  getAllInstances(): InstanceInfo[] {
    return Array.from(this.instances.values())
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.makeRequest('/instance/fetchInstances')
      return true
    } catch (error) {
      console.error('Evolution API health check failed:', error)
      return false
    }
  }
}

// Instância global para uso na aplicação
export const evolutionAPI = new EvolutionAPI({
  baseUrl: process.env.EVOLUTION_API_URL || 'https://evolution-api-production.up.railway.app',
  apiKey: process.env.EVOLUTION_API_KEY || 'B6D711FCDE4D4FD5936544120E713976'
})

// Manager global para controle de instâncias
class EvolutionManager {
  private instances: Map<string, EvolutionAPI> = new Map()

  createManager(config: EvolutionConfig): EvolutionAPI {
    const key = `${config.baseUrl}-${config.apiKey}`
    
    if (!this.instances.has(key)) {
      this.instances.set(key, new EvolutionAPI(config))
    }
    
    return this.instances.get(key)!
  }

  getManager(baseUrl: string, apiKey: string): EvolutionAPI | undefined {
    const key = `${baseUrl}-${apiKey}`
    return this.instances.get(key)
  }

  getAllManagers(): EvolutionAPI[] {
    return Array.from(this.instances.values())
  }

  removeManager(baseUrl: string, apiKey: string): boolean {
    const key = `${baseUrl}-${apiKey}`
    return this.instances.delete(key)
  }
}

const globalEvolutionManager = new EvolutionManager()

// Exportação da função que estava faltando
export function getEvolutionManager(): EvolutionManager {
  return globalEvolutionManager
}

// Exportações adicionais
export type { EvolutionConfig, InstanceInfo, MessageData }
export { EvolutionManager }
