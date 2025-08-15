"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MessageSquare,
  Settings,
  BarChart3,
  HelpCircle,
  Users,
  TrendingUp,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react"
import WhatsAppConnection from "./components/whatsapp-connection"

export default function Dashboard() {
  const [connectedUsers, setConnectedUsers] = useState(0)
  const [totalMessages, setTotalMessages] = useState(0)
  const [activeChats, setActiveChats] = useState(0)

  const handleConnectionChange = (connected: boolean, userRole: string) => {
    if (connected) {
      setConnectedUsers((prev) => prev + 1)
    } else {
      setConnectedUsers((prev) => Math.max(0, prev - 1))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                🤖 IA Powers MVP
              </h1>
              <p className="text-gray-600 mt-2">Seu assistente inteligente para WhatsApp Business</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800 px-3 py-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Sistema Online
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Conectados</p>
                  <p className="text-3xl font-bold text-blue-600">{connectedUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mensagens Hoje</p>
                  <p className="text-3xl font-bold text-green-600">{totalMessages}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chats Ativos</p>
                  <p className="text-3xl font-bold text-purple-600">{activeChats}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">IA Ativa</p>
                  <p className="text-3xl font-bold text-orange-600">
                    <Zap className="w-8 h-8 text-orange-500 inline" />
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Mensagens
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configuração
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Ajuda
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />📱 Mensagens Recentes
                  </CardTitle>
                  <CardDescription>Últimas conversas do WhatsApp</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {totalMessages === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Nenhuma mensagem ainda</p>
                        <p className="text-sm text-gray-400">Conecte seu WhatsApp para começar</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">João Silva</p>
                              <p className="text-sm text-gray-600">Olá! Como posso ajudar?</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Positivo</Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />📊 Análise de Sentimentos
                  </CardTitle>
                  <CardDescription>Humor das conversas em tempo real</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Positivas</span>
                      </div>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Negativas</span>
                      </div>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Neutras</span>
                      </div>
                      <span className="font-medium">0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WhatsAppConnection
                userRole="simple"
                clientId="user_001"
                onConnectionChange={(connected) => handleConnectionChange(connected, "simple")}
              />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-600" />
                    ⚙️ Configurações do Sistema
                  </CardTitle>
                  <CardDescription>Configure seu assistente IA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Webhook URL:</strong>
                      <br />
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {typeof window !== "undefined" ? window.location.origin : "https://seu-app.vercel.app"}
                        /api/whatsapp/webhook
                      </code>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <h4 className="font-medium">Status dos Serviços</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Webhook</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ativo
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">IA Assistant</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ativo
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Análise de Sentimentos</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ativo
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />📈 Métricas de Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Dados sendo coletados...</p>
                      <p className="text-sm text-gray-400">Conecte seu WhatsApp para ver analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600" />⏰ Atividade por Horário
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Analisando padrões...</p>
                      <p className="text-sm text-gray-400">Dados disponíveis após primeiras mensagens</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-orange-600" />🚀 Primeiros Passos
                  </CardTitle>
                  <CardDescription>Configure seu sistema em minutos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Conecte seu WhatsApp</p>
                        <p className="text-sm text-gray-600">Use a aba "Configuração" para conectar</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Configure o Webhook</p>
                        <p className="text-sm text-gray-600">URL já está configurada automaticamente</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Teste o Sistema</p>
                        <p className="text-sm text-gray-600">Envie uma mensagem e veja a mágica acontecer</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-blue-600" />📚 Tutoriais e Recursos
                  </CardTitle>
                  <CardDescription>Aprenda a usar todas as funcionalidades</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => window.open("/tutorial/zapier", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Tutorial Zapier + WhatsApp
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => window.open("/api/whatsapp/health", "_blank")}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verificar Status da API
                  </Button>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Precisa de ajuda?</strong>
                      <br />
                      Todos os tutoriais estão disponíveis e o sistema está funcionando perfeitamente!
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
