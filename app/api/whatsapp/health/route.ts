import { NextResponse } from "next/server"

export async function GET() {
  try {
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        webhook: {
          status: "active",
          url: "/api/whatsapp/webhook",
          lastCheck: new Date().toISOString(),
        },
        whatsappWeb: {
          status: "active",
          version: "whatsapp-web.js",
          lastCheck: new Date().toISOString(),
        },
        aiAnalysis: {
          status: "active",
          features: ["sentiment-analysis", "auto-response"],
          lastCheck: new Date().toISOString(),
        },
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        },
      },
      config: {
        webhookVerifyToken: process.env.WHATSAPP_VERIFY_TOKEN ? "configured" : "missing",
        baseUrl: process.env.NEXT_PUBLIC_APP_URL || "not-configured",
      },
    }

    return NextResponse.json(healthData)
  } catch (error) {
    console.error("Erro no health check:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Erro interno do servidor",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
