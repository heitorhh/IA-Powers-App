import { type NextRequest, NextResponse } from "next/server"

// Simulação de armazenamento em memória (em produção, use um banco de dados)
const sessions: any[] = []

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
    const { name, clientId } = body

    // Gerar dados únicos para o QR Code
    const sessionData = {
      sessionId: `session_${Date.now()}`,
      clientId: clientId || "default",
      timestamp: Date.now(),
      server: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    }

    // Criar string para o QR Code (formato similar ao WhatsApp Web)
    const qrData = JSON.stringify(sessionData)

    // Gerar QR Code usando API externa (funcional)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&data=${encodeURIComponent(qrData)}&bgcolor=ffffff&color=000000&margin=10`

    // Criar nova sessão
    const newSession = {
      id: sessionData.sessionId,
      name: name || sessionData.sessionId,
      clientId: clientId,
      status: "SCAN_QR_CODE",
      qr: qrCodeUrl,
      qrData: qrData,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60000).toISOString(), // Expira em 1 minuto
      config: {
        webhooks: [`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhook/whatsapp`],
      },
    }

    sessions.push(newSession)

    // Simular conexão bem-sucedida após 10-30 segundos (para demonstração)
    const connectionDelay = Math.random() * 20000 + 10000 // 10-30 segundos
    setTimeout(() => {
      const sessionIndex = sessions.findIndex((s) => s.id === newSession.id)
      if (sessionIndex !== -1 && sessions[sessionIndex].status === "SCAN_QR_CODE") {
        sessions[sessionIndex] = {
          ...sessions[sessionIndex],
          status: "WORKING",
          qr: undefined,
          qrData: undefined,
          phone: "+55 11 99999-9999",
          connectedAt: new Date().toISOString(),
          me: {
            id: `${clientId}@whatsapp.com`,
            pushName: `Cliente ${clientId}`,
            name: `Cliente ${clientId}`,
            phone: "+55 11 99999-9999",
          },
        }
        console.log(`Sessão ${newSession.id} conectada com sucesso!`)
      }
    }, connectionDelay)

    // Auto-expirar QR Code após 1 minuto se não conectado
    setTimeout(() => {
      const sessionIndex = sessions.findIndex((s) => s.id === newSession.id)
      if (sessionIndex !== -1 && sessions[sessionIndex].status === "SCAN_QR_CODE") {
        sessions[sessionIndex] = {
          ...sessions[sessionIndex],
          status: "EXPIRED",
          qr: undefined,
          qrData: undefined,
        }
        console.log(`QR Code da sessão ${newSession.id} expirou`)
      }
    }, 60000)

    return NextResponse.json({
      success: true,
      session: newSession,
      message: "QR Code gerado com sucesso. Escaneie com seu WhatsApp em até 1 minuto.",
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
