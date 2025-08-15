import { type NextRequest, NextResponse } from "next/server"

// Função para analisar sentimento (versão simples)
function analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
  const positiveWords = [
    "obrigado",
    "obrigada",
    "parabéns",
    "excelente",
    "ótimo",
    "bom",
    "perfeito",
    "maravilhoso",
    "fantástico",
    "incrível",
    "adorei",
    "amei",
    "feliz",
    "alegre",
    "satisfeito",
    "contente",
    "grato",
    "grata",
    "sucesso",
    "legal",
    "show",
  ]

  const negativeWords = [
    "ruim",
    "péssimo",
    "horrível",
    "terrível",
    "ódio",
    "raiva",
    "irritado",
    "chateado",
    "triste",
    "decepcionado",
    "problema",
    "erro",
    "falha",
    "defeito",
    "reclamação",
    "insatisfeito",
    "cancelar",
    "devolver",
  ]

  const lowerText = text.toLowerCase()

  const positiveCount = positiveWords.filter((word) => lowerText.includes(word)).length
  const negativeCount = negativeWords.filter((word) => lowerText.includes(word)).length

  if (positiveCount > negativeCount) return "positive"
  if (negativeCount > positiveCount) return "negative"
  return "neutral"
}

// Função para gerar resposta da IA (versão simples)
function generateAIResponse(message: string, sentiment: string): string {
  const responses = {
    positive: [
      "Que bom saber que você está satisfeito! 😊",
      "Fico feliz em ajudar! Como posso continuar te auxiliando?",
      "Obrigado pelo feedback positivo! Estou aqui para o que precisar.",
      "É um prazer atendê-lo! Há mais alguma coisa que posso fazer?",
    ],
    negative: [
      "Entendo sua preocupação. Vou fazer o possível para resolver isso.",
      "Lamento que tenha tido essa experiência. Como posso melhorar a situação?",
      "Peço desculpas pelo inconveniente. Vamos resolver isso juntos.",
      "Sua opinião é muito importante. Vou encaminhar para nossa equipe.",
    ],
    neutral: [
      "Olá! Como posso ajudá-lo hoje?",
      "Estou aqui para auxiliar. O que você precisa?",
      "Oi! Em que posso ser útil?",
      "Olá! Conte comigo para o que precisar.",
    ],
  }

  const responseList = responses[sentiment] || responses.neutral
  return responseList[Math.floor(Math.random() * responseList.length)]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("📨 Webhook recebido:", JSON.stringify(body, null, 2))

    // Verificar se é uma mensagem
    if (body.entry && body.entry[0] && body.entry[0].changes) {
      const changes = body.entry[0].changes[0]

      if (changes.value && changes.value.messages) {
        const message = changes.value.messages[0]
        const contact = changes.value.contacts ? changes.value.contacts[0] : null

        console.log("💬 Nova mensagem:", {
          from: message.from,
          text: message.text?.body,
          type: message.type,
          timestamp: message.timestamp,
        })

        // Analisar sentimento
        const messageText = message.text?.body || ""
        const sentiment = analyzeSentiment(messageText)

        console.log("🎭 Análise de sentimento:", {
          text: messageText,
          sentiment: sentiment,
        })

        // Gerar resposta da IA
        const aiResponse = generateAIResponse(messageText, sentiment)

        console.log("🤖 Resposta da IA:", aiResponse)

        // Aqui você pode:
        // 1. Salvar no banco de dados
        // 2. Enviar para outros sistemas
        // 3. Processar com IA mais avançada
        // 4. Enviar notificações

        // Simular processamento
        const processedData = {
          messageId: message.id,
          from: message.from,
          fromName: contact?.profile?.name || "Usuário",
          text: messageText,
          type: message.type,
          timestamp: new Date(Number.parseInt(message.timestamp) * 1000).toISOString(),
          sentiment: sentiment,
          aiResponse: aiResponse,
          processed: true,
          processedAt: new Date().toISOString(),
        }

        console.log("✅ Dados processados:", processedData)

        return NextResponse.json({
          success: true,
          message: "Webhook processado com sucesso",
          data: processedData,
        })
      }
    }

    // Se não for uma mensagem, apenas confirmar recebimento
    return NextResponse.json({
      success: true,
      message: "Webhook recebido (não é mensagem)",
    })
  } catch (error) {
    console.error("❌ Erro no webhook:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar webhook",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const mode = searchParams.get("hub.mode")
    const token = searchParams.get("hub.verify_token")
    const challenge = searchParams.get("hub.challenge")

    console.log("🔍 Verificação do webhook:", { mode, token, challenge })

    // Verificar token (use uma variável de ambiente em produção)
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "meu_token_secreto_123"

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verificado com sucesso!")
      return new NextResponse(challenge, { status: 200 })
    } else {
      console.log("❌ Falha na verificação do webhook")
      return NextResponse.json({ error: "Token de verificação inválido" }, { status: 403 })
    }
  } catch (error) {
    console.error("❌ Erro na verificação do webhook:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
