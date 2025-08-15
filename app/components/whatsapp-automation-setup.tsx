"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Zap,
  Settings,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Webhook,
  MessageSquare,
  Shield,
  Smartphone,
  RefreshCw,
  Play,
  Pause,
  Code,
} from "lucide-react"

import MakeTutorial from "./make-tutorial"

interface WhatsAppAutomationProps {
  userRole: "simple" | "leader" | "master"
  clientId: string
  onConnectionChange?: (connected: boolean) => void
}

interface WebhookConfig {
  id: string
  name: string
  url: string
  status: "active" | "inactive" | "error"
  platform: "make" | "zapier" | "custom"
  lastReceived?: string
  messageCount: number
}

interface ReceivedMessage {
  id: string
  from: string
  message: string
  timestamp: string
  platform: string
  sentiment: "positive" | "negative" | "neutral"
  processed: boolean
}

export default function WhatsAppAutomationSetup({ userRole, clientId, onConnectionChange }: WhatsAppAutomationProps) {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([])
  const [messages, setMessages] = useState<ReceivedMessage[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<"make" | "zapier">("make")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false)
  const [testMessage, setTestMessage] = useState("")
  const [showInstructions, setShowInstructions] = useState(true)

  const baseWebhookUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app"

  useEffect(() => {
    generateWebhookUrl()
    loadWebhooks()
    loadMessages()
  }, [clientId])

  const generateWebhookUrl = () => {
    const uniqueId = `${clientId}_${Date.now()}`
    const url = `${baseWebhookUrl}/api/webhooks/whatsapp/${uniqueId}`
    setWebhookUrl(url)
  }

  const loadWebhooks = async () => {
    try {
      const response = await fetch(`/api/webhooks/list?clientId=${clientId}`)
      const data = await response.json()
      if (data.success) {
        setWebhooks(data.webhooks)
        onConnectionChange?.(data.webhooks.some((w: WebhookConfig) => w.status === "active"))
      }
    } catch (error) {
      console.error("Erro ao carregar webhooks:", error)
    }
  }

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/webhooks/messages?clientId=${clientId}&limit=20`)
      const data = await response.json()
      if (data.success) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error)
    }
  }

  const registerWebhook = async () => {
    setIsGeneratingUrl(true)
    try {
      const response = await fetch("/api/webhooks/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          platform: selectedPlatform,
          url: webhookUrl,
          userRole,
        }),
      })

      const data = await response.json()
      if (data.success) {
        await loadWebhooks()
      }
    } catch (error) {
      console.error("Erro ao registrar webhook:", error)
    } finally {
      setIsGeneratingUrl(false)
    }
  }

  const testWebhook = async () => {
    if (!testMessage.trim()) return

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "test@whatsapp.com",
          message: testMessage,
          timestamp: new Date().toISOString(),
          platform: selectedPlatform,
        }),
      })

      if (response.ok) {
        setTestMessage("")
        await loadMessages()
      }
    } catch (error) {
      console.error("Erro ao testar webhook:", error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "make":
        return <Settings className="w-4 h-4" />
      case "zapier":
        return <Zap className="w-4 h-4" />
      default:
        return <Webhook className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ativo
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
            <Pause className="w-3 h-3 mr-1" />
            Inativo
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

  const makeInstructions = [
    {
      step: 1,
      title: "Criar conta no Make.com",
      description: "Acesse make.com e crie uma conta gratuita",
      action: "https://make.com",
    },
    {
      step: 2,
      title: "Criar novo Scenario",
      description: "Clique em 'Create a new scenario' e busque por 'WhatsApp Business'",
    },
    {
      step: 3,
      title: "Configurar WhatsApp Trigger",
      description: "Adicione o módulo 'WhatsApp Business > Watch Messages'",
    },
    {
      step: 4,
      title: "Adicionar Webhook",
      description: "Adicione um módulo 'HTTP > Make a request' e cole a URL do webhook",
    },
    {
      step: 5,
      title: "Configurar dados",
      description: "Configure os campos: from, message, timestamp no webhook",
    },
    {
      step: 6,
      title: "Ativar Scenario",
      description: "Clique em 'Run once' para testar e depois ative o scenario",
    },
  ]

  const zapierInstructions = [
    {
      step: 1,
      title: "Criar conta no Zapier",
      description: "Acesse zapier.com e crie uma conta",
      action: "https://zapier.com",
    },
    {
      step: 2,
      title: "Criar novo Zap",
      description: "Clique em 'Create Zap' e busque por 'WhatsApp Business'",
    },
    {
      step: 3,
      title: "Configurar Trigger",
      description: "Escolha 'New Message' como trigger do WhatsApp Business",
    },
    {
      step: 4,
      title: "Adicionar Webhook Action",
      description: "Adicione uma ação 'Webhooks by Zapier > POST'",
    },
    {
      step: 5,
      title: "Configurar Webhook URL",
      description: "Cole a URL do webhook e configure os dados da mensagem",
    },
    {
      step: 6,
      title: "Testar e Publicar",
      description: "Teste o Zap e publique para ativar a automação",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header com comparação de plataformas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className={`cursor-pointer transition-all ${selectedPlatform === "make" ? "ring-2 ring-blue-500" : ""}`}
          onClick={() => setSelectedPlatform("make")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium">Make.com</h3>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Recomendado</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">Interface visual intuitiva, melhor para WhatsApp Business</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                WhatsApp Business API nativo
              </div>
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Interface visual drag & drop
              </div>
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                1000 operações grátis/mês
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${selectedPlatform === "zapier" ? "ring-2 ring-orange-500" : ""}`}
          onClick={() => setSelectedPlatform("zapier")}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-orange-600" />
                <h3 className="font-medium">Zapier</h3>
              </div>
              <Badge variant="outline">Alternativa</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">Plataforma mais conhecida, boa para iniciantes</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Mais integrações disponíveis
              </div>
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Interface simples
              </div>
              <div className="flex items-center text-yellow-600">
                <AlertCircle className="w-3 h-3 mr-1" />
                100 tarefas grátis/mês
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="setup">Configuração</TabsTrigger>
          <TabsTrigger value="tutorial">Tutorial Passo-a-Passo</TabsTrigger>
          <TabsTrigger value="instructions">Instruções</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Webhook className="w-5 h-5" />
                <span>URL do Webhook</span>
              </CardTitle>
              <CardDescription>
                Use esta URL no {selectedPlatform === "make" ? "Make.com" : "Zapier"} para receber mensagens do WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL do Webhook</Label>
                <div className="flex space-x-2">
                  <Input id="webhook-url" value={webhookUrl} readOnly className="font-mono text-sm" />
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(webhookUrl)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={generateWebhookUrl}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Segurança:</strong> Esta URL é única para seu cliente e inclui autenticação automática.
                </AlertDescription>
              </Alert>

              <div className="flex space-x-2">
                <Button onClick={registerWebhook} disabled={isGeneratingUrl} className="flex-1">
                  {isGeneratingUrl ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Registrar Webhook
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(selectedPlatform === "make" ? "https://make.com" : "https://zapier.com", "_blank")
                  }
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir {selectedPlatform === "make" ? "Make.com" : "Zapier"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Teste do Webhook */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="w-5 h-5" />
                <span>Testar Webhook</span>
              </CardTitle>
              <CardDescription>Envie uma mensagem de teste para verificar se está funcionando</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-message">Mensagem de Teste</Label>
                <Textarea
                  id="test-message"
                  placeholder="Digite uma mensagem para testar o webhook..."
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                />
              </div>
              <Button onClick={testWebhook} disabled={!testMessage.trim()} className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Enviar Teste
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tutorial" className="space-y-4">
          <MakeTutorial webhookUrl={webhookUrl} />
        </TabsContent>

        <TabsContent value="instructions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {selectedPlatform === "make" ? <Settings className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                <span>Como configurar no {selectedPlatform === "make" ? "Make.com" : "Zapier"}</span>
              </CardTitle>
              <CardDescription>Siga estes passos para conectar seu WhatsApp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(selectedPlatform === "make" ? makeInstructions : zapierInstructions).map((instruction, index) => (
                  <div key={index} className="flex space-x-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-600">{instruction.step}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{instruction.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{instruction.description}</p>
                      {instruction.action && (
                        <Button variant="outline" size="sm" onClick={() => window.open(instruction.action, "_blank")}>
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Abrir
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Webhook className="w-5 h-5" />
                  <span>Webhooks Ativos</span>
                </div>
                <Button variant="outline" size="sm" onClick={loadWebhooks}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {webhooks.length === 0 ? (
                <div className="text-center py-8">
                  <Webhook className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum webhook configurado</h3>
                  <p className="text-gray-600 mb-4">Configure um webhook na aba "Configuração" para começar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {webhooks.map((webhook) => (
                    <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getPlatformIcon(webhook.platform)}
                        <div>
                          <h4 className="font-medium">{webhook.name}</h4>
                          <p className="text-sm text-gray-600">{webhook.platform}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right text-sm">
                          <div className="font-medium">{webhook.messageCount} mensagens</div>
                          {webhook.lastReceived && (
                            <div className="text-gray-500">
                              Última: {new Date(webhook.lastReceived).toLocaleString("pt-BR")}
                            </div>
                          )}
                        </div>
                        {getStatusBadge(webhook.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Mensagens Recebidas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{messages.length} mensagens</Badge>
                  <Button variant="outline" size="sm" onClick={loadMessages}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Atualizar
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma mensagem recebida</h3>
                  <p className="text-gray-600">As mensagens do WhatsApp aparecerão aqui quando chegarem</p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div key={message.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Smartphone className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-sm">{message.from}</span>
                            <Badge variant="outline" className="text-xs">
                              {message.platform}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={getSentimentColor(message.sentiment)}>
                              {message.sentiment}
                            </Badge>
                            {message.processed && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Processado
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{message.message}</p>
                        <div className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleString("pt-BR")}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
