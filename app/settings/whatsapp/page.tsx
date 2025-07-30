"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Smartphone, Settings, Zap, Globe, ArrowLeft, CheckCircle, AlertCircle, Database } from "lucide-react"
import WhatsAppManager from "@/app/components/whatsapp-manager"
import { useRouter } from "next/navigation"

export default function WhatsAppSettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [connectionStatus, setConnectionStatus] = useState(false)
  const [systemHealth, setSystemHealth] = useState({
    evolutionApi: false,
    webhook: false,
    database: true,
  })

  useEffect(() => {
    // Simular usuário logado
    const mockUser = {
      id: "1",
      name: "Admin Master",
      role: "master",
      clientId: "master_admin_001",
    }
    setUser(mockUser)

    // Verificar saúde do sistema
    checkSystemHealth()
  }, [])

  const checkSystemHealth = async () => {
    try {
      // Verificar Evolution API
      const evolutionResponse = await fetch("/api/evolution/instances")
      const evolutionHealth = evolutionResponse.ok

      // Verificar Webhook
      const webhookResponse = await fetch("/api/evolution/webhook")
      const webhookHealth = webhookResponse.ok

      setSystemHealth({
        evolutionApi: evolutionHealth,
        webhook: webhookHealth,
        database: true, // Assumir que database sempre está OK
      })
    } catch (error) {
      console.error("Erro ao verificar saúde do sistema:", error)
    }
  }

  const handleConnectionChange = (connected: boolean) => {
    setConnectionStatus(connected)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Configurações WhatsApp</h1>
                  <p className="text-xs text-gray-500">Gerenciamento completo de conexões</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={connectionStatus ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {connectionStatus ? "Conectado" : "Desconectado"}
              </Badge>
              <Badge variant="outline">{user.role === "master" ? "Master Admin" : user.role}</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status do Sistema */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Status do Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Evolution API</span>
                </div>
                {systemHealth.evolutionApi ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Webhook</span>
                </div>
                {systemHealth.webhook ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Database</span>
                </div>
                {systemHealth.database ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações importantes */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Zap className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Evolution API Integrada:</strong> Sistema agora suporta conexão real com WhatsApp através da
            Evolution API. Webhooks automáticos, múltiplas instâncias e análise em tempo real.
          </AlertDescription>
        </Alert>

        {/* Gerenciador WhatsApp */}
        <WhatsAppManager userRole={user.role} clientId={user.clientId} onConnectionChange={handleConnectionChange} />

        {/* Informações de Suporte */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informações Técnicas</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="installation" className="space-y-4">
              <TabsList>
                <TabsTrigger value="installation">Instalação</TabsTrigger>
                <TabsTrigger value="configuration">Configuração</TabsTrigger>
                <TabsTrigger value="troubleshooting">Suporte</TabsTrigger>
              </TabsList>

              <TabsContent value="installation" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Instalação Evolution API:</h4>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <p># Via Docker (Recomendado)</p>
                    <p>docker run -d \</p>
                    <p>&nbsp;&nbsp;--name evolution-api \</p>
                    <p>&nbsp;&nbsp;-p 8080:8080 \</p>
                    <p>&nbsp;&nbsp;-e AUTHENTICATION_API_KEY=your-api-key \</p>
                    <p>&nbsp;&nbsp;evolution-api/evolution-api</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Variáveis de Ambiente:</h4>
                  <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                    <p>EVOLUTION_API_URL=http://localhost:8080</p>
                    <p>EVOLUTION_API_KEY=your-api-key-here</p>
                    <p>NEXT_PUBLIC_APP_URL=https://your-domain.com</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="configuration" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Configurações Recomendadas:</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Webhook URL configurada automaticamente</li>
                      <li>• Eventos em tempo real habilitados</li>
                      <li>• Múltiplas instâncias suportadas</li>
                      <li>• Base64 QR Code para melhor performance</li>
                      <li>• Análise de sentimentos integrada</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Recursos Ativos:</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>✅ Conexão real com WhatsApp Web</li>
                      <li>✅ Recebimento de mensagens via webhook</li>
                      <li>✅ Envio de mensagens programático</li>
                      <li>✅ Gerenciamento de múltiplas instâncias</li>
                      <li>✅ Análise automática de sentimentos</li>
                      <li>✅ Persistência de dados</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="troubleshooting" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Problemas Comuns:</h4>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
                      <p className="font-medium">QR Code não aparece:</p>
                      <p className="text-gray-600">Verifique se a Evolution API está rodando na porta 8080</p>
                    </div>
                    <div className="p-3 border-l-4 border-red-400 bg-red-50">
                      <p className="font-medium">Webhook não funciona:</p>
                      <p className="text-gray-600">
                        Certifique-se que NEXT_PUBLIC_APP_URL está configurado corretamente
                      </p>
                    </div>
                    <div className="p-3 border-l-4 border-blue-400 bg-blue-50">
                      <p className="font-medium">Instância não conecta:</p>
                      <p className="text-gray-600">Verifique a API Key e tente recriar a instância</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Precisa de Ajuda?</h4>
                    <p className="text-sm text-gray-600">Entre em contato com nosso suporte técnico</p>
                  </div>
                  <Button variant="outline">Abrir Ticket</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
