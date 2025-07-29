"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Smartphone,
  QrCode,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  TrendingUp,
  Users,
  Activity,
  WifiOff,
} from "lucide-react"

interface WhatsAppUniversalProps {
  userRole: "simple" | "leader" | "master"
  clientId: string
  canConnect?: boolean
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

interface Session {
  name: string
  status: string
  qr?: string
  phone?: string
  me?: {
    id: string
    pushName: string
    name: string
  }
}

export default function WhatsAppUniversal({ userRole, clientId, canConnect = true }: WhatsAppUniversalProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data baseado no nível do usuário
  const mockMessages: Message[] = [
    {
      id: "1",
      from: "5511999991111@c.us",
      to: "company@c.us",
      body: "Preciso urgente do relatório financeiro. Quando fica pronto?",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      sentiment: { sentiment: "negative", score: -0.4, confidence: 0.8 },
    },
    {
      id: "2",
      from: "5511999992222@c.us",
      to: "company@c.us",
      body: "Ótima apresentação hoje! Parabéns pela dedicação 👏",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      sentiment: { sentiment: "positive", score: 0.8, confidence: 0.9 },
    },
    {
      id: "3",
      from: "5511999994444@c.us",
      to: "company@c.us",
      body: "Estou muito estressado com essas demandas. Não consigo dar conta...",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      sentiment: { sentiment: "negative", score: -0.9, confidence: 0.95 },
    },
  ]

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setMessages(mockMessages)
      // Simular sessão conectada para demo
      if (Math.random() > 0.5) {
        setSession({
          name: `session_${clientId}`,
          status: "WORKING",
          phone: "+55 11 99999-9999",
          me: {
            id: "demo@whatsapp.com",
            pushName: "Empresa Demo",
            name: "Empresa Demo",
          },
        })
      }
    }, 1000)
  }, [clientId])

  const connectWhatsApp = async () => {
    if (!canConnect) {
      setError("Plano atual não permite novas conexões WhatsApp")
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Simular processo de conexão
      setSession({
        name: `session_${clientId}_${Date.now()}`,
        status: "SCAN_QR_CODE",
        qr: `/placeholder.svg?height=200&width=200&text=QR+Code+WhatsApp`,
      })

      // Simular conexão após 10 segundos
      setTimeout(() => {
        setSession({
          name: `session_${clientId}_${Date.now()}`,
          status: "WORKING",
          phone: "+55 11 99999-9999",
          me: {
            id: "demo@whatsapp.com",
            pushName: "Empresa Demo",
            name: "Empresa Demo",
          },
        })
      }, 10000)
    } catch (error) {
      setError("Erro ao conectar WhatsApp")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWhatsApp = () => {
    setSession(null)
    setMessages([])
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

  // Filtrar mensagens baseado no nível do usuário
  const getFilteredMessages = () => {
    switch (userRole) {
      case "simple":
        // Usuário simples vê apenas suas mensagens diretas
        return messages.slice(0, 2)
      case "leader":
        // Líder vê mensagens da equipe
        return messages
      case "master":
        // Master vê tudo
        return messages
      default:
        return []
    }
  }

  const filteredMessages = getFilteredMessages()

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
          <CardDescription>
            {userRole === "simple" && "Monitore suas conversas WhatsApp"}
            {userRole === "leader" && "Monitore conversas da sua equipe"}
            {userRole === "master" && "Controle total das conexões WhatsApp"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {!canConnect && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-700 text-sm">
                ⚠️ Limite de conexões WhatsApp atingido. Faça upgrade do plano para conectar mais dispositivos.
              </p>
            </div>
          )}

          {!session ? (
            <div className="text-center py-8">
              <Smartphone className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">WhatsApp não conectado</h3>
              <p className="text-gray-600 mb-4">Conecte seu WhatsApp para começar o monitoramento</p>
              <Button onClick={connectWhatsApp} disabled={isConnecting || !canConnect} className="w-full max-w-xs">
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
                <Button variant="outline" onClick={() => setSession({ ...session, qr: session.qr })}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar QR
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
                    {session.phone && <p className="text-xs text-green-600">{session.phone}</p>}
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={disconnectWhatsApp}>
                  <WifiOff className="w-4 h-4" />
                </Button>
              </div>

              {/* Estatísticas baseadas no nível do usuário */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <MessageSquare className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                  <div className="text-lg font-bold text-blue-900">{filteredMessages.length}</div>
                  <div className="text-xs text-blue-700">
                    {userRole === "simple" ? "Suas Msgs" : userRole === "leader" ? "Equipe" : "Total"}
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 mx-auto text-green-600 mb-1" />
                  <div className="text-lg font-bold text-green-900">
                    {filteredMessages.filter((m) => m.sentiment.sentiment === "positive").length}
                  </div>
                  <div className="text-xs text-green-700">Positivas</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <Activity className="w-6 h-6 mx-auto text-red-600 mb-1" />
                  <div className="text-lg font-bold text-red-900">
                    {filteredMessages.filter((m) => m.sentiment.sentiment === "negative").length}
                  </div>
                  <div className="text-xs text-red-700">Negativas</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mensagens Recentes */}
      {session && session.status === "WORKING" && filteredMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>
                {userRole === "simple" && "Suas Mensagens"}
                {userRole === "leader" && "Mensagens da Equipe"}
                {userRole === "master" && "Todas as Mensagens"}
              </span>
            </CardTitle>
            <CardDescription>
              {userRole === "simple" && "Mensagens direcionadas a você"}
              {userRole === "leader" && "Conversas da sua equipe com análise de sentimentos"}
              {userRole === "master" && "Visão completa de todas as conversas"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {filteredMessages.map((message) => (
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

            {userRole === "master" && (
              <>
                <Separator className="my-4" />
                <div className="text-center">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Atualizar Mensagens
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
