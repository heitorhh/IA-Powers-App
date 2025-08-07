import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Simular dados de teste
    const testData = {
      message: "WhatsApp API está funcionando!",
      timestamp: new Date().toISOString(),
      endpoints: {
        sessions: "/api/whatsapp/sessions",
        messages: "/api/whatsapp/messages",
        chats: "/api/whatsapp/chats",
        webhook: "/api/webhook/whatsapp",
        health: "/api/whatsapp/health",
      },
      features: [
        "Criação de sessões",
        "Geração de QR Code",
        "Envio de mensagens",
        "Recebimento via webhook",
        "Análise de sentimentos",
        "Monitoramento de conversas",
      ],
    }

    return NextResponse.json({
      success: true,
      data: testData,
    })
  } catch (error) {
    console.error("Test endpoint error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Test endpoint failed",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Simular processamento de teste
    const result = {
      received: body,
      processed: true,
      timestamp: new Date().toISOString(),
      testId: `test_${Date.now()}`,
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Test POST error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Test POST failed",
      },
      { status: 500 },
    )
  }
}
