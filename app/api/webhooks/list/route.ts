import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")

    if (!clientId) {
      return NextResponse.json({ success: false, error: "clientId é obrigatório" }, { status: 400 })
    }

    // Buscar webhooks do cliente
    const webhooks = await sql`
      SELECT 
        id,
        client_id,
        name,
        url,
        platform,
        status,
        user_role,
        message_count,
        last_received,
        ai_enabled,
        created_at,
        updated_at
      FROM webhooks 
      WHERE client_id = ${clientId}
      ORDER BY created_at DESC
    `

    // Formatar dados para o frontend
    const formattedWebhooks = webhooks.map((webhook) => ({
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      platform: webhook.platform,
      status: webhook.status,
      messageCount: webhook.message_count || 0,
      lastReceived: webhook.last_received,
      aiEnabled: webhook.ai_enabled,
      createdAt: webhook.created_at,
    }))

    return NextResponse.json({
      success: true,
      webhooks: formattedWebhooks,
      total: webhooks.length,
    })
  } catch (error) {
    console.error("Erro ao listar webhooks:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const webhookId = searchParams.get("webhookId")
    const clientId = searchParams.get("clientId")

    if (!webhookId || !clientId) {
      return NextResponse.json({ success: false, error: "webhookId e clientId são obrigatórios" }, { status: 400 })
    }

    // Deletar webhook
    const result = await sql`
      DELETE FROM webhooks 
      WHERE id = ${webhookId} AND client_id = ${clientId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ success: false, error: "Webhook não encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Webhook deletado com sucesso",
    })
  } catch (error) {
    console.error("Erro ao deletar webhook:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}
