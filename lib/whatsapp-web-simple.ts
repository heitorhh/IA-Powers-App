import { Client, LocalAuth, type Message } from "whatsapp-web.js"
import qrcode from "qrcode"

interface WhatsAppSession {
  client: Client | null
  qr: string | null
  isReady: boolean
  status: "disconnected" | "connecting" | "connected" | "qr_ready"
  lastActivity: Date
}

class WhatsAppManager {
  private sessions: Map<string, WhatsAppSession> = new Map()
  private static instance: WhatsAppManager

  constructor() {
    if (WhatsAppManager.instance) {
      return WhatsAppManager.instance
    }
    WhatsAppManager.instance = this
  }

  async createSession(sessionId: string): Promise<WhatsAppSession> {
    console.log(`Creating session: ${sessionId}`)
    
    if (this.sessions.has(sessionId)) {
      const existingSession = this.sessions.get(sessionId)!
      console.log(`Session ${sessionId} already exists with status: ${existingSession.status}`)
      return existingSession
    }

    const session: WhatsAppSession = {
      client: null,
      qr: null,
      isReady: false,
      status: "disconnected",
      lastActivity: new Date(),
    }

    try {
      const client = new Client({
        authStrategy: new LocalAuth({ 
          clientId: sessionId,
          dataPath: `/tmp/whatsapp-sessions/${sessionId}`
        }),
        puppeteer: {
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-gpu",
            "--disable-web-security",
            "--disable-features=VizDisplayCompositor",
            "--disable-extensions",
            "--disable-plugins",
            "--disable-images",
            "--disable-javascript",
            "--disable-default-apps",
            "--disable-background-timer-throttling",
            "--disable-backgrounding-occluded-windows",
            "--disable-renderer-backgrounding",
            "--disable-field-trial-config",
            "--disable-back-forward-cache",
            "--disable-ipc-flooding-protection"
          ],
          executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        },
      })

      // Event handlers
      client.on("qr", async (qr) => {
        console.log(`QR Code generated for session ${sessionId}`)
        try {
          session.qr = await qrcode.toDataURL(qr, {
            width: 256,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          })
          session.status = "qr_ready"
          console.log(`QR Code ready for session ${sessionId}`)
        } catch (error) {
          console.error(`Error generating QR code for session ${sessionId}:`, error)
        }
      })

      client.on("ready", () => {
        session.isReady = true
        session.status = "connected"
        session.lastActivity = new Date()
        console.log(`WhatsApp session ${sessionId} is ready!`)
      })

      client.on("authenticated", () => {
        console.log(`WhatsApp session ${sessionId} authenticated`)
        session.status = "connecting"
      })

      client.on("auth_failure", (msg) => {
        console.error(`WhatsApp session ${sessionId} auth failure:`, msg)
        session.status = "disconnected"
        session.qr = null
      })

      client.on("disconnected", (reason) => {
        console.log(`WhatsApp session ${sessionId} disconnected:`, reason)
        session.status = "disconnected"
        session.isReady = false
        session.qr = null
      })

      client.on("message", async (message: Message) => {
        await this.processMessage(sessionId, message)
      })

      session.client = client
      this.sessions.set(sessionId, session)

      console.log(`Initializing WhatsApp client for session ${sessionId}`)
      await client.initialize()
      
      return session
    } catch (error) {
      console.error(`Error creating session ${sessionId}:`, error)
      session.status = "disconnected"
      return session
    }
  }

  private async processMessage(sessionId: string, message: Message) {
    try {
      const sentiment = this.analyzeSentiment(message.body)
      
      const messageData = {
        sessionId,
        from: message.from,
        body: message.body,
        timestamp: message.timestamp,
        sentiment,
        isFromMe: message.fromMe,
        type: message.type,
        hasMedia: message.hasMedia
      }

      console.log(`New message in session ${sessionId}:`, messageData)
    } catch (error) {
      console.error(`Error processing message for session ${sessionId}:`, error)
    }
  }

  private analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
    const positiveWords = ["bom", "ótimo", "excelente", "obrigado", "parabéns", "feliz", "amor", "perfeito", "maravilhoso"]
    const negativeWords = ["ruim", "péssimo", "problema", "erro", "raiva", "ódio", "triste", "horrível", "terrível"]

    const lowerText = text.toLowerCase()
    const positiveCount = positiveWords.filter((word) => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter((word) => lowerText.includes(word)).length

    if (positiveCount > negativeCount) return "positive"
    if (negativeCount > positiveCount) return "negative"
    return "neutral"
  }

  getSession(sessionId: string): WhatsAppSession | null {
    return this.sessions.get(sessionId) || null
  }

  async sendMessage(sessionId: string, to: string, message: string) {
    const session = this.sessions.get(sessionId)
    if (!session || !session.client || !session.isReady) {
      throw new Error("Session not ready")
    }

    try {
      await session.client.sendMessage(to, message)
      console.log(`Message sent in session ${sessionId} to ${to}`)
    } catch (error) {
      console.error(`Error sending message in session ${sessionId}:`, error)
      throw error
    }
  }

  async getChats(sessionId: string) {
    const session = this.sessions.get(sessionId)
    if (!session || !session.client || !session.isReady) {
      throw new Error("Session not ready")
    }

    try {
      const chats = await session.client.getChats()
      return chats.slice(0, 10).map((chat) => ({
        id: chat.id._serialized,
        name: chat.name || 'Unknown',
        isGroup: chat.isGroup,
        unreadCount: chat.unreadCount,
        lastMessage: chat.lastMessage?.body || "",
        timestamp: chat.timestamp || Date.now()
      }))
    } catch (error) {
      console.error(`Error getting chats for session ${sessionId}:`, error)
      return []
    }
  }

  async disconnect(sessionId: string) {
    const session = this.sessions.get(sessionId)
    if (session && session.client) {
      try {
        await session.client.destroy()
        console.log(`Session ${sessionId} destroyed`)
      } catch (error) {
        console.error(`Error destroying session ${sessionId}:`, error)
      }
      this.sessions.delete(sessionId)
    }
  }

  getAllSessions() {
    const sessions: any[] = []
    this.sessions.forEach((session, id) => {
      sessions.push({
        id,
        status: session.status,
        isReady: session.isReady,
        lastActivity: session.lastActivity,
        hasQR: !!session.qr
      })
    })
    return sessions
  }
}

export const whatsappManager = new WhatsAppManager()
