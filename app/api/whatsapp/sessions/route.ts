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
    const { name } = body

    // Criar nova sessão
    const newSession = {
      id: `session_${Date.now()}`,
      name: name || `session_${Date.now()}`,
      status: "SCAN_QR_CODE",
      qr: `/placeholder.svg?height=200&width=200&text=QR+Code+WhatsApp`,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      config: {
        webhooks: [`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhook/whatsapp`],
      },
    }

    sessions.push(newSession)

    // Simular conexão após 10 segundos
    setTimeout(() => {
      const sessionIndex = sessions.findIndex((s) => s.id === newSession.id)
      if (sessionIndex !== -1) {
        sessions[sessionIndex] = {
          ...sessions[sessionIndex],
          status: "WORKING",
          qr: undefined,
          me: {
            id: "demo@whatsapp.com",
            pushName: "IA Powers Demo",
            name: "IA Powers Demo",
          },
        }
      }
    }, 10000)

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
