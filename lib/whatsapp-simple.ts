import { Client, LocalAuth } from "whatsapp-web.js"
import { EventEmitter } from "events"

export class SimpleWhatsAppManager extends EventEmitter {
  private client: Client | null = null
  private isConnected = false
  private qrCode = ""

  constructor() {
    super()
  }

  async initialize() {
    try {
      this.client = new Client({
        authStrategy: new LocalAuth({
          clientId: "whatsapp-session",
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
          ],
        },
      })

      this.client.on("qr", (qr) => {
        this.qrCode = qr
        this.emit("qr", qr)
      })

      this.client.on("ready", () => {
        this.isConnected = true
        this.emit("ready")
        console.log("WhatsApp Client is ready!")
      })

      this.client.on("authenticated", () => {
        this.emit("authenticated")
        console.log("WhatsApp Client authenticated")
      })

      this.client.on("auth_failure", (msg) => {
        this.emit("auth_failure", msg)
        console.error("Authentication failed:", msg)
      })

      this.client.on("disconnected", (reason) => {
        this.isConnected = false
        this.emit("disconnected", reason)
        console.log("WhatsApp Client disconnected:", reason)
      })

      this.client.on("message", async (message) => {
        this.emit("message", {
          id: message.id._serialized,
          from: message.from,
          to: message.to,
          body: message.body,
          timestamp: message.timestamp,
          isGroup: message.from.includes("@g.us"),
          contact: await message.getContact(),
        })
      })

      await this.client.initialize()
    } catch (error) {
      console.error("Error initializing WhatsApp client:", error)
      throw error
    }
  }

  async sendMessage(to: string, message: string) {
    if (!this.client || !this.isConnected) {
      throw new Error("WhatsApp client not connected")
    }

    try {
      const response = await this.client.sendMessage(to, message)
      return {
        success: true,
        messageId: response.id._serialized,
        timestamp: response.timestamp,
      }
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }

  async getChats() {
    if (!this.client || !this.isConnected) {
      throw new Error("WhatsApp client not connected")
    }

    try {
      const chats = await this.client.getChats()
      return chats.map((chat) => ({
        id: chat.id._serialized,
        name: chat.name,
        isGroup: chat.isGroup,
        unreadCount: chat.unreadCount,
        lastMessage: chat.lastMessage,
      }))
    } catch (error) {
      console.error("Error getting chats:", error)
      throw error
    }
  }

  getQRCode() {
    return this.qrCode
  }

  isClientConnected() {
    return this.isConnected
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy()
      this.isConnected = false
    }
  }
}

// Singleton instance
let whatsappManager: SimpleWhatsAppManager | null = null

export function getWhatsAppManager() {
  if (!whatsappManager) {
    whatsappManager = new SimpleWhatsAppManager()
  }
  return whatsappManager
}
