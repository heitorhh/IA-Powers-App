import { type NextRequest, NextResponse } from "next/server"
import { getEvolutionManager } from "@/lib/evolution-api"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { instanceName, remoteJid, message } = body

    if (!instanceName || !remoteJid || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Parâmetros obrigatórios: instanceName, remoteJid, message",
        },
        { status: 400 },
      )
    }

    const manager = getEvolutionManager()
    const api = manager.getInstance(instanceName)

    // Verificar se instância está conectada
    const status = await api.getInstanceStatus(instanceName)
    if (status.status !== "open") {
      return NextResponse.json(
        {
          success: false,
          error: "Instância não está conectada",
        },
        { status: 400 },
      )
    }

    // Enviar mensagem
    const result = await api.sendMessage(instanceName, remoteJid, message)

    return NextResponse.json({
      success: true,
      message: "Mensagem enviada com sucesso",
      data: result,
    })
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao enviar mensagem",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const instanceName = searchParams.get("instanceName")
    const remoteJid = searchParams.get("remoteJid")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    if (!instanceName) {
      return NextResponse.json(
        {
          success: false,
          error: "Nome da instância é obrigatório",
        },
        { status: 400 },
      )
    }

    const manager = getEvolutionManager()
    const api = manager.getInstance(instanceName)

    let messages
    if (remoteJid) {
      // Buscar mensagens de um chat específico
      messages = await api.getMessages(instanceName, remoteJid, limit)
    } else {
      // Buscar mensagens recentes de todos os chats
      messages = await api.getRecentMessages(instanceName, 7)
    }

    // Formatar mensagens
    const formattedMessages = messages
      .map((message) => ({
        id: message.key?.id,
        remoteJid: message.key?.remoteJid,
        fromMe: message.key?.fromMe,
        text: message.message?.conversation || message.message?.extendedTextMessage?.text || "",
        timestamp: new Date(message.messageTimestamp * 1000).toISOString(),
        pushName: message.pushName,
        status: message.status,
      }))
      .filter((msg) => msg.text) // Filtrar mensagens sem texto

    return NextResponse.json({
      success: true,
      messages: formattedMessages,
      total: formattedMessages.length,
    })
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar mensagens",
      },
      { status: 500 },
    )
  }
}
