import { type NextRequest, NextResponse } from "next/server"

// Simulação de armazenamento em memória (em produção, use um banco de dados)
const sessions: any[] = []

// Simular whatsapp-web.js
class WhatsAppClient {
  private sessionId: string
  private clientId: string
  private qrCode: string | null = null
  private status = "INITIALIZING"
  private me: any = null

  constructor(sessionId: string, clientId: string) {
    this.sessionId = sessionId
    this.clientId = clientId
  }

  async initialize() {
    return new Promise((resolve) => {
      // Simular inicialização do cliente WhatsApp
      setTimeout(() => {
        this.status = "SCAN_QR_CODE"
        // Gerar QR Code que simula o formato real do WhatsApp Web
        const qrData = `1@${this.sessionId},${Date.now()},${Math.random().toString(36).substring(7)}`
        this.qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&data=${encodeURIComponent(qrData)}&bgcolor=ffffff&color=000000&margin=10&qzone=1`
        resolve(this)
      }, 2000)
    })
  }

  async getQR() {
    return this.qrCode
  }

  getStatus() {
    return this.status
  }

  // Simular conexão bem-sucedida
  simulateConnection() {
    setTimeout(
      () => {
        if (this.status === "SCAN_QR_CODE") {
          this.status = "WORKING"
          this.qrCode = null
          this.me = {
            id: `${this.clientId}@c.us`,
            pushName: `Usuário ${this.clientId}`,
            name: `Usuário ${this.clientId}`,
            phone: "+55 11 99999-9999",
          }
          console.log(`WhatsApp conectado para sessão ${this.sessionId}`)
        }
      },
      Math.random() * 20000 + 10000,
    ) // 10-30 segundos
  }

  async getChats() {
    // Simular busca de conversas dos últimos 7 dias
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    return [
      {
        id: "5511999991111@c.us",
        name: "Carlos Mendes",
        lastMessage: {
          body: "Preciso urgente do relatório financeiro. Quando fica pronto?",
          timestamp: Date.now() - 300000,
          fromMe: false,
        },
        unreadCount: 2,
      },
      {
        id: "5511999992222@c.us",
        name: "Ana Silva",
        lastMessage: {
          body: "Ótima apresentação hoje! Parabéns pela dedicação 👏",
          timestamp: Date.now() - 1800000,
          fromMe: false,
        },
        unreadCount: 0,
      },
      {
        id: "5511999994444@c.us",
        name: "João Santos",
        lastMessage: {
          body: "Estou muito estressado com essas demandas. Não consigo dar conta de tudo...",
          timestamp: Date.now() - 900000,
          fromMe: false,
        },
        unreadCount: 1,
      },
    ]
  }

  async getMessages(chatId: string, limit = 50) {
    // Simular busca de mensagens dos últimos 7 dias
    const messages = [
      {
        id: `msg_${Date.now()}_1`,
        body: "Bom dia! Como está o andamento do projeto?",
        timestamp: Date.now() - 86400000, // 1 dia atrás
        fromMe: false,
        from: chatId,
      },
      {
        id: `msg_${Date.now()}_2`,
        body: "Está progredindo bem, deve ficar pronto até sexta.",
        timestamp: Date.now() - 86340000,
        fromMe: true,
        from: "me",
      },
      {
        id: `msg_${Date.now()}_3`,
        body: "Perfeito! Preciso apresentar na reunião de segunda.",
        timestamp: Date.now() - 86280000,
        fromMe: false,
        from: chatId,
      },
    ]

    return messages.slice(0, limit)
  }

  getMe() {
    return this.me
  }

  destroy() {
    this.status = "DISCONNECTED"
    this.qrCode = null
    this.me = null
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      sessions: sessions,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar sessões",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, clientId, userRole } = body

    // Para master, usar ID único do admin
    const effectiveClientId = userRole === "master" ? "master_admin" : clientId

    // Verificar se já existe uma sessão ativa para este cliente
    const existingSession = sessions.find((s) => s.clientId === effectiveClientId && s.status !== "DISCONNECTED")
    if (existingSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Já existe uma sessão ativa para este usuário. Desconecte primeiro.",
        },
        { status: 400 },
      )
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Criar cliente WhatsApp
    const client = new WhatsAppClient(sessionId, effectiveClientId)

    // Criar nova sessão
    const newSession = {
      id: sessionId,
      name: name || sessionId,
      clientId: effectiveClientId,
      userRole: userRole || "simple",
      status: "INITIALIZING",
      qr: null,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 120000).toISOString(), // 2 minutos
      client: client,
      config: {
        webhooks: [`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhook/whatsapp`],
        messageLimit: 7, // 7 dias
      },
    }

    sessions.push(newSession)

    // Inicializar cliente
    try {
      await client.initialize()
      newSession.status = client.getStatus()
      newSession.qr = await client.getQR()

      // Simular conexão
      client.simulateConnection()

      // Auto-expirar QR Code após 2 minutos se não conectado
      setTimeout(() => {
        const sessionIndex = sessions.findIndex((s) => s.id === sessionId)
        if (sessionIndex !== -1 && sessions[sessionIndex].status === "SCAN_QR_CODE") {
          sessions[sessionIndex].status = "EXPIRED"
          sessions[sessionIndex].qr = null
          console.log(`QR Code da sessão ${sessionId} expirou`)
        }
      }, 120000)
    } catch (error) {
      console.error("Erro ao inicializar cliente WhatsApp:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao inicializar conexão WhatsApp",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      session: {
        id: newSession.id,
        name: newSession.name,
        clientId: newSession.clientId,
        userRole: newSession.userRole,
        status: newSession.status,
        qr: newSession.qr,
        createdAt: newSession.createdAt,
        expiresAt: newSession.expiresAt,
      },
      message: "Sessão WhatsApp criada. Escaneie o QR Code em até 2 minutos.",
    })
  } catch (error) {
    console.error("Erro ao criar sessão:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao criar sessão WhatsApp",
      },
      { status: 500 },
    )
  }
}
