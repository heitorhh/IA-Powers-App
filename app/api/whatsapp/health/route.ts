import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      status: "healthy",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      features: ["WhatsApp Integration", "Sentiment Analysis", "Real-time Monitoring", "Dashboard Analytics"],
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Sistema indisponível",
      },
      { status: 500 },
    )
  }
}
