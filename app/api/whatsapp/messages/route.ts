import { type NextRequest, NextResponse } from "next/server"

// Simulação de mensagens em memória
let messages: any[] = [
  {
    id: "1",
    from: "5511999991111@c.us",
    to: "iapowers@c.us",
    body: "Preciso urgente do relatório financeiro. Quando fica pronto?",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    type: "text",
    sentiment: {
      sentiment: "negative",
      score: -0.4,
      confidence: 0.8,
    },
  },
  {
    id: "2",
    from: "5511999992222@c.us",
    to: "iapowers@c.us",
    body: "Ótima apresentação hoje! Parabéns pela dedicação 👏",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    type: "text",
    sentiment: {
      sentiment: "positive",
      score: 0.8,
      confidence: 0.9,
    },
  },
  {
    id: "3",
    from: "5511999994444@c.us",
    to: "iapowers@c.us",
    body: "Estou muito estressado com essas demandas. Não consigo dar conta de tudo...",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    type: "text",
    sentiment: {
      sentiment: "negative",
      score: -0.9,
      confidence: 0.95,
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const paginatedMessages = messages
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      messages: paginatedMessages,
      total: messages.length,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar mensagens",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Análise de sentimentos simples
    const analyzeSentiment = (text: string) => {
      const positiveWords = ["ótimo", "excelente", "obrigado", "parabéns", "sucesso", "feliz", "bom"]
      const negativeWords = ["problema", "urgente", "estresse", "difícil", "preocupado", "cansado", "ruim"]

      const words = text.toLowerCase().split(" ")
      let score = 0

      words.forEach((word) => {
        if (positiveWords.some((pw) => word.includes(pw))) score += 0.3
        if (negativeWords.some((nw) => word.includes(nw))) score -= 0.3
      })

      const normalizedScore = Math.max(-1, Math.min(1, score))
      const sentiment = normalizedScore > 0.2 ? "positive" : normalizedScore < -0.2 ? "negative" : "neutral"

      return {
        sentiment,
        score: normalizedScore,
        confidence: Math.abs(normalizedScore) + 0.5,
      }
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      from: body.from || "unknown@c.us",
      to: body.to || "iapowers@c.us",
      body: body.body || body.text || "",
      timestamp: new Date().toISOString(),
      type: body.type || "text",
      sentiment: analyzeSentiment(body.body || body.text || ""),
    }

    messages.unshift(newMessage)

    // Manter apenas as últimas 100 mensagens
    if (messages.length > 100) {
      messages = messages.slice(0, 100)
    }

    return NextResponse.json({
      success: true,
      message: newMessage,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar mensagem",
      },
      { status: 500 },
    )
  }
}
