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

    // Atualizar última atividade
    session.lastActivity = new Date().toISOString()

    return NextResponse.json({
      success: true,
      session: {
        id: sessionId,
        ...session.client.getStatus(),
      },
    })
  } catch (error) {
    console.error("Erro ao verificar status da sessão:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao verificar status da sessão",
      },
      { status: 500 },
    )
  }
}
