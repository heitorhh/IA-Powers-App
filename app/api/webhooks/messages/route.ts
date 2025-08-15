import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    if (!clientId) {
      return NextResponse.json({ success: false, error: "clientId é obrigatório" }, { status: 400 })
    }

    // Buscar mensagens do cliente
    const messages = await sql`
      SELECT 
        id,
        client_id,
        from_number,
        message,
        timestamp,
        platform,
        sentiment,
        processed,
        webhook_id,
        created_at
      FROM whatsapp_messages 
      WHERE client_id = ${clientId}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    // Contar total de mensagens
    const totalResult = await sql`
      SELECT COUNT(*) as total
      FROM whatsapp_messages 
      WHERE client_id = ${clientId}
    `

    const total = Number.parseInt(totalResult[0].total)

    // Formatar mensagens para o frontend
    const formattedMessages = messages.map((message) => ({
      id: message.id,
      from: message.from_number,
      message: message.message,
      timestamp: message.timestamp,
      platform: message.platform,
      sentiment: message.sentiment,
      processed: message.processed,
      webhookId: message.webhook_id,
      createdAt: message.created_at,
    }))

    return NextResponse.json({
      success: true,
      messages: formattedMessages,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, from, message, platform = "manual" } = body

    if (!clientId || !from || !message) {
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios: clientId, from, message" },
        { status: 400 },
      )
    }

    // Análise de sentimento
    const sentiment = analyzeSentiment(message)

    // Salvar mensagem
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    await sql`
      INSERT INTO whatsapp_messages (
        id, client_id, from_number, message, timestamp, platform, sentiment, processed
      ) VALUES (
        ${messageId}, ${clientId}, ${from}, ${message}, 
        ${new Date().toISOString()}, ${platform}, ${sentiment}, true
      )
    `

    return NextResponse.json({
      success: true,
      message: "Mensagem salva com sucesso",
      data: {
        id: messageId,
        sentiment,
        processed: true,
      },
    })
  } catch (error) {
    console.error("Erro ao salvar mensagem:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

function analyzeSentiment(message: string): "positive" | "negative" | "neutral" {
  const positiveWords = [
    "obrigado",
    "obrigada",
    "ótimo",
    "excelente",
    "bom",
    "boa",
    "perfeito",
    "adorei",
    "parabéns",
    "sucesso",
    "feliz",
    "satisfeito",
    "maravilhoso",
    "incrível",
  ]

  const negativeWords = [
    "ruim",
    "péssimo",
    "problema",
    "erro",
    "reclamação",
    "insatisfeito",
    "cancelar",
    "horrível",
    "terrível",
    "decepcionado",
    "frustrado",
    "raiva",
    "chateado",
  ]

  const lowerMessage = message.toLowerCase()

  const positiveCount = positiveWords.filter((word) => lowerMessage.includes(word)).length
  const negativeCount = negativeWords.filter((word) => lowerMessage.includes(word)).length

  if (positiveCount > negativeCount) return "positive"
  if (negativeCount > positiveCount) return "negative"
  return "neutral"
}
