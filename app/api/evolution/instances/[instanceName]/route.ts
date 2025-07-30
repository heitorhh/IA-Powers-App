import { type NextRequest, NextResponse } from "next/server"
import { getEvolutionManager } from "@/lib/evolution-api"

export async function GET(request: NextRequest, { params }: { params: { instanceName: string } }) {
  try {
    const instanceName = params.instanceName

    const manager = getEvolutionManager()
    const api = manager.getInstance(instanceName)

    // Buscar status da instância
    const status = await api.getInstanceStatus(instanceName)

    // Se conectado, buscar perfil
    let profile = null
    if (status.status === "open") {
      try {
        profile = await api.getProfile(instanceName)
      } catch (error) {
        console.log("Erro ao buscar perfil:", error)
      }
    }

    // Se aguardando QR, buscar QR Code
    let qrData = null
    if (status.status === "close" || status.status === "connecting") {
      try {
        const qr = await api.getQRCode(instanceName)
        qrData = qr
      } catch (error) {
        console.log("QR Code não disponível ainda")
      }
    }

    return NextResponse.json({
      success: true,
      instance: {
        instanceName,
        status: status.status,
        qr: qrData?.base64 ? `data:image/png;base64,${qrData.base64}` : null,
        profile,
        serverUrl: status.serverUrl,
        lastUpdate: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Erro ao buscar instância:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar instância",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { instanceName: string } }) {
  try {
    const instanceName = params.instanceName

    const manager = getEvolutionManager()
    const api = manager.getInstance(instanceName)

    // Desconectar e deletar instância
    await api.logoutInstance(instanceName)
    await api.deleteInstance(instanceName)

    // Remover do cache
    manager.removeInstance(instanceName)

    return NextResponse.json({
      success: true,
      message: "Instância removida com sucesso",
    })
  } catch (error) {
    console.error("Erro ao remover instância:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao remover instância",
      },
      { status: 500 },
    )
  }
}
