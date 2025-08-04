import { type NextRequest, NextResponse } from "next/server"
import { whatsappManager } from "@/lib/whatsapp-web-simple"

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ 
        success: false, 
        error: "Session ID is required" 
      }, { status: 400 })
    }

    console.log(`Creating WhatsApp session: ${sessionId}`)
    const session = await whatsappManager.createSession(sessionId)

    return NextResponse.json({
      success: true,
      session: {
        id: sessionId,
        qr: session.qr,
        status: session.status,
        isReady: session.isReady,
      },
    })
  } catch (error) {
    console.error("Error creating WhatsApp session:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create session",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ 
        success: false, 
        error: "Session ID is required" 
      }, { status: 400 })
    }

    const session = whatsappManager.getSession(sessionId)

    if (!session) {
      return NextResponse.json({ 
        success: false, 
        error: "Session not found" 
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      session: {
        id: sessionId,
        qr: session.qr,
        status: session.status,
        isReady: session.isReady,
      },
    })
  } catch (error) {
    console.error("Error getting WhatsApp session:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to get session",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
