"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Smartphone,
  Zap,
  Globe,
  Shield,
  CheckCircle,
  ArrowRight,
  Settings,
  BarChart3,
  Webhook,
  Database,
} from "lucide-react"
import WhatsAppConnection from "./whatsapp-connection"
import EvolutionWhatsApp from "./evolution-whatsapp"

interface WhatsAppManagerProps {
  userRole: "simple" | "leader" | "master"
  clientId: string
  onConnectionChange?: (connected: boolean) => void
}

export default function WhatsAppManager({ userRole, clientId, onConnectionChange }: WhatsAppManagerProps) {
  const [selectedMethod, setSelectedMethod] = useState<"evolution" | "simulation">("evolution")
  const [showComparison, setShowComparison] = useState(true)

  const evolutionFeatures = [
    { icon: Globe, title: "Conexão Real", description: "Conecta diretamente com WhatsApp Web oficial" },
    { icon: Zap, title: "Webhooks em Tempo Real", description: "Receba mensagens instantaneamente via webhooks" },
    { icon: Shield, title: "Segurança Avançada", description: "Criptografia e segurança de nível empresarial" },
    { icon: BarChart3, title: "Analytics Completo", description: "Análise detalhada de todas as conversas" },
    { icon: Database, title: "Armazenamento Completo", description: "Histórico completo de mensagens e mídia" },
    { icon: Settings, title: "API Completa", description: "Envio, recebimento e gerenciamento completo" },
  ]

  const simulationFeatures = [
    { icon: Smartphone, title: "Simulação Básica", description: "Demonstração das funcionalidades principais" },
    { icon: CheckCircle, title: "Fácil Teste", description: "Ideal para testes e demonstrações" },
    { icon: BarChart3, title: "Analytics Simulado", description: "Dados de exemplo para visualização" },
  ]

  return (
    <div className="space-y-6">
      {/* Comparação Evolution API vs Simulação */}
      {showComparison && (
        <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <Zap className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-blue-900">Recomendado: Evolution API</strong>
                <p className="text-blue-700 text-sm mt-1">
                  Conexão real com WhatsApp, webhooks em tempo real e recursos profissionais completos
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
          <TabsTrigger value="evolution" className="relative">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Evolution API</span>
              <Badge className="bg-green-500 text-white text-xs ml-1">Recomendado</Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger value="simulation">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4" />
              <span>Simulação</span>
              <Badge variant="outline" className="text-xs ml-1">
                Demo
              </Badge>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="evolution" className="space-y-6">
          {/* Vantagens Evolution API */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evolutionFeatures.map((feature, index) => (
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

          {/* Componente Evolution API */}
          <EvolutionWhatsApp userRole={userRole} clientId={clientId} onConnectionChange={onConnectionChange} />

          {/* Informações Técnicas */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-900">
                <Settings className="w-5 h-5" />
                <span>Configuração Evolution API</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Recursos Técnicos:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Webhooks automáticos</li>
                    <li>• API REST completa</li>
                    <li>• Multi-instância</li>
                    <li>• Base64 para QR Code</li>
                    <li>• Eventos em tempo real</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Integrações:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• WhatsApp Web oficial</li>
                    <li>• Baileys (WhatsApp Library)</li>
                    <li>• Docker deployment</li>
                    <li>• Database persistence</li>
                    <li>• Load balancing</li>
                  </ul>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Webhook className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Webhook URL:</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  /api/evolution/webhook
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-6">
          {/* Aviso sobre Simulação */}
          <Alert className="border-yellow-200 bg-yellow-50">
            <Settings className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Modo Simulação:</strong> Esta é uma demonstração das funcionalidades. Para uso em produção,
              recomendamos a Evolution API para conexão real com WhatsApp.
            </AlertDescription>
          </Alert>

          {/* Recursos da Simulação */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {simulationFeatures.map((feature, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-gray-600" />
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

          {/* Componente Simulação */}
          <WhatsAppConnection userRole={userRole} clientId={clientId} onConnectionChange={onConnectionChange} />

          {/* Migração para Evolution API */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-900">Pronto para Produção?</h3>
                    <p className="text-sm text-green-700">
                      Migre para Evolution API e tenha acesso completo ao WhatsApp real
                    </p>
                  </div>
                </div>
                <Button onClick={() => setSelectedMethod("evolution")} className="bg-green-600 hover:bg-green-700">
                  Usar Evolution API
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
            <span>Documentação e Configuração</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Evolution API Setup:</h4>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                <p>EVOLUTION_API_URL=http://localhost:8080</p>
                <p>EVOLUTION_API_KEY=your-api-key</p>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Configure essas variáveis no seu .env para usar a Evolution API
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recursos Disponíveis:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>✅ Múltiplas instâncias simultâneas</li>
                <li>✅ Webhook automático configurado</li>
                <li>✅ Análise de sentimentos em tempo real</li>
                <li>✅ Histórico completo de conversas</li>
                <li>✅ Envio e recebimento de mensagens</li>
                <li>✅ Suporte a mídia (imagens, documentos)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
