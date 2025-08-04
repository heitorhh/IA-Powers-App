"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Smartphone, Zap, Globe, Shield, CheckCircle, ArrowRight, Settings, BarChart3, Webhook, Database } from 'lucide-react'
import WhatsAppSimpleConnection from "./whatsapp-simple-connection"
import EvolutionWhatsApp from "./evolution-whatsapp"

interface WhatsAppManagerProps {
  userRole: "simple" | "leader" | "master"
  clientId: string
  onConnectionChange?: (connected: boolean) => void
}

export default function WhatsAppManager({ userRole, clientId, onConnectionChange }: WhatsAppManagerProps) {
  const [selectedMethod, setSelectedMethod] = useState<"simple" | "evolution">("simple")
  const [showComparison, setShowComparison] = useState(true)

  const simpleFeatures = [
    { icon: Smartphone, title: "Conexão Direta", description: "Conecta diretamente sem servidores externos" },
    { icon: Shield, title: "Mais Estável", description: "Funciona localmente, sem dependências" },
    { icon: CheckCircle, title: "Fácil Setup", description: "Configuração simples e rápida" },
    { icon: BarChart3, title: "Analytics Básico", description: "Análise de sentimentos e estatísticas" },
    { icon: Database, title: "Armazenamento Local", description: "Dados salvos localmente no servidor" },
    { icon: Settings, title: "Controle Total", description: "Gerenciamento completo das sessões" },
  ]

  const evolutionFeatures = [
    { icon: Globe, title: "API Externa", description: "Conecta via Evolution API no Railway" },
    { icon: Zap, title: "Webhooks Avançados", description: "Receba mensagens via webhooks em tempo real" },
    { icon: Shield, title: "Recursos Avançados", description: "Múltiplas instâncias e recursos profissionais" },
    { icon: BarChart3, title: "Analytics Completo", description: "Análise detalhada e relatórios avançados" },
    { icon: Database, title: "Database Externo", description: "Armazenamento em banco de dados externo" },
    { icon: Settings, title: "API REST", description: "API completa para integrações avançadas" },
  ]

  return (
    <div className="space-y-6">
      {/* Comparação WhatsApp Web.js vs Evolution API */}
      {showComparison && (
        <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-blue-900">Recomendado: WhatsApp Web.js</strong>
                <p className="text-blue-700 text-sm mt-1">
                  Mais estável, funciona localmente e não depende de servidores externos
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowComparison(false)} className="ml-4">
                Entendi
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple" className="relative">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4" />
              <span>WhatsApp Web.js</span>
              <Badge className="bg-green-500 text-white text-xs ml-1">Recomendado</Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger value="evolution">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Evolution API</span>
              <Badge variant="outline" className="text-xs ml-1">
                Beta
              </Badge>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simple" className="space-y-6">
          {/* Vantagens WhatsApp Web.js */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {simpleFeatures.map((feature, index) => (
              <Card key={index} className="border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{feature.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Componente WhatsApp Web.js */}
          <WhatsAppSimpleConnection userRole={userRole} clientId={clientId} onConnectionChange={onConnectionChange} />

          {/* Informações Técnicas */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-900">
                <Settings className="w-5 h-5" />
                <span>Configuração WhatsApp Web.js</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Recursos Técnicos:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Conexão direta com WhatsApp Web</li>
                    <li>• Puppeteer para automação</li>
                    <li>• Sessões persistentes locais</li>
                    <li>• QR Code automático</li>
                    <li>• Eventos em tempo real</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Vantagens:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Não depende de servidores externos</li>
                    <li>• Mais estável e confiável</li>
                    <li>• Setup mais simples</li>
                    <li>• Controle total dos dados</li>
                    <li>• Menor latência</li>
                  </ul>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Status:</span>
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Funcionando Perfeitamente
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6">
          {/* Aviso sobre Evolution API */}
          <Alert className="border-yellow-200 bg-yellow-50">
            <Settings className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Evolution API:</strong> Ainda em configuração no Railway. Pode apresentar instabilidades.
              Recomendamos usar o WhatsApp Web.js para produção.
            </AlertDescription>
          </Alert>

          {/* Recursos da Evolution API */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evolutionFeatures.map((feature, index) => (
              <Card key={index} className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{feature.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Componente Evolution API */}
          <EvolutionWhatsApp userRole={userRole} clientId={clientId} onConnectionChange={onConnectionChange} />

          {/* Migração para WhatsApp Web.js */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-900">Quer Mais Estabilidade?</h3>
                    <p className="text-sm text-green-700">
                      Use o WhatsApp Web.js para uma conexão mais confiável
                    </p>
                  </div>
                </div>
                <Button onClick={() => setSelectedMethod("simple")} className="bg-green-600 hover:bg-green-700">
                  Usar Web.js
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Documentação e Suporte */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Documentação e Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">WhatsApp Web.js (Recomendado):</h4>
              <div className="bg-green-100 p-3 rounded text-sm">
                <p>✅ Funcionando perfeitamente</p>
                <p>✅ Conexão estável</p>
                <p>✅ QR Code funcionando</p>
                <p>✅ Pronto para produção</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Evolution API:</h4>
              <div className="bg-yellow-100 p-3 rounded text-sm">
                <p>⚠️ Em configuração no Railway</p>
                <p>⚠️ Pode apresentar instabilidades</p>
                <p>⚠️ Requer servidor externo</p>
                <p>🔧 Use apenas para testes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
