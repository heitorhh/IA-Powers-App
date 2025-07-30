import { type NextRequest, NextResponse } from "next/server"
import { getEvolutionManager } from "@/lib/evolution-api"

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
    "legal",
    "bacana",
    "massa",
    "demais",
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
    "terrível",
    "pior",
    "ódio",
    "nojo",
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

  // Calcular confiança
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
    const instanceName = searchParams.get("instanceName")
    const days = Number.parseInt(searchParams.get("days") || "7")

    if (!instanceName) {
      return NextResponse.json(
        {
          success: false,
          error: "Nome da instância é obrigatório",
        },
        { status: 400 },
      )
    }

    const manager = getEvolutionManager()
    const api = manager.getInstance(instanceName)

    // Verificar se instância está conectada
    const status = await api.getInstanceStatus(instanceName)
    if (status.status !== "open") {
      return NextResponse.json(
        {
          success: false,
          error: "Instância não está conectada",
        },
        { status: 400 },
      )
    }

    // Buscar conversas
    const chats = await api.getChats(instanceName)

    // Buscar mensagens recentes
    const messages = await api.getRecentMessages(instanceName, days)

    // Agrupar mensagens por conversa
    const chatMessagesMap = new Map()

    messages.forEach((message) => {
      const remoteJid = message.key.remoteJid
      if (!chatMessagesMap.has(remoteJid)) {
        chatMessagesMap.set(remoteJid, [])
      }
      chatMessagesMap.get(remoteJid).push(message)
    })

    // Processar conversas com análise de sentimentos
    const processedChats = chats
      .map((chat) => {
        const chatMessages = chatMessagesMap.get(chat.id) || []

        // Analisar sentimento de cada mensagem
        const messagesWithSentiment = chatMessages
          .map((message) => {
            const text = message.message?.conversation || message.message?.extendedTextMessage?.text || ""

            return {
              id: message.key.id,
              body: text,
              timestamp: new Date(message.messageTimestamp * 1000).toISOString(),
              fromMe: message.key.fromMe,
              author: message.key.fromMe ? "Você" : message.pushName || "Contato",
              sentiment: text ? analyzeSentiment(text) : null,
            }
          })
          .filter((msg) => msg.body) // Filtrar mensagens vazias

        // Calcular sentimento geral da conversa
        const sentiments = messagesWithSentiment.filter((msg) => msg.sentiment).map((msg) => msg.sentiment!.score)

        const avgSentiment =
          sentiments.length > 0 ? sentiments.reduce((acc, score) => acc + score, 0) / sentiments.length : 0

        const overallSentiment = avgSentiment > 0.2 ? "positive" : avgSentiment < -0.2 ? "negative" : "neutral"

        // Última mensagem
        const lastMessage = messagesWithSentiment.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )[0]

        return {
          id: chat.id,
          name: chat.name || chat.id.split("@")[0],
          lastMessage: lastMessage?.body || "Sem mensagens recentes",
          timestamp: lastMessage?.timestamp || new Date().toISOString(),
          unreadCount: 0, // Evolution API não fornece contagem de não lidas facilmente
          avatar: `/placeholder.svg?height=40&width=40&text=${encodeURIComponent(chat.name || "C")}`,
          messages: messagesWithSentiment,
          overallSentiment: {
            sentiment: overallSentiment,
            score: avgSentiment,
            confidence: Math.min(0.95, 0.6 + Math.abs(avgSentiment) * 0.4),
            messageCount: messagesWithSentiment.length,
          },
        }
      })
      .filter((chat) => chat.messages.length > 0) // Apenas conversas com mensagens

    // Estatísticas
    const totalMessages = processedChats.reduce((acc, chat) => acc + chat.messages.length, 0)
    const positiveChats = processedChats.filter((chat) => chat.overallSentiment.sentiment === "positive").length
    const negativeChats = processedChats.filter((chat) => chat.overallSentiment.sentiment === "negative").length
    const neutralChats = processedChats.filter((chat) => chat.overallSentiment.sentiment === "neutral").length

    return NextResponse.json({
      success: true,
      data: {
        chats: processedChats,
        summary: {
          totalChats: processedChats.length,
          totalMessages,
          sentimentDistribution: {
            positive: positiveChats,
            negative: negativeChats,
            neutral: neutralChats,
          },
          period: {
            days,
            from: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString(),
            to: new Date().toISOString(),
          },
        },
      },
      message: `${processedChats.length} conversas analisadas dos últimos ${days} dias`,
    })
  } catch (error) {
    console.error("Erro ao buscar conversas:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar conversas",
      },
      { status: 500 },
    )
  }
}
