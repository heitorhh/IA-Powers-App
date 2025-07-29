import { type NextRequest, NextResponse } from "next/server"

// Simulação de armazenamento em memória
let sessions: any[] = []

export async function GET(request: NextRequest, { params }: { params: { sessionName: string } }) {
  try {
    const sessionName = params.sessionName
    const session = sessions.find((s) => s.name === sessionName || s.id === sessionName)

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Sessão não encontrada",
        },
        { status: 404 },
      )
    }

    // Verificar se o QR Code expirou
    if (session.status === "SCAN_QR_CODE" && session.expiresAt) {
      const now = new Date().getTime()
      const expires = new Date(session.expiresAt).getTime()

      if (now > expires) {
        session.status = "EXPIRED"
        session.qr = undefined
        session.qrData = undefined
      }
    }

    return NextResponse.json({
      success: true,
      session: session,
    })
  } catch (error) {
    console.error("Erro ao buscar sessão:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar sessão",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { sessionName: string } }) {
  try {
    const sessionName = params.sessionName
    const sessionIndex = sessions.findIndex((s) => s.name === sessionName || s.id === sessionName)

    if (sessionIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Sessão não encontrada",
        },
        { status: 404 },
      )
    }

    // Remover sessão
    const removedSession = sessions.splice(sessionIndex, 1)[0]
    console.log(`Sessão ${removedSession.name} desconectada`)

    return NextResponse.json({
      success: true,
      message: "Sessão removida com sucesso",
      session: removedSession,
    })
  } catch (error) {
    console.error("Erro ao remover sessão:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao remover sessão",
      },
      { status: 500 },
    )
  }
}

// Permitir que outras partes do código acessem as sessões
export function getSessions() {
  return sessions
}

export function setSessions(newSessions: any[]) {
  sessions = newSessions
}
