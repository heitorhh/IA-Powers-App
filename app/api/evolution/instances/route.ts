import { type NextRequest, NextResponse } from "next/server"
import { getEvolutionManager } from "@/lib/evolution-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const instanceName = searchParams.get("instanceName")

    const manager = getEvolutionManager()

    if (instanceName) {
      // Buscar instância específica
      const api = manager.getInstance(instanceName)
      const instance = await api.getInstanceStatus(instanceName)

      return NextResponse.json({
        success: true,
        instance,
      })
    } else {
      // Listar todas as instâncias
      const api = manager.getInstance("temp") // Usar instância temporária para listar
      const instances = await api.getAllInstances()

      return NextResponse.json({
        success: true,
        instances,
      })
    }
  } catch (error) {
    console.error("Evolution API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar instâncias",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { instanceName, clientId, userRole, webhookUrl } = body

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

    // URL do webhook personalizada
    const webhook = webhookUrl || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/evolution/webhook`

    // Criar instância
    const instance = await api.createInstance(instanceName, webhook)

    // Conectar instância (gerar QR Code)
    await api.connectInstance(instanceName)

    // Buscar QR Code
    let qrData = null
    try {
      const qr = await api.getQRCode(instanceName)
      qrData = qr
    } catch (error) {
      console.log("QR Code ainda não disponível, será gerado em breve")
    }

    return NextResponse.json({
      success: true,
      instance: {
        instanceName,
        clientId,
        userRole,
        status: instance.status || "connecting",
        qr: qrData?.base64 ? `data:image/png;base64,${qrData.base64}` : null,
        createdAt: new Date().toISOString(),
      },
      message: "Instância Evolution API criada com sucesso",
    })
  } catch (error) {
    console.error("Erro ao criar instância:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao criar instância",
      },
      { status: 500 },
    )
  }
}
