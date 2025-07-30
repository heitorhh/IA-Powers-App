import { type NextRequest, NextResponse } from "next/server"

// Função para análise de sentimentos
function analyzeSentiment(text: string) {
  const positiveWords = [
    "ótimo",
    "excelente",
    "obrigado",
    "parabéns",
    "sucesso",
    "feliz",
    "bom",
    "perfeito",
    "maravilhoso",
    "fantástico",
    "adorei",
    "amei",
    "incrível",
    "show",
    "top",
  ]

  const negativeWords = [
    "problema",
    "urgente",
    "estresse",
    "difícil",
    "preocupado",
    "cansado",
    "ruim",
    "péssimo",
    "horrível",
    "odeio",
    "raiva",
    "irritado",
    "chateado",
    "triste",
    "mal",
  ]

  const words = text.toLowerCase().split(/\s+/)
  let score = 0
  let positiveCount = 0
  let negativeCount = 0

  words.forEach((word) => {
    if (positiveWords.some((pw) => word.includes(pw))) {
      score += 0.3
      positiveCount++
    }
    if (negativeWords.some((nw) => word.includes(nw))) {
      score -= 0.3
      negativeCount++
    }
  })

  // Normalizar score
  const normalizedScore = Math.max(-1, Math.min(1, score))
  const sentiment = normalizedScore > 0.2 ? "positive" : normalizedScore < -0.2 ? "negative" : "neutral"

  // Calcular confiança baseada na quantidade de palavras encontradas
  const totalEmotionalWords = positiveCount + negativeCount
  const confidence = Math.min(0.95, 0.5 + totalEmotionalWords * 0.15)

  return {
    sentiment,
    score: normalizedScore,
    confidence,
    details: {
      positiveWords: positiveCount,
      negativeWords: negativeCount,
      totalWords: words.length,
    },
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")
    const days = Number.parseInt(searchParams.get("days") || "7")

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "Session ID é obrigatório",
        },
        { status: 400 },
      )
    }

    // Simular busca de conversas dos últimos X dias
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    // Dados simulados de conversas dos últimos 7 dias
    const mockChats = [
      {
        id: "5511999991111@c.us",
        name: "Carlos Mendes - Gerente",
        lastMessage: "Preciso urgente do relatório financeiro. Quando fica pronto?",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        unreadCount: 2,
        avatar: "/placeholder.svg?height=40&width=40",
        messages: [
          {
            id: "msg1",
            body: "Bom dia! Preciso urgente do relatório financeiro.",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            fromMe: false,
            author: "Carlos Mendes",
          },
          {
            id: "msg2",
            body: "Quando consegue entregar?",
            timestamp: new Date(Date.now() - 3500000).toISOString(),
            fromMe: false,
            author: "Carlos Mendes",
          },
          {
            id: "msg3",
            body: "Vou entregar até o final do dia de hoje.",
            timestamp: new Date(Date.now() - 3400000).toISOString(),
            fromMe: true,
            author: "Você",
          },
          {
            id: "msg4",
            body: "Perfeito! Obrigado pela agilidade.",
            timestamp: new Date(Date.now() - 300000).toISOString(),
            fromMe: false,
            author: "Carlos Mendes",
          },
        ],
      },
      {
        id: "5511999992222@c.us",
        name: "Ana Silva - Marketing",
        lastMessage: "Ótima apresentação hoje! Parabéns pela dedicação 👏",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        unreadCount: 0,
        avatar: "/placeholder.svg?height=40&width=40",
        messages: [
          {
            id: "msg5",
            body: "Oi! Vi sua apresentação hoje.",
            timestamp: new Date(Date.now() - 2000000).toISOString(),
            fromMe: false,
            author: "Ana Silva",
          },
          {
            id: "msg6",
            body: "Ficou excelente! Parabéns pelo trabalho.",
            timestamp: new Date(Date.now() - 1900000).toISOString(),
            fromMe: false,
            author: "Ana Silva",
          },
          {
            id: "msg7",
            body: "Muito obrigado! Fico feliz que tenha gostado.",
            timestamp: new Date(Date.now() - 1850000).toISOString(),
            fromMe: true,
            author: "Você",
          },
          {
            id: "msg8",
            body: "Adorei mesmo! Vamos usar essas ideias no próximo projeto.",
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            fromMe: false,
            author: "Ana Silva",
          },
        ],
      },
      {
        id: "5511999994444@c.us",
        name: "João Santos - Vendas",
        lastMessage: "Estou muito estressado com essas demandas. Não consigo dar conta de tudo...",
        timestamp: new Date(Date.now() - 900000).toISOString(),
        unreadCount: 1,
        avatar: "/placeholder.svg?height=40&width=40",
        messages: [
          {
            id: "msg9",
            body: "Oi, tudo bem?",
            timestamp: new Date(Date.now() - 1200000).toISOString(),
            fromMe: false,
            author: "João Santos",
          },
          {
            id: "msg10",
            body: "Estou muito sobrecarregado com os projetos.",
            timestamp: new Date(Date.now() - 1100000).toISOString(),
            fromMe: false,
            author: "João Santos",
          },
          {
            id: "msg11",
            body: "Não estou conseguindo dar conta de tudo...",
            timestamp: new Date(Date.now() - 1000000).toISOString(),
            fromMe: false,
            author: "João Santos",
          },
          {
            id: "msg12",
            body: "Posso te ajudar com alguma coisa?",
            timestamp: new Date(Date.now() - 950000).toISOString(),
            fromMe: true,
            author: "Você",
          },
          {
            id: "msg13",
            body: "Estou muito estressado... preciso de uma pausa.",
            timestamp: new Date(Date.now() - 900000).toISOString(),
            fromMe: false,
            author: "João Santos",
          },
        ],
      },
      {
        id: "5511999995555@c.us",
        name: "Maria Costa - RH",
        lastMessage: "Vamos marcar uma reunião para discutir o feedback da equipe?",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        unreadCount: 0,
        avatar: "/placeholder.svg?height=40&width=40",
        messages: [
          {
            id: "msg14",
            body: "Oi! Preciso conversar sobre o feedback da equipe.",
            timestamp: new Date(Date.now() - 7500000).toISOString(),
            fromMe: false,
            author: "Maria Costa",
          },
          {
            id: "msg15",
            body: "Claro! Quando você tem disponibilidade?",
            timestamp: new Date(Date.now() - 7400000).toISOString(),
            fromMe: true,
            author: "Você",
          },
          {
            id: "msg16",
            body: "Que tal amanhã às 14h?",
            timestamp: new Date(Date.now() - 7300000).toISOString(),
            fromMe: false,
            author: "Maria Costa",
          },
          {
            id: "msg17",
            body: "Perfeito! Vou agendar.",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            fromMe: true,
            author: "Você",
          },
        ],
      },
    ]

    // Analisar sentimentos de todas as mensagens
    const chatsWithSentiment = mockChats.map((chat) => {
      const allMessages = chat.messages
      const sentimentAnalysis = allMessages.map((msg) => ({
        ...msg,
        sentiment: analyzeSentiment(msg.body),
      }))

      // Calcular sentimento geral da conversa
      const sentiments = sentimentAnalysis.map((m) => m.sentiment.score)
      const avgSentiment = sentiments.reduce((acc, score) => acc + score, 0) / sentiments.length
      const overallSentiment = avgSentiment > 0.2 ? "positive" : avgSentiment < -0.2 ? "negative" : "neutral"

      return {
        ...chat,
        messages: sentimentAnalysis,
        overallSentiment: {
          sentiment: overallSentiment,
          score: avgSentiment,
          confidence: Math.min(0.95, 0.6 + Math.abs(avgSentiment) * 0.4),
          messageCount: allMessages.length,
        },
      }
    })

    // Estatísticas gerais
    const totalMessages = chatsWithSentiment.reduce((acc, chat) => acc + chat.messages.length, 0)
    const positiveChats = chatsWithSentiment.filter((chat) => chat.overallSentiment.sentiment === "positive").length
    const negativeChats = chatsWithSentiment.filter((chat) => chat.overallSentiment.sentiment === "negative").length
    const neutralChats = chatsWithSentiment.filter((chat) => chat.overallSentiment.sentiment === "neutral").length

    return NextResponse.json({
      success: true,
      data: {
        chats: chatsWithSentiment,
        summary: {
          totalChats: chatsWithSentiment.length,
          totalMessages,
          sentimentDistribution: {
            positive: positiveChats,
            negative: negativeChats,
            neutral: neutralChats,
          },
          period: {
            days,
            from: cutoffDate.toISOString(),
            to: new Date().toISOString(),
          },
        },
      },
      message: `${chatsWithSentiment.length} conversas analisadas dos últimos ${days} dias`,
    })
  } catch (error) {
    console.error("Erro ao buscar conversas:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao buscar conversas",
      },
      { status: 500 },
    )
  }
}
