"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Zap,
  Settings,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Smartphone,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react"

import WhatsAppAutomationSetup from "./whatsapp-automation-setup"

interface WhatsAppManagerProps {
  userRole: "simple" | "leader" | "master"
  clientId: string
}

interface ConnectionStats {
  isConnected: boolean
  platform: string
  messagesReceived: number
  lastActivity: string
  status: "active" | "inactive" | "error"
}

interface MessageSummary {
  total: number
  today: number
  positive: number
  negative: number
  neutral: number
}

export default function WhatsAppManager({ userRole, clientId }: WhatsAppManagerProps) {
  const [connectionStats, setConnectionStats] = useState<ConnectionStats>({
    isConnected: false,
    platform: "none",
    messagesReceived: 0,
    lastActivity: "Nunca",
    status: "inactive",
  })

  const [messageSummary, setMessageSummary] = useState<MessageSummary>({
    total: 0,
    today: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
    const interval = setInterval(loadStats, 30000) // Atualiza a cada 30 segundos
    return () => clearInterval(interval)
  }, [clientId])

  const loadStats = async () => {
    try {
      setIsLoading(true)

      // Carregar estatísticas de conexão
      const webhooksResponse = await fetch(`/api/webhooks/list?clientId=${clientId}`)
      const webhooksData = await webhooksResponse.json()

      if (webhooksData.success && webhooksData.webhooks.length > 0) {
        const activeWebhook = webhooksData.webhooks.find((w: any) => w.status === "active")
        if (activeWebhook) {
          setConnectionStats({
            isConnected: true,
            platform: activeWebhook.platform,
            messagesReceived: activeWebhook.messageCount,
            lastActivity: activeWebhook.lastReceived
              ? new Date(activeWebhook.lastReceived).toLocaleString("pt-BR")
              : "Nunca",
            status: "active",
          })
        }
      }

      // Carregar resumo de mensagens
      const messagesResponse = await fetch(`/api/webhooks/messages?clientId=${clientId}&limit=100`)
      const messagesData = await messagesResponse.json()

      if (messagesData.success) {
        const messages = messagesData.messages
        const today = new Date().toDateString()

        const summary = {
          total: messages.length,
          today: messages.filter((m: any) => new Date(m.createdAt).toDateString() === today).length,
          positive: messages.filter((m: any) => m.sentiment === "positive").length,
          negative: messages.filter((m: any) => m.sentiment === "negative").length,
          neutral: messages.filter((m: any) => m.sentiment === "neutral").length,
        }

        setMessageSummary(summary)
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectionChange = (connected: boolean) => {
    setConnectionStats((prev) => ({
      ...prev,
      isConnected: connected,
      status: connected ? "active" : "inactive",
    }))
  }

  const getStatusBadge = () => {
    switch (connectionStats.status) {
      case "active":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Conectado
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Erro
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

  const getSentimentColor = (sentiment: string, count: number) => {
    if (count === 0) return "text-gray-400"
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
    <div className="space-y-6">
      {/* Header com Status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">WhatsApp Manager</h2>
          <p className="text-gray-600">Gerencie suas conexões e mensagens do WhatsApp</p>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge()}
          <Button variant="outline" size="sm" onClick={loadStats} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold">{connectionStats.isConnected ? "Conectado" : "Desconectado"}</p>
              </div>
              <div className={`p-2 rounded-full ${connectionStats.isConnected ? "bg-green-100" : "bg-gray-100"}`}>
                <Smartphone className={`w-5 h-5 ${connectionStats.isConnected ? "text-green-600" : "text-gray-400"}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mensagens Total</p>
                <p className="text-lg font-semibold">{messageSummary.total}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoje</p>
                <p className="text-lg font-semibold">{messageSummary.today}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Plataforma</p>
                <p className="text-lg font-semibold capitalize">{connectionStats.platform}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                {connectionStats.platform === "zapier" ? (
                  <Zap className="w-5 h-5 text-orange-600" />
                ) : (
                  <Settings className="w-5 h-5 text-orange-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análise de Sentimentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Análise de Sentimentos</span>
          </CardTitle>
          <CardDescription>Distribuição emocional das mensagens recebidas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getSentimentColor("positive", messageSummary.positive)}`}>
                {messageSummary.positive}
              </div>
              <div className="text-sm text-gray-600">Positivas</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${messageSummary.total > 0 ? (messageSummary.positive / messageSummary.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="text-center">
              <div className={`text-2xl font-bold ${getSentimentColor("neutral", messageSummary.neutral)}`}>
                {messageSummary.neutral}
              </div>
              <div className="text-sm text-gray-600">Neutras</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${messageSummary.total > 0 ? (messageSummary.neutral / messageSummary.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="text-center">
              <div className={`text-2xl font-bold ${getSentimentColor("negative", messageSummary.negative)}`}>
                {messageSummary.negative}
              </div>
              <div className="text-sm text-gray-600">Negativas</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${messageSummary.total > 0 ? (messageSummary.negative / messageSummary.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status da Conexão */}
      {!connectionStats.isConnected && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>WhatsApp não conectado.</strong> Configure uma conexão abaixo para começar a receber mensagens.
          </AlertDescription>
        </Alert>
      )}

      {/* Configuração Principal */}
      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Configuração</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <WhatsAppAutomationSetup
            userRole={userRole}
            clientId={clientId}
            onConnectionChange={handleConnectionChange}
          />
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Mensagens Recentes</span>
                </div>
                <Badge variant="outline">{messageSummary.total} total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {messageSummary.total === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhuma mensagem ainda</h3>
                      <p className="text-gray-600">Configure uma conexão para começar a receber mensagens</p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600">
                        {messageSummary.total} mensagens recebidas. Use a aba "Configuração" para ver detalhes.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Atividade</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Última atividade:</span>
                    <span className="text-sm font-medium">{connectionStats.lastActivity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Plataforma:</span>
                    <span className="text-sm font-medium capitalize">{connectionStats.platform}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    {getStatusBadge()}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Métricas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taxa de resposta:</span>
                    <span className="text-sm font-medium">{messageSummary.total > 0 ? "100%" : "0%"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sentimento médio:</span>
                    <span className="text-sm font-medium">
                      {messageSummary.positive > messageSummary.negative ? "Positivo" : "Neutro"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Mensagens/dia:</span>
                    <span className="text-sm font-medium">{messageSummary.today}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
