import { type NextRequest, NextResponse } from "next/server"

// Simulação de armazenamento em memória
const sessions: any[] = []

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

    return NextResponse.json({
      success: true,
      session: session,
    })
  } catch (error) {
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

    sessions.splice(sessionIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Sessão removida com sucesso",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao remover sessão",
      },
      { status: 500 },
    )
  }
}
