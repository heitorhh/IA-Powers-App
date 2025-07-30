"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Smartphone,
  QrCode,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  WifiOff,
  Wifi,
  MessageSquare,
  Users,
  BarChart3,
  Zap,
  Shield,
  Globe,
} from "lucide-react"

interface EvolutionWhatsAppProps {
  userRole: "simple" | "leader" | "master"
  clientId: string
  onConnectionChange?: (connected: boolean) => void
}

interface EvolutionInstance {
  instanceName: string
  status: "open" | "close" | "connecting"
  qr?: string
  profile?: any
  serverUrl?: string
  lastUpdate?: string
}

interface ChatData {
  chats: any[]
  summary: {
    totalChats: number
    totalMessages: number
    sentimentDistribution: {
      positive: number
      negative: number
      neutral: number
    }
    period: {
      days: number
      from: string
      to: string
    }
  }
}

export default function EvolutionWhatsApp({ userRole, clientId, onConnectionChange }: EvolutionWhatsAppProps) {
  const [instance, setInstance] = useState<EvolutionInstance | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [loadingChats, setLoadingChats] = useState(false)
  const [connectionProgress, setConnectionProgress] = useState(0)

  const instanceName = `${userRole}_${clientId}_${Date.now()}`

  // Verificar instâncias existentes ao carregar
  useEffect(() => {
    checkExistingInstance()
  }, [])

  // Polling para atualizar status da instância
  useEffect(() => {
    if (instance && (instance.status === "connecting" || instance.status === "close")) {
      const interval = setInterval(() => {
        checkInstanceStatus()
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [instance])

  // Simular progresso de conexão
  useEffect(() => {
    if (isConnecting || (instance && instance.status === "connecting")) {
      const interval = setInterval(() => {
        setConnectionProgress((prev) => {
          const next = prev + Math.random() * 10
          return next > 95 ? 95 : next
        })
      }, 500)

      return () => clearInterval(interval)
    } else {
      setConnectionProgress(0)
    }
  }, [isConnecting, instance])

  // Carregar conversas quando conectado
  useEffect(() => {
    if (instance && instance.status === "open") {
      setConnectionProgress(100)
      loadChats()
      onConnectionChange?.(true)
    } else {
      onConnectionChange?.(false)
    }
  }, [instance])

  const checkExistingInstance = async () => {
    try {
      const response = await fetch("/api/evolution/instances")
      const data = await response.json()

      if (data.success && data.instances?.length > 0) {
        // Procurar instância do cliente atual
        const userInstance = data.instances.find(
          (inst: any) =>
            inst.instanceName.includes(clientId) || (userRole === "master" && inst.instanceName.includes("master")),
        )

        if (userInstance) {
          setInstance(userInstance)
        }
      }
    } catch (error) {
      console.error("Erro ao verificar instâncias:", error)
    }
  }

  const checkInstanceStatus = async () => {
    if (!instance) return

    try {
      const response = await fetch(`/api/evolution/instances/${instance.instanceName}`)
      const data = await response.json()

      if (data.success) {
        setInstance(data.instance)

        if (data.instance.status === "open") {
          setError(null)
          setConnectionProgress(100)
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error)
    }
  }

  const loadChats = async () => {
    if (!instance) return

    setLoadingChats(true)
    try {
      const response = await fetch(`/api/evolution/chats?instanceName=${instance.instanceName}&days=7`)
      const data = await response.json()

      if (data.success) {
        setChatData(data.data)
      } else {
        console.error("Erro ao carregar conversas:", data.error)
      }
    } catch (error) {
      console.error("Erro ao carregar conversas:", error)
    } finally {
      setLoadingChats(false)
    }
  }

  const connectWhatsApp = async () => {
    setIsConnecting(true)
    setError(null)
    setConnectionProgress(0)

    try {
      const webhookUrl = `${window.location.origin}/api/evolution/webhook`

      const response = await fetch("/api/evolution/instances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instanceName,
          clientId,
          userRole,
          webhookUrl,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setInstance(data.instance)
        setError(null)
      } else {
        setError(data.error || "Erro ao criar instância Evolution API")
      }
    } catch (error) {
      setError("Erro de conexão com Evolution API")
      console.error("Erro:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWhatsApp = async () => {
    if (!instance) return

    try {
      const response = await fetch(`/api/evolution/instances/${instance.instanceName}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setInstance(null)
        setChatData(null)
        setError(null)
        setConnectionProgress(0)
        onConnectionChange?.(false)
      }
    } catch (error) {
      console.error("Erro ao desconectar:", error)
    }
  }

  const refreshConnection = () => {
    if (instance) {
      setInstance(null)
      setChatData(null)
    }
    connectWhatsApp()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Conectado
          </Badge>
        )
      case "close":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700">
            <QrCode className="w-3 h-3 mr-1" />
            Aguardando QR
          </Badge>
        )
      case "connecting":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700">
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-yellow-600"
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
              <CardTitle className="text-lg">Evolution API WhatsApp</CardTitle>
              <p className="text-xs text-gray-600">Conexão real e avançada</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800 text-xs">
              <Globe className="w-3 h-3 mr-1" />
              Evolution
            </Badge>
            {instance && getStatusBadge(instance.status)}
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

        {/* Vantagens da Evolution API */}
        <Alert className="border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <strong>Evolution API:</strong> Conexão real com WhatsApp, webhooks em tempo real, análise avançada de
            sentimentos e sem limitações de simulação.
          </AlertDescription>
        </Alert>

        {!instance ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="relative">
                <Smartphone className="w-8 h-8 text-green-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Zap className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Conectar com Evolution API</h3>
            <p className="text-gray-600 mb-4 text-sm max-w-md mx-auto">
              {userRole === "simple" && "Conecte seu WhatsApp para monitoramento real e análise avançada"}
              {userRole === "leader" && "Gerencie WhatsApp da equipe com recursos profissionais"}
              {userRole === "master" && "Controle total com Evolution API - múltiplas instâncias e webhooks"}
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
              <div className="p-2 bg-green-50 rounded">
                <CheckCircle className="w-4 h-4 mx-auto text-green-600 mb-1" />
                <div className="font-medium">Real</div>
              </div>
              <div className="p-2 bg-blue-50 rounded">
                <Zap className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                <div className="font-medium">Webhooks</div>
              </div>
              <div className="p-2 bg-purple-50 rounded">
                <BarChart3 className="w-4 h-4 mx-auto text-purple-600 mb-1" />
                <div className="font-medium">Análises</div>
              </div>
            </div>

            <Button onClick={connectWhatsApp} disabled={isConnecting} className="w-full max-w-xs">
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Criando Instância...
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Conectar Evolution API
                </>
              )}
            </Button>
          </div>
        ) : instance.status === "connecting" ? (
          <div className="text-center py-6">
            <RefreshCw className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-medium mb-2">Inicializando Evolution API</h3>
            <p className="text-gray-600 text-sm mb-4">Preparando instância WhatsApp...</p>

            <div className="max-w-xs mx-auto">
              <div className="flex justify-between text-sm mb-1">
                <span>Progresso</span>
                <span>{Math.round(connectionProgress)}%</span>
              </div>
              <Progress value={connectionProgress} className="h-2" />
            </div>
          </div>
        ) : instance.status === "close" ? (
          <div className="text-center py-4">
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 inline-block mb-4">
              {instance.qr ? (
                <div className="relative">
                  <img
                    src={instance.qr || "/placeholder.svg"}
                    alt="QR Code WhatsApp Evolution API"
                    className="w-64 h-64 mx-auto"
                    onError={(e) => {
                      console.error("Erro ao carregar QR Code Evolution API")
                      setError("Erro ao carregar QR Code. Tente atualizar.")
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Evolution API
                  </div>
                </div>
              ) : (
                <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                  <span className="ml-2 text-sm text-gray-600">Gerando QR...</span>
                </div>
              )}
            </div>

            <h3 className="text-lg font-medium mb-2">Escaneie o QR Code</h3>
            <div className="text-sm text-gray-600 mb-4 space-y-1 max-w-sm mx-auto">
              <p>
                <strong>1.</strong> Abra o WhatsApp no seu celular
              </p>
              <p>
                <strong>2.</strong> Toque nos 3 pontos (⋮) &gt; Dispositivos conectados
              </p>
              <p>
                <strong>3.</strong> Toque em "Conectar um dispositivo"
              </p>
              <p>
                <strong>4.</strong> Escaneie este código
              </p>
            </div>

            <Alert className="mb-4 border-green-200 bg-green-50 max-w-md mx-auto">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 text-sm">
                <strong>Evolution API:</strong> Conexão será mais estável e rápida que métodos tradicionais
              </AlertDescription>
            </Alert>

            <div className="flex justify-center space-x-2">
              <Button variant="outline" onClick={checkInstanceStatus} disabled={loadingChats}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Verificar Status
              </Button>
              <Button variant="outline" onClick={refreshConnection}>
                Novo QR Code
              </Button>
              <Button variant="destructive" onClick={() => setInstance(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : instance.status === "open" ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <strong>Evolution API Conectada!</strong>
                <br />
                {instance.profile?.name && `Conectado como: ${instance.profile.name}`}
                <br />
                <span className="text-xs">Instância: {instance.instanceName}</span>
              </AlertDescription>
            </Alert>

            {/* Recursos Avançados Evolution API */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-blue-50 rounded-lg">
              <div className="text-center">
                <Wifi className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                <div className="text-xs font-medium">Real-time</div>
              </div>
              <div className="text-center">
                <Zap className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                <div className="text-xs font-medium">Webhooks</div>
              </div>
              <div className="text-center">
                <Shield className="w-5 h-5 mx-auto text-green-600 mb-1" />
                <div className="text-xs font-medium">Seguro</div>
              </div>
              <div className="text-center">
                <BarChart3 className="w-5 h-5 mx-auto text-orange-600 mb-1" />
                <div className="text-xs font-medium">Analytics</div>
              </div>
            </div>

            {/* Estatísticas das Conversas */}
            {chatData && (
              <div className="space-y-4">
                <Separator />
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Análise Evolution API - Últimos 7 Dias
                  </h4>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <MessageSquare className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                      <div className="text-lg font-bold text-blue-900">{chatData.summary.totalChats}</div>
                      <div className="text-xs text-blue-700">Conversas Reais</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Users className="w-6 h-6 mx-auto text-purple-600 mb-1" />
                      <div className="text-lg font-bold text-purple-900">{chatData.summary.totalMessages}</div>
                      <div className="text-xs text-purple-700">Mensagens</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        Sentimentos Positivos
                      </span>
                      <span className="font-medium">{chatData.summary.sentimentDistribution.positive}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        Sentimentos Negativos
                      </span>
                      <span className="font-medium">{chatData.summary.sentimentDistribution.negative}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        Neutros
                      </span>
                      <span className="font-medium">{chatData.summary.sentimentDistribution.neutral}</span>
                    </div>
                  </div>
                </div>

                {/* Lista de Conversas Recentes */}
                <div>
                  <h4 className="font-medium mb-3">Conversas em Tempo Real</h4>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {chatData.chats.slice(0, 4).map((chat) => (
                        <div key={chat.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{chat.name}</div>
                            <div className="text-xs text-gray-600 truncate">{chat.lastMessage}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`text-xs font-medium ${getSentimentColor(chat.overallSentiment.sentiment)}`}
                            >
                              {chat.overallSentiment.sentiment}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {chat.messages.length}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}

            {loadingChats && (
              <div className="text-center py-4">
                <RefreshCw className="w-6 h-6 text-blue-500 mx-auto mb-2 animate-spin" />
                <p className="text-sm text-gray-600">Analisando conversas em tempo real...</p>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="relative">
                    <Wifi className="w-5 h-5 text-green-600" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Evolution API Ativa</h4>
                  <p className="text-sm text-gray-600">Monitoramento em tempo real</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={loadChats} disabled={loadingChats}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
                <Button variant="outline" size="sm" onClick={disconnectWhatsApp}>
                  <WifiOff className="w-4 h-4 mr-2" />
                  Desconectar
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Status: {instance.status}</h3>
            <p className="text-gray-600 mb-4">Aguardando conexão com Evolution API...</p>
            <Button onClick={refreshConnection}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
