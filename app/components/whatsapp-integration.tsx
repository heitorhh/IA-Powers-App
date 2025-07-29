"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Smartphone,
  Wifi,
  WifiOff,
  QrCode,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react"

interface Session {
  name: string
  status: string
  qr?: string
  me?: {
    id: string
    pushName: string
    name: string
  }
}

interface Message {
  id: string
  from: string
  to: string
  body: string
  timestamp: string
  sentiment: {
    sentiment: string
    score: number
    confidence: number
  }
}

export default function WhatsAppIntegration() {
  const [session, setSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Verificar sessão existente ao carregar
  useEffect(() => {
    checkExistingSession()
    loadMessages()
  }, [])

  // Polling para atualizar status da sessão
  useEffect(() => {
    if (session && session.status === "SCAN_QR_CODE") {
      const interval = setInterval(() => {
        checkSessionStatus()
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [session])

  const checkExistingSession = async () => {
    try {
      const response = await fetch("/api/whatsapp/sessions")
      const data = await response.json()

      if (data.success && data.sessions.length > 0) {
        setSession(data.sessions[0])
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
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error)
    }
  }

  const loadMessages = async () => {
    try {
      const response = await fetch("/api/whatsapp/messages?limit=20")
      const data = await response.json()

      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error)
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
          name: `session_${Date.now()}`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSession(data.session)
      } else {
        setError(data.error || "Erro ao conectar")
      }
    } catch (error) {
      setError("Erro de conexão")
      console.error("Erro:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWhatsApp = async () => {
    if (!session) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/whatsapp/sessions/${session.name}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSession(null)
        setMessages([])
      }
    } catch (error) {
      console.error("Erro ao desconectar:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "WORKING":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Conectado
          </Badge>
        )
      case "SCAN_QR_CODE":
        return (
          <Badge variant="outline">
            <QrCode className="w-3 h-3 mr-1" />
            Aguardando QR
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <AlertCircle className="w-3 h-3 mr-1" />
            Desconectado
          </Badge>
        )
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "😊"
      case "negative":
        return "😞"
      default:
        return "😐"
    }
  }

  return (
    <div className="space-y-6">
      {/* Status da Conexão */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5" />
              <CardTitle>WhatsApp Integration</CardTitle>
            </div>
            {session ? getStatusBadge(session.status) : <Badge variant="secondary">Desconectado</Badge>}
          </div>
          <CardDescription>Conecte seu WhatsApp para monitoramento em tempo real</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {!session ? (
            <div className="text-center py-8">
              <Wifi className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">WhatsApp não conectado</h3>
              <p className="text-gray-600 mb-4">Conecte seu WhatsApp para começar o monitoramento</p>
              <Button onClick={connectWhatsApp} disabled={isConnecting} className="w-full max-w-xs">
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4 mr-2" />
                    Conectar WhatsApp
                  </>
                )}
              </Button>
            </div>
          ) : session.status === "SCAN_QR_CODE" ? (
            <div className="text-center py-8">
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block mb-4">
                {session.qr ? (
                  <img src={session.qr || "/placeholder.svg"} alt="QR Code WhatsApp" className="w-48 h-48 mx-auto" />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-medium mb-2">Escaneie o QR Code</h3>
              <p className="text-gray-600 mb-4">Abra o WhatsApp no seu celular e escaneie o código acima</p>
              <div className="flex justify-center space-x-2">
                <Button variant="outline" onClick={checkSessionStatus}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Verificar Status
                </Button>
                <Button variant="destructive" onClick={disconnectWhatsApp}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-medium text-green-900">WhatsApp Conectado</h3>
                    <p className="text-sm text-green-700">{session.me?.pushName || "Usuário conectado"}</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={disconnectWhatsApp} disabled={isLoading}>
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <WifiOff className="w-4 h-4" />}
                </Button>
              </div>

              {/* Estatísticas Rápidas */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <MessageSquare className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                  <div className="text-lg font-bold text-blue-900">{messages.length}</div>
                  <div className="text-xs text-blue-700">Mensagens</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 mx-auto text-green-600 mb-1" />
                  <div className="text-lg font-bold text-green-900">
                    {messages.filter((m) => m.sentiment.sentiment === "positive").length}
                  </div>
                  <div className="text-xs text-green-700">Positivas</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <Activity className="w-6 h-6 mx-auto text-red-600 mb-1" />
                  <div className="text-lg font-bold text-red-900">
                    {messages.filter((m) => m.sentiment.sentiment === "negative").length}
                  </div>
                  <div className="text-xs text-red-700">Negativas</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mensagens Recentes */}
      {session && session.status === "WORKING" && messages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Mensagens Recentes</span>
            </CardTitle>
            <CardDescription>Últimas mensagens com análise de sentimentos</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">{message.from.split("@")[0]}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getSentimentIcon(message.sentiment.sentiment)}</span>
                        <Badge variant="outline" className={getSentimentColor(message.sentiment.sentiment)}>
                          {message.sentiment.sentiment}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{message.body}</p>
                    <div className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString("pt-BR")}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" onClick={loadMessages} className="w-full bg-transparent">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar Mensagens
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
