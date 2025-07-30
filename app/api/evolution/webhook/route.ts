import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log("Evolution API Webhook recebido:", JSON.stringify(body, null, 2))

    const { event, instance, data } = body

    // Processar diferentes tipos de eventos
    switch (event) {
      case "qrcode.updated":
        console.log(`QR Code atualizado para instância ${instance}:`, data)
        // Aqui você pode notificar o frontend sobre o novo QR Code
        break

      case "connection.update":
        console.log(`Status de conexão atualizado para ${instance}:`, data.state)
        // Notificar sobre mudanças de status (conectado, desconectado, etc.)
        break

      case "messages.upsert":
        console.log(`Nova mensagem recebida na instância ${instance}:`, data)
        // Processar novas mensagens
        if (data.messages && Array.isArray(data.messages)) {
          for (const message of data.messages) {
            await processNewMessage(instance, message)
          }
        }
        break

      case "messages.update":
        console.log(`Mensagem atualizada na instância ${instance}:`, data)
        // Processar atualizações de mensagens (lida, entregue, etc.)
        break

      case "application.startup":
        console.log(`Instância ${instance} iniciada`)
        break

      default:
        console.log(`Evento não tratado: ${event}`)
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processado com sucesso",
    })
  } catch (error) {
    console.error("Erro no webhook Evolution API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar webhook",
      },
      { status: 500 },
    )
  }
}

async function processNewMessage(instance: string, message: any) {
  try {
    // Extrair informações da mensagem
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || ""

    if (!text) return // Ignorar mensagens sem texto

    const messageData = {
      instanceName: instance,
      messageId: message.key?.id,
      remoteJid: message.key?.remoteJid,
      fromMe: message.key?.fromMe,
      text: text,
      timestamp: message.messageTimestamp,
      pushName: message.pushName,
    }

    console.log("Processando mensagem:", messageData)

    // Aqui você pode:
    // 1. Salvar a mensagem no banco de dados
    // 2. Fazer análise de sentimento
    // 3. Enviar notificações
    // 4. Trigger de automações baseadas no conteúdo

    // Exemplo: análise básica de sentimento
    if (!messageData.fromMe && text.toLowerCase().includes("urgente")) {
      console.log("⚠️ Mensagem urgente detectada:", text)
      // Enviar alerta para o dashboard
    }

    // Se a mensagem contém palavras negativas, marcar para revisão
    const negativeWords = ["problema", "erro", "bug", "falha", "ruim"]
    if (negativeWords.some((word) => text.toLowerCase().includes(word))) {
      console.log("😞 Sentimento negativo detectado:", text)
      // Alertar equipe de suporte
    }
  } catch (error) {
    console.error("Erro ao processar mensagem:", error)
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Webhook Evolution API está ativo",
    timestamp: new Date().toISOString(),
  })
}
