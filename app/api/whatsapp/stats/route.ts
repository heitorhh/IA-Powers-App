import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_NEON_DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    const period = searchParams.get("period") || "7d" // 7d, 30d, 90d

    if (!clientId) {
      return NextResponse.json({ success: false, error: "clientId é obrigatório" }, { status: 400 })
    }

    // Calcular data de início baseada no período
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Estatísticas gerais
    const generalStats = await sql`
      SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) as positive_messages,
        COUNT(CASE WHEN sentiment = 'negative' THEN 1 END) as negative_messages,
        COUNT(CASE WHEN sentiment = 'neutral' THEN 1 END) as neutral_messages,
        COUNT(CASE WHEN created_at >= ${startDate.toISOString()} THEN 1 END) as messages_in_period,
        COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as messages_today
      FROM whatsapp_messages 
      WHERE client_id = ${clientId}
    `

    // Estatísticas por dia
    const dailyStats = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as message_count,
        COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) as positive_count,
        COUNT(CASE WHEN sentiment = 'negative' THEN 1 END) as negative_count,
        COUNT(CASE WHEN sentiment = 'neutral' THEN 1 END) as neutral_count
      FROM whatsapp_messages 
      WHERE client_id = ${clientId} 
        AND created_at >= ${startDate.toISOString()}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `

    // Top remetentes
    const topSenders = await sql`
      SELECT 
        from_number,
        COUNT(*) as message_count,
        COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) as positive_count,
        COUNT(CASE WHEN sentiment = 'negative' THEN 1 END) as negative_count,
        MAX(created_at) as last_message
      FROM whatsapp_messages 
      WHERE client_id = ${clientId} 
        AND created_at >= ${startDate.toISOString()}
      GROUP BY from_number
      ORDER BY message_count DESC
      LIMIT 10
    `

    // Estatísticas de webhooks
    const webhookStats = await sql`
      SELECT 
        w.id,
        w.name,
        w.platform,
        w.status,
        w.message_count,
        w.last_received,
        COUNT(m.id) as recent_messages
      FROM webhooks w
      LEFT JOIN whatsapp_messages m ON w.id = m.webhook_id 
        AND m.created_at >= ${startDate.toISOString()}
      WHERE w.client_id = ${clientId}
      GROUP BY w.id, w.name, w.platform, w.status, w.message_count, w.last_received
      ORDER BY w.created_at DESC
    `

    // Análise de horários (mensagens por hora do dia)
    const hourlyAnalysis = await sql`
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as message_count
      FROM whatsapp_messages 
      WHERE client_id = ${clientId} 
        AND created_at >= ${startDate.toISOString()}
      GROUP BY EXTRACT(HOUR FROM created_at)
      ORDER BY hour
    `

    // Palavras-chave mais comuns (análise simples)
    const keywordAnalysis = await sql`
      SELECT 
        sentiment,
        COUNT(*) as count,
        ROUND(AVG(LENGTH(message))) as avg_message_length
      FROM whatsapp_messages 
      WHERE client_id = ${clientId} 
        AND created_at >= ${startDate.toISOString()}
      GROUP BY sentiment
    `

    const stats = generalStats[0]

    return NextResponse.json({
      success: true,
      period,
      summary: {
        totalMessages: Number.parseInt(stats.total_messages),
        messagesInPeriod: Number.parseInt(stats.messages_in_period),
        messagesToday: Number.parseInt(stats.messages_today),
        positiveMessages: Number.parseInt(stats.positive_messages),
        negativeMessages: Number.parseInt(stats.negative_messages),
        neutralMessages: Number.parseInt(stats.neutral_messages),
        sentimentDistribution: {
          positive: Number.parseInt(stats.positive_messages),
          negative: Number.parseInt(stats.negative_messages),
          neutral: Number.parseInt(stats.neutral_messages),
        },
      },
      dailyStats: dailyStats.map((day) => ({
        date: day.date,
        messageCount: Number.parseInt(day.message_count),
        positiveCount: Number.parseInt(day.positive_count),
        negativeCount: Number.parseInt(day.negative_count),
        neutralCount: Number.parseInt(day.neutral_count),
      })),
      topSenders: topSenders.map((sender) => ({
        phoneNumber: sender.from_number,
        messageCount: Number.parseInt(sender.message_count),
        positiveCount: Number.parseInt(sender.positive_count),
        negativeCount: Number.parseInt(sender.negative_count),
        lastMessage: sender.last_message,
      })),
      webhooks: webhookStats.map((webhook) => ({
        id: webhook.id,
        name: webhook.name,
        platform: webhook.platform,
        status: webhook.status,
        totalMessages: Number.parseInt(webhook.message_count || 0),
        recentMessages: Number.parseInt(webhook.recent_messages),
        lastReceived: webhook.last_received,
      })),
      hourlyAnalysis: hourlyAnalysis.map((hour) => ({
        hour: Number.parseInt(hour.hour),
        messageCount: Number.parseInt(hour.message_count),
      })),
      keywordAnalysis: keywordAnalysis.map((analysis) => ({
        sentiment: analysis.sentiment,
        count: Number.parseInt(analysis.count),
        avgMessageLength: Number.parseInt(analysis.avg_message_length),
      })),
    })
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, action } = body

    if (!clientId || !action) {
      return NextResponse.json({ success: false, error: "Campos obrigatórios: clientId, action" }, { status: 400 })
    }

    switch (action) {
      case "reset_stats":
        // Resetar estatísticas (manter mensagens, resetar contadores)
        await sql`
          UPDATE webhooks 
          SET message_count = 0, last_received = NULL 
          WHERE client_id = ${clientId}
        `

        await sql`
          DELETE FROM webhook_stats 
          WHERE client_id = ${clientId}
        `

        return NextResponse.json({
          success: true,
          message: "Estatísticas resetadas com sucesso",
        })

      case "recalculate_stats":
        // Recalcular estatísticas baseado nas mensagens existentes
        const webhooks = await sql`
          SELECT id FROM webhooks WHERE client_id = ${clientId}
        `

        for (const webhook of webhooks) {
          const messageCount = await sql`
            SELECT COUNT(*) as count 
            FROM whatsapp_messages 
            WHERE webhook_id = ${webhook.id}
          `

          const lastMessage = await sql`
            SELECT MAX(created_at) as last_received 
            FROM whatsapp_messages 
            WHERE webhook_id = ${webhook.id}
          `

          await sql`
            UPDATE webhooks 
            SET 
              message_count = ${Number.parseInt(messageCount[0].count)},
              last_received = ${lastMessage[0].last_received}
            WHERE id = ${webhook.id}
          `
        }

        return NextResponse.json({
          success: true,
          message: "Estatísticas recalculadas com sucesso",
        })

      default:
        return NextResponse.json({ success: false, error: "Ação não reconhecida" }, { status: 400 })
    }
  } catch (error) {
    console.error("Erro ao processar ação:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}
