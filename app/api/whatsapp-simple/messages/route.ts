import { type NextRequest, NextResponse } from "next/server"
import { whatsappManager } from "@/lib/whatsapp-web-simple"

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

    const chats = await whatsappManager.getChats(sessionId)

    return NextResponse.json({
      success: true,
      chats,
    })
  } catch (error) {
    console.error("Error getting chats:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to get chats",
      details: error instanceof Error ? error.message : "Unknown error",
      chats: []
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, to, message } = await request.json()

    if (!sessionId || !to || !message) {
      return NextResponse.json({ 
        success: false, 
        error: "Session ID, recipient, and message are required" 
      }, { status: 400 })
    }

    await whatsappManager.sendMessage(sessionId, to, message)

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to send message",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
