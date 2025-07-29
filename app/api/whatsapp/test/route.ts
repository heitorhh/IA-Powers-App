import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Testar geração de QR Code
    const testData = {
      sessionId: `test_${Date.now()}`,
      clientId: "test",
      timestamp: Date.now(),
      server: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    }

    const qrData = JSON.stringify(testData)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&data=${encodeURIComponent(qrData)}`

    return NextResponse.json({
      success: true,
      message: "API WhatsApp funcionando corretamente",
      test: {
        qrCodeUrl,
        qrData,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Erro no teste da API WhatsApp",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
