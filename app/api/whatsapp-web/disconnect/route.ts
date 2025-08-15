import { type NextRequest, NextResponse } from "next/server"

// Importar o mapa de sessões (em produção, use um banco de dados)
const sessions = new Map<string, any>()

export async function DELETE(request: NextRequest) {
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

    // Destruir cliente WhatsApp Web
    if (session.client) {
      session.client.destroy()
    }

    // Remover sessão do mapa
    sessions.delete(sessionId)

    console.log(`Sessão ${sessionId} desconectada e removida`)

    return NextResponse.json({
      success: true,
      message: "Sessão desconectada com sucesso",
    })
  } catch (error) {
    console.error("Erro ao desconectar sessão:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao desconectar sessão",
      },
      { status: 500 },
    )
  }
}
