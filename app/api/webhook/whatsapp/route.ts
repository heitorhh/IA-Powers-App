import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("Webhook recebido:", body)

    // Processar webhook do WhatsApp
    if (body.event === "message" && body.data) {
      // Reenviar para nossa API de mensagens para processamento
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/whatsapp/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body.data),
      })
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processado com sucesso",
    })
  } catch (error) {
    console.error("Erro no webhook:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar webhook",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Webhook endpoint ativo",
    timestamp: new Date().toISOString(),
  })
}
