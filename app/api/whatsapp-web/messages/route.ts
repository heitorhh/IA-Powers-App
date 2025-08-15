import { type NextRequest, NextResponse } from "next/server"

// Importar o mapa de sessões (em produção, use um banco de dados)
const sessions = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, to, message } = body

    if (!sessionId || !to || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "SessionId, to e message são obrigatórios",
        },
        { status: 400 },
      )
    }

    // Verificar se a sessão existe
    if (!sessions.has(sessionId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Sessão não encontrada",
        },
        { status: 404 },
      )
    }

    const session = sessions.get(sessionId)

    // Verificar se o cliente está pronto
    if (session.client.getStatus().status !== "ready") {
      return NextResponse.json(
        {
          success: false,
          error: "Cliente WhatsApp não está pronto",
        },
        { status: 400 },
      )
    }

    // Enviar mensagem
    const result = await session.client.sendMessage(to, message)

    return NextResponse.json({
      success: true,
      result,
      message: "Mensagem enviada com sucesso",
    })
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao enviar mensagem",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "SessionId é obrigatório",
        },
        { status: 400 },
      )
    }

    // Verificar se a sessão existe
    if (!sessions.has(sessionId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Sessão não encontrada",
        },
        { status: 404 },
      )
    }

    const session = sessions.get(sessionId)

    // Verificar se o cliente está pronto
    if (session.client.getStatus().status !== "ready") {
      return NextResponse.json({
        success: true,
        messages: [],
        summary: {
          totalMessages: 0,
          lastUpdate: new Date().toISOString(),
        },
      })
    }

    // Buscar mensagens recentes (simulado)
    const messages = [
      {
        id: "msg_1",
        from: "5511999991111@c.us",
        fromName: "João Silva",
        body: "Olá! Como posso ajudar?",
        timestamp: Date.now() - 300000,
        fromMe: false,
        sentiment: "neutral",
      },
      {
        id: "msg_2",
        from: "5511999992222@c.us",
        fromName: "Maria Santos",
        body: "Obrigada pelo excelente atendimento!",
        timestamp: Date.now() - 1800000,
        fromMe: false,
        sentiment: "positive",
      },
    ]

    return NextResponse.json({
      success: true,
      messages,
      summary: {
        totalMessages: messages.length,
        sentimentDistribution: {
          positive: messages.filter((m) => m.sentiment === "positive").length,
          negative: messages.filter((m) => m.sentiment === "negative").length,
          neutral: messages.filter((m) => m.sentiment === "neutral").length,
        },
        lastUpdate: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar mensagens",
      },
      { status: 500 },
    )
  }
}
