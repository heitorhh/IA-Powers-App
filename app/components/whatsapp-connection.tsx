"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Smartphone, QrCode, CheckCircle, AlertCircle, RefreshCw, WifiOff, Clock, Wifi } from "lucide-react"

interface WhatsAppConnectionProps {
  userRole: "simple" | "leader" | "master"
  clientId: string
  onConnectionChange?: (connected: boolean) => void
}

interface Session {
  id: string
  name: string
  status: string
  qr?: string
  qrData?: string
  phone?: string
  expiresAt?: string
  me?: {
    id: string
    pushName: string
    name: string
    phone: string
  }
}

export default function WhatsAppConnection({ userRole, clientId, onConnectionChange }: WhatsAppConnectionProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)

  // Verificar sessão existente ao carregar
  useEffect(() => {
    checkExistingSession()
  }, [])

  // Polling para atualizar status da sessão
  useEffect(() => {
    if (session && (session.status === "SCAN_QR_CODE" || session.status === "CONNECTING")) {
      const interval = setInterval(() => {
        checkSessionStatus()
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [session])

  // Timer para expiração do QR Code
  useEffect(() => {
    if (session && session.status === "SCAN_QR_CODE" && session.expiresAt) {
      const updateTimer = () => {
        const now = new Date().getTime()
        const expires = new Date(session.expiresAt!).getTime()
        const remaining = Math.max(0, expires - now)
        setTimeLeft(Math.floor(remaining / 1000))

        if (remaining <= 0) {
          setSession({ ...session, status: "EXPIRED" })
        }
      }

      updateTimer()
      const interval = setInterval(updateTimer, 1000)
      return () => clearInterval(interval)
    }
  }, [session])

  const checkExistingSession = async () => {
    try {
      const response = await fetch("/api/whatsapp/sessions")
      const data = await response.json()

      if (data.success && data.sessions.length > 0) {
        // Encontrar sessão do cliente atual
        const clientSession = data.sessions.find((s: Session) => s.name.includes(clientId))
        if (clientSession) {
          setSession(clientSession)
          onConnectionChange?.(clientSession.status === "WORKING")
        }
      }
    } catch (error) {
      console.error("Erro ao verificar sessão:", error)
    }
  }

  const checkSessionStatus = async () => {
    if (!session) return

    try {
      const response = await fetch(`/api/whatsapp/sessions/${session.name}`)
      const data = await response.json()

      if (data.success) {
        setSession(data.session)
        onConnectionChange?.(data.session.status === "WORKING")

        if (data.session.status === "WORKING") {
          setError(null)
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error)
    }
  }

  const connectWhatsApp = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const response = await fetch("/api/whatsapp/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `whatsapp_${clientId}_${Date.now()}`,
          clientId: clientId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSession(data.session)
        setError(null)
      } else {
        setError(data.error || "Erro ao gerar QR Code")
      }
    } catch (error) {
      setError("Erro de conexão com o servidor")
      console.error("Erro:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWhatsApp = async () => {
    if (!session) return

    try {
      const response = await fetch(`/api/whatsapp/sessions/${session.name}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSession(null)
        setError(null)
        onConnectionChange?.(false)
      }
    } catch (error) {
      console.error("Erro ao desconectar:", error)
    }
  }

  const refreshQRCode = () => {
    if (session) {
      setSession(null)
    }
    connectWhatsApp()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WORKING":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Conectado
          </Badge>
        )
      case "SCAN_QR_CODE":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            <QrCode className="w-3 h-3 mr-1" />
            Aguardando Scan
          </Badge>
        )
      case "CONNECTING":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Conectando...
          </Badge>
        )
      case "EXPIRED":
        return (
          <Badge variant="outline" className="border-red-500 text-red-700">
            <Clock className="w-3 h-3 mr-1" />
            Expirado
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <WifiOff className="w-3 h-3 mr-1" />
            Desconectado
          </Badge>
        )
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-green-600" />
            <CardTitle className="text-lg">WhatsApp Connection</CardTitle>
          </div>
          {session && getStatusBadge(session.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {!session || session.status === "EXPIRED" ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Conectar WhatsApp</h3>
            <p className="text-gray-600 mb-4 text-sm">
              {userRole === "simple" && "Conecte seu WhatsApp pessoal para monitoramento"}
              {userRole === "leader" && "Conecte o WhatsApp da equipe para análise de sentimentos"}
              {userRole === "master" && "Conecte WhatsApp para gerenciamento completo"}
            </p>
            <Button onClick={connectWhatsApp} disabled={isConnecting} className="w-full max-w-xs">
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Gerando QR Code...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Gerar QR Code
                </>
              )}
            </Button>
          </div>
        ) : session.status === "SCAN_QR_CODE" ? (
          <div className="text-center py-4">
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block mb-4">
              {session.qr ? (
                <div className="relative">
                  <img
                    src={session.qr || "/placeholder.svg"}
                    alt="QR Code WhatsApp"
                    className="w-64 h-64 mx-auto"
                    onError={(e) => {
                      console.error("Erro ao carregar QR Code")
                      setError("Erro ao carregar QR Code. Tente novamente.")
                    }}
                  />
                  {timeLeft > 0 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {formatTime(timeLeft)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
              )}
            </div>

            <h3 className="text-lg font-medium mb-2">Escaneie o QR Code</h3>
            <div className="text-sm text-gray-600 mb-4 space-y-1">
              <p>1. Abra o WhatsApp no seu celular</p>
              <p>2. Toque em "Dispositivos conectados"</p>
              <p>3. Toque em "Conectar um dispositivo"</p>
              <p>4. Escaneie este código</p>
            </div>

            {timeLeft > 0 && (
              <Alert className="mb-4 border-blue-200 bg-blue-50">
                <Clock className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">QR Code expira em {formatTime(timeLeft)}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center space-x-2">
              <Button variant="outline" onClick={refreshQRCode} disabled={isConnecting}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Novo QR Code
              </Button>
              <Button variant="destructive" onClick={() => setSession(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : session.status === "WORKING" ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>WhatsApp Conectado com Sucesso!</strong>
                <br />
                {session.me?.pushName && `Conectado como: ${session.me.pushName}`}
                {session.phone && (
                  <>
                    <br />
                    Telefone: {session.phone}
                  </>
                )}
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Status da Conexão</h4>
                  <p className="text-sm text-gray-600">Ativo e monitorando</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={disconnectWhatsApp}>
                <WifiOff className="w-4 h-4 mr-2" />
                Desconectar
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Status: {session.status}</h3>
            <Button onClick={refreshQRCode}>Tentar Novamente</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
