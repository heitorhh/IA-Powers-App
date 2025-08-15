"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Smartphone, QrCode, CheckCircle, AlertCircle, RefreshCw, WifiOff, Clock, Wifi, Zap } from "lucide-react"

interface WhatsAppConnectionProps {
  userRole: "simple" | "leader" | "master"
  clientId: string
  onConnectionChange?: (connected: boolean) => void
}

interface WhatsAppSession {
  id: string
  status: "disconnected" | "connecting" | "qr_ready" | "authenticated" | "ready"
  qr?: string
  clientInfo?: {
    pushName: string
    me: string
  }
  error?: string
}

export default function WhatsAppConnection({ userRole, clientId, onConnectionChange }: WhatsAppConnectionProps) {
  const [session, setSession] = useState<WhatsAppSession | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionProgress, setConnectionProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number>(0)

  // Polling para verificar status da sessão
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (session && (session.status === "connecting" || session.status === "qr_ready")) {
      interval = setInterval(() => {
        checkSessionStatus()
      }, 3000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [session?.status]) // Updated dependency

  // Timer para QR Code (2 minutos)
  useEffect(() => {
    if (session?.status === "qr_ready") {
      // Updated condition
      setTimeLeft(120) // 2 minutos
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setError("QR Code expirou. Gere um novo.")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [session?.status]) // Updated dependency

  // Progress simulation
  useEffect(() => {
    if (isConnecting) {
      const interval = setInterval(() => {
        setConnectionProgress((prev) => {
          if (prev >= 90) return prev
          return prev + Math.random() * 5
        })
      }, 500)

      return () => clearInterval(interval)
    } else {
      setConnectionProgress(0)
    }
  }, [isConnecting])

  const checkSessionStatus = async () => {
    if (!session) return

    try {
      const response = await fetch(`/api/whatsapp-web/status?sessionId=${session.id}`)
      const data = await response.json()

      if (data.success) {
        setSession(data.session)

        if (data.session.status === "ready") {
          setError(null)
          setIsConnecting(false)
          setConnectionProgress(100)
          onConnectionChange?.(true)
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error)
    }
  }

  const connectWhatsApp = async () => {
    setIsConnecting(true)
    setError(null)
    setConnectionProgress(10)

    const sessionId = `${userRole}_${clientId}_${Date.now()}`

    try {
      const response = await fetch("/api/whatsapp-web/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          userRole,
          clientId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSession(data.session)
        setError(null)
        setConnectionProgress(50)
      } else {
        setError(data.error || "Erro ao conectar WhatsApp")
        setIsConnecting(false)
      }
    } catch (error) {
      setError("Erro de conexão com o servidor")
      setIsConnecting(false)
      console.error("Erro:", error)
    }
  }

  const disconnectWhatsApp = async () => {
    if (!session) return

    try {
      await fetch(`/api/whatsapp-web/disconnect?sessionId=${session.id}`, {
        method: "DELETE",
      })

      setSession(null)
      setError(null)
      setIsConnecting(false)
      setConnectionProgress(0)
      onConnectionChange?.(false)
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
      case "ready":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Conectado
          </Badge>
        )
      case "authenticated":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Autenticando...
          </Badge>
        )
      case "qr_ready":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
            <QrCode className="w-3 h-3 mr-1" />
            QR Code Pronto
          </Badge>
        )
      case "connecting":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
            Conectando...
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
            <div className="relative">
              <Smartphone className="w-5 h-5 text-green-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                <Zap className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-lg">WhatsApp Web.js</CardTitle>
              <p className="text-xs text-gray-600">Conexão direta e estável</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800 text-xs">
              <Smartphone className="w-3 h-3 mr-1" />
              Oficial
            </Badge>
            {session && getStatusBadge(session.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {isConnecting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Inicializando WhatsApp Web...</span>
              <span>{Math.round(connectionProgress)}%</span>
            </div>
            <Progress value={connectionProgress} className="w-full" />
          </div>
        )}

        {!session ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="relative">
                <Smartphone className="w-8 h-8 text-green-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Zap className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Conectar WhatsApp</h3>
            <p className="text-gray-600 mb-4 text-sm max-w-md mx-auto">
              {userRole === "simple" && "Conecte seu WhatsApp pessoal para monitoramento inteligente"}
              {userRole === "leader" && "Gerencie WhatsApp da equipe com análise de sentimentos"}
              {userRole === "master" && "Controle total com múltiplas funcionalidades avançadas"}
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
              <div className="p-2 bg-green-50 rounded">
                <CheckCircle className="w-4 h-4 mx-auto text-green-600 mb-1" />
                <div className="font-medium">Oficial</div>
              </div>
              <div className="p-2 bg-blue-50 rounded">
                <Zap className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                <div className="font-medium">Rápido</div>
              </div>
              <div className="p-2 bg-purple-50 rounded">
                <Wifi className="w-4 h-4 mx-auto text-purple-600 mb-1" />
                <div className="font-medium">Seguro</div>
              </div>
            </div>

            <Button onClick={connectWhatsApp} disabled={isConnecting} className="w-full max-w-xs">
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Inicializando...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Conectar WhatsApp
                </>
              )}
            </Button>
          </div>
        ) : session.status === "connecting" ? (
          <div className="text-center py-4">
            <RefreshCw className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium mb-2">Inicializando WhatsApp Web</h3>
            <p className="text-gray-600 text-sm">Preparando conexão segura...</p>
          </div>
        ) : session.status === "qr_ready" && session.qr ? (
          <div className="text-center py-4">
            <div className="relative inline-block mb-4">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                <img
                  src={session.qr || "/placeholder.svg"}
                  alt="QR Code WhatsApp"
                  className="w-64 h-64 mx-auto"
                  onError={(e) => {
                    console.error("Erro ao carregar QR Code")
                    setError("Erro ao carregar QR Code. Tente novamente.")
                  }}
                />
              </div>
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">Web.js</div>
              {timeLeft > 0 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {formatTime(timeLeft)}
                </div>
              )}
            </div>

            <h3 className="text-lg font-medium mb-2">Escaneie o QR Code</h3>
            <div className="text-sm text-gray-600 mb-4 space-y-1 max-w-sm mx-auto">
              <p className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                  1
                </span>
                Abra o WhatsApp no seu celular
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                Toque nos 3 pontos (⋮) → Dispositivos conectados
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                  3
                </span>
                Toque em "Conectar um dispositivo"
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                  4
                </span>
                Escaneie este código
              </p>
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
              <Button variant="outline" onClick={disconnectWhatsApp}>
                <WifiOff className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        ) : session.status === "authenticated" ? (
          <div className="text-center py-4">
            <RefreshCw className="w-12 h-12 text-green-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium mb-2">Autenticando...</h3>
            <p className="text-gray-600 text-sm">Finalizando conexão com WhatsApp</p>
          </div>
        ) : session.status === "ready" ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>WhatsApp Conectado com Sucesso!</strong>
                <br />
                {session.clientInfo?.pushName && `Conectado como: ${session.clientInfo.pushName}`}
                <br />
                {session.clientInfo?.me && `ID: ${session.clientInfo.me}`}
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">WhatsApp Ativo</h4>
                  <p className="text-sm text-gray-600">Monitorando mensagens em tempo real</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={disconnectWhatsApp}>
                <WifiOff className="w-4 h-4 mr-2" />
                Desconectar
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
