"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Smartphone, QrCode, CheckCircle, AlertCircle, RefreshCw, WifiOff, Wifi, MessageSquare, Zap, Clock, Users } from 'lucide-react'

interface WhatsAppSimpleConnectionProps {
  userRole?: "simple" | "leader" | "master"
  clientId?: string
  onConnectionChange?: (connected: boolean) => void
}

interface WhatsAppSession {
  id: string
  qr: string | null
  status: "disconnected" | "connecting" | "connected" | "qr_ready"
  isReady: boolean
}

interface Chat {
  id: string
  name: string
  isGroup: boolean
  unreadCount: number
  lastMessage: string
  timestamp: number
}

export default function WhatsAppSimpleConnection({
  userRole = "simple",
  clientId = "default",
  onConnectionChange,
}: WhatsAppSimpleConnectionProps) {
  const [session, setSession] = useState<WhatsAppSession | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [loadingChats, setLoadingChats] = useState(false)
  const [connectionProgress, setConnectionProgress] = useState(0)

  const sessionId = `${userRole}_${clientId}_${Date.now()}`

  // Polling para atualizar status da sessão
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (session && (session.status === "connecting" || session.status === "qr_ready")) {
      interval = setInterval(() => {
        checkSessionStatus()
      }, 2000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [session])

  // Carregar chats quando conectado
  useEffect(() => {
    if (session && session.status === "connected" && session.isReady) {
      loadChats()
      onConnectionChange?.(true)
    } else {
      onConnectionChange?.(false)
    }
  }, [session])

  // Progress simulation
  useEffect(() => {
    if (isConnecting) {
      const interval = setInterval(() => {
        setConnectionProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 10
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
      const response = await fetch(`/api/whatsapp-simple/connect?sessionId=${session.id}`)
      const data = await response.json()

      if (data.success) {
        setSession(data.session)
        if (data.session.status === "connected") {
          setError(null)
          setIsConnecting(false)
          setConnectionProgress(100)
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error)
    }
  }

  const loadChats = async () => {
    if (!session) return

    setLoadingChats(true)
    try {
      const response = await fetch(`/api/whatsapp-simple/messages?sessionId=${session.id}`)
      const data = await response.json()

      if (data.success) {
        setChats(data.chats || [])
      }
    } catch (error) {
      console.error("Erro ao carregar chats:", error)
    } finally {
      setLoadingChats(false)
    }
  }

  const connectWhatsApp = async () => {
    setIsConnecting(true)
    setError(null)
    setConnectionProgress(10)

    try {
      const response = await fetch("/api/whatsapp-simple/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
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
      setSession(null)
      setChats([])
      setError(null)
      setIsConnecting(false)
      setConnectionProgress(0)
      onConnectionChange?.(false)
    } catch (error) {
      console.error("Erro ao desconectar:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Conectado
          </Badge>
        )
      case "connecting":
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
      default:
        return (
          <Badge variant="secondary">
            <WifiOff className="w-3 h-3 mr-1" />
            Desconectado
          </Badge>
        )
    }
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
              Direto
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
              <span>Conectando...</span>
              <span>{Math.round(connectionProgress)}%</span>
            </div>
            <Progress value={connectionProgress} className="w-full" />
          </div>
        )}

        {!session ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="relative">
                <Smartphone className="w-8 h-8 text-green-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Zap className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Conectar WhatsApp</h3>
            <p className="text-gray-600 mb-4 text-sm max-w-md mx-auto">
              {userRole === "simple" && "Conecte seu WhatsApp de forma simples e direta"}
              {userRole === "leader" && "Gerencie WhatsApp da equipe com controle total"}
              {userRole === "master" && "Controle avançado com múltiplas funcionalidades"}
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
              <div className="p-2 bg-green-50 rounded">
                <CheckCircle className="w-4 h-4 mx-auto text-green-600 mb-1" />
                <div className="font-medium">Estável</div>
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
                  Conectando...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Conectar WhatsApp
                </>
              )}
            </Button>
          </div>
        ) : session.status === "qr_ready" && session.qr ? (
          <div className="text-center py-4">
            <div className="relative inline-block mb-4">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block">
                <img src={session.qr || "/placeholder.svg"} alt="QR Code WhatsApp" className="w-64 h-64 mx-auto" />
              </div>
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Web.js
              </div>
            </div>

            <h3 className="text-lg font-medium mb-2">Escaneie o QR Code</h3>
            <div className="text-sm text-gray-600 mb-4 space-y-1 max-w-sm mx-auto">
              <p className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
                Abra o WhatsApp no seu celular
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
                Toque nos 3 pontos (⋮) → Dispositivos conectados
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
                Toque em "Conectar um dispositivo"
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">4</span>
                Escaneie este código
              </p>
            </div>

            <div className="flex justify-center space-x-2">
              <Button variant="outline" onClick={checkSessionStatus}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Verificar Status
              </Button>
              <Button variant="outline" onClick={disconnectWhatsApp}>
                <WifiOff className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </div>
        ) : session.status === "connecting" ? (
          <div className="text-center py-4">
            <RefreshCw className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium mb-2">Autenticando...</h3>
            <p className="text-gray-600 text-sm">Aguarde enquanto conectamos com o WhatsApp</p>
          </div>
        ) : session.status === "connected" ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>WhatsApp Conectado!</strong> Funcionando perfeitamente
              </AlertDescription>
            </Alert>

            {/* Estatísticas das Conversas */}
            {chats.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Conversas Ativas ({chats.length})
                  </h4>
                  <Button variant="outline" size="sm" onClick={loadChats} disabled={loadingChats}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loadingChats ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                </div>

                <ScrollArea className="h-40">
                  <div className="space-y-2">
                    {chats.slice(0, 8).map((chat) => (
                      <div key={chat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            chat.isGroup ? 'bg-blue-100' : 'bg-green-100'
                          }`}>
                            {chat.isGroup ? (
                              <Users className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Smartphone className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{chat.name}</div>
                            <div className="text-xs text-gray-600 truncate">{chat.lastMessage}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {chat.unreadCount > 0 && (
                            <Badge variant="outline" className="text-xs bg-red-100 text-red-800">
                              {chat.unreadCount}
                            </Badge>
                          )}
                          <div className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(chat.timestamp).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {loadingChats && (
              <div className="text-center py-4">
                <RefreshCw className="w-6 h-6 text-blue-500 mx-auto mb-2 animate-spin" />
                <p className="text-sm text-gray-600">Carregando conversas...</p>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">WhatsApp Ativo</h4>
                  <p className="text-sm text-gray-600">Conexão estável e segura</p>
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
