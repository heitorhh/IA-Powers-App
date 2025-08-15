import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, platform, url, userRole } = body

    if (!clientId || !platform || !url) {
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios: clientId, platform, url" },
        { status: 400 },
      )
    }

    // Gerar ID único para o webhook
    const webhookId = `${clientId}_${Date.now()}`

    // Criar registro do webhook
    await sql`
      INSERT INTO webhooks (
        id, client_id, name, url, platform, status, user_role, 
        message_count, ai_enabled, created_at
      ) VALUES (
        ${webhookId}, ${clientId}, 
        ${`${platform.charAt(0).toUpperCase() + platform.slice(1)} Webhook`},
        ${url}, ${platform}, 'active', ${userRole}, 0, true, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        url = EXCLUDED.url,
        platform = EXCLUDED.platform,
        status = 'active',
        updated_at = NOW()
    `

    return NextResponse.json({
      success: true,
      message: "Webhook registrado com sucesso",
      data: {
        webhookId,
        url,
        platform,
        status: "active",
      },
    })
  } catch (error) {
    console.error("Erro ao registrar webhook:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")

    if (!clientId) {
      return NextResponse.json({ success: false, error: "clientId é obrigatório" }, { status: 400 })
    }

    const webhooks = await sql`
      SELECT * FROM webhooks 
      WHERE client_id = ${clientId}
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      success: true,
      webhooks: webhooks.map((webhook) => ({
        id: webhook.id,
        name: webhook.name,
        url: webhook.url,
        platform: webhook.platform,
        status: webhook.status,
        messageCount: webhook.message_count,
        lastReceived: webhook.last_received,
        aiEnabled: webhook.ai_enabled,
      })),
    })
  } catch (error) {
    console.error("Erro ao buscar webhooks:", error)
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}
