import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function POST(request: NextRequest, { params }: { params: { webhookId: string } }) {
  try {
    const { webhookId } = params
    const body = await request.json()

    // Validar dados obrigatórios
    if (!body.from || !body.message) {
      return NextResponse.json({ success: false, error: "Campos obrigatórios: from, message" }, { status: 400 })
    }

    // Extrair clientId do webhookId
    const clientId = webhookId.split("_")[0]

    // Verificar se o webhook existe e está ativo
    const webhook = await sql`
      SELECT * FROM webhooks 
      WHERE id = ${webhookId} AND client_id = ${clientId} AND status = 'active'
    `

    if (webhook.length === 0) {
      return NextResponse.json({ success: false, error: "Webhook não encontrado ou inativo" }, { status: 404 })
    }

    // Análise de sentimento simples
    const sentiment = analyzeSentiment(body.message)

    // Salvar mensagem
    await sql`
      INSERT INTO whatsapp_messages (
        id, client_id, from_number, message, timestamp, platform, sentiment, processed, webhook_id
      ) VALUES (
        ${generateId()}, ${clientId}, ${body.from}, ${body.message}, 
        ${body.timestamp || new Date().toISOString()}, ${body.platform || "make"}, 
        ${sentiment}, false, ${webhookId}
      )
    `

    // Atualizar contador do webhook
    await sql`
      UPDATE webhooks 
      SET message_count = message_count + 1, last_received = NOW()
      WHERE id = ${webhookId}
    `

    // Processar mensagem com IA (se configurado)
    if (webhook[0].ai_enabled) {
      await processMessageWithAI(clientId, body.from, body.message, sentiment)
    }

    return NextResponse.json({
      success: true,
      message: "Mensagem recebida e processada",
      data: {
        id: generateId(),
        sentiment,
        processed: true,
      },
    })
  } catch (error) {
    console.error("Erro ao processar webhook:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

function analyzeSentiment(message: string): "positive" | "negative" | "neutral" {
  const positiveWords = ["obrigado", "ótimo", "excelente", "bom", "perfeito", "adorei", "parabéns"]
  const negativeWords = ["ruim", "péssimo", "problema", "erro", "reclamação", "insatisfeito", "cancelar"]

  const lowerMessage = message.toLowerCase()

  const positiveCount = positiveWords.filter((word) => lowerMessage.includes(word)).length
  const negativeCount = negativeWords.filter((word) => lowerMessage.includes(word)).length

  if (positiveCount > negativeCount) return "positive"
  if (negativeCount > positiveCount) return "negative"
  return "neutral"
}

async function processMessageWithAI(clientId: string, from: string, message: string, sentiment: string) {
  try {
    // Aqui você pode integrar com IA para gerar respostas automáticas
    // Por exemplo, usando o XAI (Grok) que está disponível

    // Salvar sugestão de resposta
    await sql`
      INSERT INTO ai_suggestions (
        id, client_id, from_number, original_message, sentiment, suggestion, confidence, created_at
      ) VALUES (
        ${generateId()}, ${clientId}, ${from}, ${message}, ${sentiment}, 
        ${"Sugestão de resposta baseada na mensagem"}, 0.8, NOW()
      )
    `
  } catch (error) {
    console.error("Erro ao processar com IA:", error)
  }
}

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
