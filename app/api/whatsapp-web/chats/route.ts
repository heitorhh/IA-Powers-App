import { type NextRequest, NextResponse } from "next/server"

// Importar o mapa de sessões (em produção, use um banco de dados)
const sessions = new Map<string, any>()

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
      return NextResponse.json(
        {
          success: false,
          error: "Cliente WhatsApp não está pronto",
        },
        { status: 400 },
      )
    }

    // Buscar chats
    const chats = await session.client.getChats()

    return NextResponse.json({
      success: true,
      chats,
      summary: {
        totalChats: chats.length,
        totalMessages: chats.reduce((sum: number, chat: any) => sum + (chat.unreadCount || 0), 0),
        lastUpdate: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Erro ao buscar chats:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar chats",
      },
      { status: 500 },
    )
  }
}
