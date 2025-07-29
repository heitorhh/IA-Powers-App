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

    // Gerar QR Code usando uma biblioteca de QR Code
    const qrData = `whatsapp-session-${name}-${Date.now()}`
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`

    // Criar nova sessão
    const newSession = {
      id: `session_${Date.now()}`,
      name: name || `session_${Date.now()}`,
      clientId: clientId,
      status: "SCAN_QR_CODE",
      qr: qrCodeUrl,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      config: {
        webhooks: [`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhook/whatsapp`],
      },
    }

    sessions.push(newSession)

    // Simular conexão após 15 segundos (tempo real seria baseado no scan do QR)
    setTimeout(() => {
      const sessionIndex = sessions.findIndex((s) => s.id === newSession.id)
      if (sessionIndex !== -1) {
        sessions[sessionIndex] = {
          ...sessions[sessionIndex],
          status: "WORKING",
          qr: undefined,
          phone: "+55 11 99999-9999",
          me: {
            id: `${clientId}@whatsapp.com`,
            pushName: `Cliente ${clientId}`,
            name: `Cliente ${clientId}`,
          },
        }
      }
    }, 15000)

    return NextResponse.json({
      success: true,
      session: newSession,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao criar sessão",
      },
      { status: 500 },
    )
  }
}
