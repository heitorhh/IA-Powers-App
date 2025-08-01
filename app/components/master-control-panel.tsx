"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Crown,
  Settings,
  Users,
  Brain,
  Database,
  MessageSquare,
  Trash2,
  Edit,
  AlertTriangle,
  Smartphone,
  Zap,
  Shield,
  BarChart3,
  RefreshCw,
  Key,
} from "lucide-react"
import WhatsAppUniversal from "./whatsapp-universal"
import type { Client, SystemHealth } from "@/types/user"
import ClientAPIManager from "./client-api-manager"

export default function MasterControlPanel() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "TechCorp Solutions",
      plan: "premium",
      status: "active",
      users: 45,
      maxUsers: 50,
      whatsappConnections: 3,
      maxWhatsappConnections: 5,
      apiCalls: 8420,
      maxApiCalls: 10000,
      createdAt: "2024-01-01",
      expiresAt: "2024-12-31",
      apiConfig: {
        openai: {
          apiKey: "sk-1234567890abcdef",
          model: "gpt-4",
          maxTokens: 2000,
          temperature: 0.7,
          enabled: true,
        },
        gemini: {
          apiKey: "AIza1234567890",
          model: "gemini-pro",
          maxTokens: 1500,
          temperature: 0.8,
          enabled: true,
        },
        internetAccess: {
          enabled: true,
          searchEngine: "google",
          apiKey: "google_search_key",
          maxQueries: 1000,
        },
        whatsapp: {
          enabled: true,
          maxConnections: 5,
          webhookUrl: "https://techcorp.com/webhook",
        },
      },
      tokenUsage: {
        openai: { used: 45000, limit: 100000, cost: 67.5 },
        gemini: { used: 23000, limit: 50000, cost: 23.45 },
        internetQueries: { used: 234, limit: 1000 },
        whatsappMessages: { sent: 1240, received: 2340, limit: 10000 },
      },
      features: {
        whatsappIntegration: true,
        sentimentAnalysis: true,
        aiSuggestions: true,
        customReports: true,
        apiAccess: true,
        internetAccess: true,
        aiChat: true,
      },
      consumption: {
        messages: 15420,
        aiAnalysis: 8230,
        reports: 156,
        storage: 2.3,
      },
      limits: {
        messagesPerMonth: 50000,
        aiAnalysisPerMonth: 25000,
        reportsPerMonth: 500,
        storageGB: 10,
        tokensPerMonth: 150000,
      },
    },
    {
      id: "2",
      name: "StartupXYZ",
      plan: "standard",
      status: "trial",
      users: 12,
      maxUsers: 25,
      whatsappConnections: 1,
      maxWhatsappConnections: 2,
      apiCalls: 2340,
      maxApiCalls: 5000,
      createdAt: "2024-01-15",
      expiresAt: "2024-02-15",
      apiConfig: {
        openai: {
          apiKey: "",
          model: "gpt-3.5-turbo",
          maxTokens: 1000,
          temperature: 0.7,
          enabled: false,
        },
        gemini: {
          apiKey: "",
          model: "gemini-pro",
          maxTokens: 1000,
          temperature: 0.7,
          enabled: false,
        },
        internetAccess: {
          enabled: false,
          searchEngine: "google",
          apiKey: "",
          maxQueries: 100,
        },
        whatsapp: {
          enabled: true,
          maxConnections: 2,
          webhookUrl: "",
        },
      },
      tokenUsage: {
        openai: { used: 2340, limit: 25000, cost: 3.51 },
        gemini: { used: 0, limit: 0, cost: 0 },
        internetQueries: { used: 0, limit: 100 },
        whatsappMessages: { sent: 234, received: 456, limit: 5000 },
      },
      features: {
        whatsappIntegration: true,
        sentimentAnalysis: true,
        aiSuggestions: false,
        customReports: false,
        apiAccess: false,
        internetAccess: false,
        aiChat: true,
      },
      consumption: {
        messages: 3420,
        aiAnalysis: 1230,
        reports: 23,
        storage: 0.8,
      },
      limits: {
        messagesPerMonth: 10000,
        aiAnalysisPerMonth: 5000,
        reportsPerMonth: 100,
        storageGB: 5,
        tokensPerMonth: 25000,
      },
    },
    {
      id: "3",
      name: "Enterprise Corp",
      plan: "basic",
      status: "suspended",
      users: 8,
      maxUsers: 10,
      whatsappConnections: 0,
      maxWhatsappConnections: 1,
      apiCalls: 890,
      maxApiCalls: 1000,
      createdAt: "2023-12-01",
      expiresAt: "2024-01-31",
      apiConfig: {
        openai: {
          apiKey: "",
          model: "gpt-3.5-turbo",
          maxTokens: 500,
          temperature: 0.7,
          enabled: false,
        },
        gemini: {
          apiKey: "",
          model: "gemini-pro",
          maxTokens: 500,
          temperature: 0.7,
          enabled: false,
        },
        internetAccess: {
          enabled: false,
          searchEngine: "google",
          apiKey: "",
          maxQueries: 50,
        },
        whatsapp: {
          enabled: false,
          maxConnections: 1,
          webhookUrl: "",
        },
      },
      tokenUsage: {
        openai: { used: 890, limit: 5000, cost: 1.34 },
        gemini: { used: 0, limit: 0, cost: 0 },
        internetQueries: { used: 0, limit: 50 },
        whatsappMessages: { sent: 0, received: 0, limit: 1000 },
      },
      features: {
        whatsappIntegration: false,
        sentimentAnalysis: false,
        aiSuggestions: false,
        customReports: false,
        apiAccess: false,
        internetAccess: false,
        aiChat: false,
      },
      consumption: {
        messages: 890,
        aiAnalysis: 0,
        reports: 5,
        storage: 0.2,
      },
      limits: {
        messagesPerMonth: 2000,
        aiAnalysisPerMonth: 0,
        reportsPerMonth: 20,
        storageGB: 1,
        tokensPerMonth: 5000,
      },
    },
  ])

  const [systemHealth] = useState<SystemHealth>({
    status: "healthy",
    uptime: 99.8,
    activeClients: clients.filter((c) => c.status === "active").length,
    totalMessages: clients.reduce((acc, c) => acc + c.consumption.messages, 0),
    aiAccuracy: 94.2,
    responseTime: 120,
    errors: 3,
  })

  const [aiConfig, setAiConfig] = useState({
    teacherMode: 20,
    improvementSuggestions: 50,
    profileQuestions: 10,
    sentimentAnalysis: true,
    autoResponses: false,
    learningMode: true,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "trial":
        return "bg-blue-100 text-blue-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "premium":
        return "bg-purple-100 text-purple-800"
      case "standard":
        return "bg-blue-100 text-blue-800"
      case "basic":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getHealthStatus = (status: string) => {
    switch (status) {
      case "healthy":
        return { color: "text-green-600", icon: "🟢" }
      case "warning":
        return { color: "text-yellow-600", icon: "🟡" }
      case "critical":
        return { color: "text-red-600", icon: "🔴" }
      default:
        return { color: "text-gray-600", icon: "⚪" }
    }
  }

  const selectedClientData = clients.find((c) => c.id === selectedClient)
  const healthStatus = getHealthStatus(systemHealth.status)

  const handleSaveClientConfig = (clientId: string, config: any) => {
    setClients(clients.map((client) => (client.id === clientId ? { ...client, ...config } : client)))
    console.log(`Configurações salvas para cliente ${clientId}:`, config)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Painel Master</h1>
                <p className="text-xs opacity-90">Controle Total do Sistema</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30">
                {healthStatus.icon} Sistema {systemHealth.status}
              </Badge>
              <Badge className="bg-white bg-opacity-20 text-white border-white border-opacity-30">Master Admin</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{systemHealth.uptime}%</p>
                  <p className="text-sm text-gray-600">Uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{systemHealth.activeClients}</p>
                  <p className="text-sm text-gray-600">Clientes Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{systemHealth.totalMessages.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Mensagens</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Brain className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{systemHealth.aiAccuracy}%</p>
                  <p className="text-sm text-gray-600">IA Precisão</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Zap className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{systemHealth.responseTime}ms</p>
                  <p className="text-sm text-gray-600">Resposta</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{systemHealth.errors}</p>
                  <p className="text-sm text-gray-600">Erros</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="api-manager">APIs & IA</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="ai-config">Config Global</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>

          {/* Gerenciamento de Clientes */}
          <TabsContent value="clients">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Clientes Cadastrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {clients.map((client) => (
                        <div
                          key={client.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            selectedClient === client.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                          }`}
                          onClick={() => setSelectedClient(client.id)}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium text-lg">{client.name}</h3>
                            <div className="flex space-x-2">
                              <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                              <Badge className={getPlanColor(client.plan)}>{client.plan}</Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">
                                Usuários: {client.users}/{client.maxUsers}
                              </p>
                              <Progress value={(client.users / client.maxUsers) * 100} className="h-2 mt-1" />
                            </div>
                            <div>
                              <p className="text-gray-600">
                                Tokens: {client.tokenUsage.openai.used.toLocaleString()}/
                                {client.limits.tokensPerMonth.toLocaleString()}
                              </p>
                              <Progress
                                value={(client.tokenUsage.openai.used / client.limits.tokensPerMonth) * 100}
                                className="h-2 mt-1"
                              />
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                            <div className="text-center p-2 bg-blue-50 rounded">
                              <div className="font-bold">{client.consumption.messages.toLocaleString()}</div>
                              <div className="text-gray-600">Mensagens</div>
                            </div>
                            <div className="text-center p-2 bg-green-50 rounded">
                              <div className="font-bold">
                                ${(client.tokenUsage.openai.cost + client.tokenUsage.gemini.cost).toFixed(2)}
                              </div>
                              <div className="text-gray-600">Custo APIs</div>
                            </div>
                            <div className="text-center p-2 bg-purple-50 rounded">
                              <div className="font-bold">{client.consumption.reports}</div>
                              <div className="text-gray-600">Relatórios</div>
                            </div>
                            <div className="text-center p-2 bg-orange-50 rounded">
                              <div className="font-bold">{client.consumption.storage}GB</div>
                              <div className="text-gray-600">Storage</div>
                            </div>
                          </div>

                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                              <Trash2 className="h-3 w-3 mr-1" />
                              Suspender
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Detalhes do Cliente Selecionado */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedClientData ? `Detalhes - ${selectedClientData.name}` : "Selecione um Cliente"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedClientData ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Consumo vs Limites</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Tokens OpenAI</span>
                              <span>
                                {selectedClientData.tokenUsage.openai.used.toLocaleString()}/
                                {selectedClientData.limits.tokensPerMonth.toLocaleString()}
                              </span>
                            </div>
                            <Progress
                              value={
                                (selectedClientData.tokenUsage.openai.used / selectedClientData.limits.tokensPerMonth) *
                                100
                              }
                              className="h-2"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Mensagens</span>
                              <span>
                                {selectedClientData.consumption.messages.toLocaleString()}/
                                {selectedClientData.limits.messagesPerMonth.toLocaleString()}
                              </span>
                            </div>
                            <Progress
                              value={
                                (selectedClientData.consumption.messages / selectedClientData.limits.messagesPerMonth) *
                                100
                              }
                              className="h-2"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Storage</span>
                              <span>
                                {selectedClientData.consumption.storage}GB/{selectedClientData.limits.storageGB}GB
                              </span>
                            </div>
                            <Progress
                              value={
                                (selectedClientData.consumption.storage / selectedClientData.limits.storageGB) * 100
                              }
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Custo Total APIs</h4>
                        <div className="text-2xl font-bold text-green-600">
                          $
                          {(
                            selectedClientData.tokenUsage.openai.cost + selectedClientData.tokenUsage.gemini.cost
                          ).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Este mês</div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">Informações</h4>
                        <div className="text-sm space-y-1">
                          <p>Criado: {new Date(selectedClientData.createdAt).toLocaleDateString("pt-BR")}</p>
                          <p>Expira: {new Date(selectedClientData.expiresAt).toLocaleDateString("pt-BR")}</p>
                          <p>API Calls: {selectedClientData.apiCalls.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Clique em um cliente para ver os detalhes</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Gerenciador Individual de APIs */}
          <TabsContent value="api-manager">
            {selectedClientData ? (
              <ClientAPIManager
                clientId={selectedClientData.id}
                clientName={selectedClientData.name}
                onSave={handleSaveClientConfig}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Key className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Selecione um Cliente</h3>
                  <p className="text-gray-600">
                    Escolha um cliente na aba "Clientes" para gerenciar suas APIs individuais e configurar a IA Maestro
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* WhatsApp Management */}
          <TabsContent value="whatsapp">
            <div className="space-y-6">
              {selectedClientData ? (
                <WhatsAppUniversal
                  userRole="master"
                  clientId={selectedClientData.id}
                  canConnect={
                    selectedClientData.whatsappConnections < selectedClientData.maxWhatsappConnections &&
                    selectedClientData.features.whatsappIntegration
                  }
                />
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Smartphone className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Selecione um Cliente</h3>
                    <p className="text-gray-600">
                      Escolha um cliente na aba "Clientes" para gerenciar suas conexões WhatsApp
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* AI Configuration Global */}
          <TabsContent value="ai-config">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span>Configurações Globais de IA</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium">Modo Professor: {aiConfig.teacherMode}%</Label>
                    <p className="text-xs text-gray-600 mb-2">Frequência global de explicações educativas</p>
                    <Slider
                      value={[aiConfig.teacherMode]}
                      onValueChange={(value) => setAiConfig({ ...aiConfig, teacherMode: value[0] })}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Sugestões: {aiConfig.improvementSuggestions}%</Label>
                    <p className="text-xs text-gray-600 mb-2">Frequência de dicas de melhoria</p>
                    <Slider
                      value={[aiConfig.improvementSuggestions]}
                      onValueChange={(value) => setAiConfig({ ...aiConfig, improvementSuggestions: value[0] })}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Perguntas Perfil: {aiConfig.profileQuestions}%</Label>
                    <p className="text-xs text-gray-600 mb-2">Frequência de perguntas DISC</p>
                    <Slider
                      value={[aiConfig.profileQuestions]}
                      onValueChange={(value) => setAiConfig({ ...aiConfig, profileQuestions: value[0] })}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Análise de Sentimentos</Label>
                        <p className="text-xs text-gray-600">Ativar globalmente</p>
                      </div>
                      <Switch
                        checked={aiConfig.sentimentAnalysis}
                        onCheckedChange={(checked) => setAiConfig({ ...aiConfig, sentimentAnalysis: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Respostas Automáticas</Label>
                        <p className="text-xs text-gray-600">IA pode responder automaticamente</p>
                      </div>
                      <Switch
                        checked={aiConfig.autoResponses}
                        onCheckedChange={(checked) => setAiConfig({ ...aiConfig, autoResponses: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Modo Aprendizado</Label>
                        <p className="text-xs text-gray-600">Sistema aprende com interações</p>
                      </div>
                      <Switch
                        checked={aiConfig.learningMode}
                        onCheckedChange={(checked) => setAiConfig({ ...aiConfig, learningMode: checked })}
                      />
                    </div>
                  </div>

                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Aplicar Configurações Globais
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-900">{clients.length}</div>
                        <div className="text-sm text-blue-700">Clientes Total</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-900">
                          {clients.filter((c) => c.status === "active").length}
                        </div>
                        <div className="text-sm text-green-700">Ativos</div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Uso Total de APIs</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>OpenAI:</span>
                          <span className="font-medium">
                            {clients.reduce((acc, c) => acc + c.tokenUsage.openai.used, 0).toLocaleString()} tokens
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Gemini:</span>
                          <span className="font-medium">
                            {clients.reduce((acc, c) => acc + c.tokenUsage.gemini.used, 0).toLocaleString()} tokens
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Custo Total:</span>
                          <span className="font-medium text-green-600">
                            $
                            {clients
                              .reduce((acc, c) => acc + c.tokenUsage.openai.cost + c.tokenUsage.gemini.cost, 0)
                              .toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Métricas Globais</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Uptime do Sistema</span>
                        <span className="text-sm">{systemHealth.uptime}%</span>
                      </div>
                      <Progress value={systemHealth.uptime} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Precisão da IA</span>
                        <span className="text-sm">{systemHealth.aiAccuracy}%</span>
                      </div>
                      <Progress value={systemHealth.aiAccuracy} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Satisfação dos Clientes</span>
                        <span className="text-sm">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Uso por Funcionalidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">APIs Configuradas</span>
                      <span className="text-sm font-medium">
                        {clients.reduce((acc, c) => {
                          let count = 0
                          if (c.apiConfig.openai?.enabled) count++
                          if (c.apiConfig.gemini?.enabled) count++
                          if (c.apiConfig.internetAccess?.enabled) count++
                          return acc + count
                        }, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mensagens Processadas</span>
                      <span className="text-sm font-medium">
                        {clients.reduce((acc, c) => acc + c.consumption.messages, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Relatórios Gerados</span>
                      <span className="text-sm font-medium">
                        {clients.reduce((acc, c) => acc + c.consumption.reports, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Storage Utilizado</span>
                      <span className="text-sm font-medium">
                        {clients.reduce((acc, c) => acc + c.consumption.storage, 0).toFixed(1)}GB
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Management */}
          <TabsContent value="system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>Status do Sistema</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status Geral</span>
                      <Badge className={`${healthStatus.color} bg-transparent`}>
                        {healthStatus.icon} {systemHealth.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tempo de Resposta</span>
                      <span className="text-sm font-medium">{systemHealth.responseTime}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Erros nas últimas 24h</span>
                      <span className="text-sm font-medium">{systemHealth.errors}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Clientes Ativos</span>
                      <span className="text-sm font-medium">{systemHealth.activeClients}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-transparent" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reiniciar Serviços
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Backup do Sistema
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações Avançadas
                  </Button>
                  <Button className="w-full" variant="destructive">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Modo Manutenção
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
