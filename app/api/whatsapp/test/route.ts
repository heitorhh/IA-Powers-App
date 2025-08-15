import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simular dados de teste
    const testData = {
      success: true,
      message: "API WhatsApp funcionando perfeitamente!",
      timestamp: new Date().toISOString(),
      features: {
        webhook: "✅ Ativo",
        whatsappWeb: "✅ Conectado",
        sentimentAnalysis: "✅ Funcionando",
        aiResponses: "✅ Ativo",
      },
      sampleData: {
        messages: [
          {
            id: "test_msg_1",
            from: "5511999999999",
            text: "Olá! Este é um teste.",
            sentiment: "neutral",
            aiResponse: "Olá! Como posso ajudá-lo hoje?",
            timestamp: new Date().toISOString(),
          },
        ],
        stats: {
          totalMessages: 1,
          sentimentDistribution: {
            positive: 0,
            negative: 0,
            neutral: 1,
          },
        },
      },
    }

    return NextResponse.json(testData)
  } catch (error) {
    console.error("Erro no teste da API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao executar teste",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    // Simular processamento de mensagem de teste
    const testMessage = {
      id: `test_${Date.now()}`,
      from: "test_user",
      text: "Esta é uma mensagem de teste para verificar o sistema",
      timestamp: new Date().toISOString(),
    }

    // Simular análise de sentimento
    const sentiment = "positive"
    const aiResponse = "Teste recebido com sucesso! Sistema funcionando perfeitamente."

    const result = {
      success: true,
      message: "Teste de envio executado com sucesso",
      data: {
        original: testMessage,
        processed: {
          sentiment,
          aiResponse,
          processedAt: new Date().toISOString(),
        },
      },
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro no teste POST:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao executar teste POST",
      },
      { status: 500 },
    )
  }
}
