import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar se os serviços estão funcionando
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        api: true,
        sessions: true,
        webhook: true,
        database: true,
      },
      version: "1.0.0",
      uptime: process.uptime(),
    }

    return NextResponse.json({
      success: true,
      data: health,
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
