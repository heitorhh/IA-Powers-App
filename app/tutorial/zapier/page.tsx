"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  ExternalLink,
  Smartphone,
  Zap,
  Copy,
  ArrowRight,
  AlertCircle,
  Clock,
  Settings,
} from "lucide-react"
import { useState } from "react"

export default function ZapierTutorial() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const webhookUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/whatsapp/webhook`
      : "https://seu-app.vercel.app/api/whatsapp/webhook"

  const verifyToken = "meu_token_secreto_123"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                📱 Tutorial Zapier + WhatsApp
              </h1>
              <p className="text-gray-600 mt-2">Configure seu WhatsApp Business em 8 passos simples</p>
            </div>
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              ~15 minutos
            </Badge>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>Importante:</strong> Este tutorial não requer conta do Facebook! Use o Zapier para conectar
              diretamente com WhatsApp Business.
            </AlertDescription>
          </Alert>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  Criar Conta no Zapier
                </CardTitle>
                <Badge variant="outline">Gratuito</Badge>
              </div>
              <CardDescription>Acesse o Zapier e crie sua conta gratuita</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-3">
                  <strong>1.1</strong> Acesse: <code className="bg-white px-2 py-1 rounded">zapier.com</code>
                </p>
                <p className="text-sm mb-3">
                  <strong>1.2</strong> Clique em "Sign up for free"
                </p>
                <p className="text-sm">
                  <strong>1.3</strong> Complete o cadastro com seu email
                </p>
              </div>
              <Button variant="outline" onClick={() => window.open("https://zapier.com", "_blank")} className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Zapier
              </Button>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                Configurar WhatsApp Business
              </CardTitle>
              <CardDescription>Prepare seu WhatsApp Business para integração</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-3">
                  <strong>2.1</strong> Baixe o WhatsApp Business no seu celular
                </p>
                <p className="text-sm mb-3">
                  <strong>2.2</strong> Configure sua conta comercial
                </p>
                <p className="text-sm mb-3">
                  <strong>2.3</strong> Vá em Configurações → Ferramentas comerciais
                </p>
                <p className="text-sm">
                  <strong>2.4</strong> Ative as "Mensagens automáticas"
                </p>
              </div>
              <Alert>
                <Smartphone className="h-4 w-4" />
                <AlertDescription>
                  <strong>Dica:</strong> Use um número dedicado para o WhatsApp Business, diferente do seu WhatsApp
                  pessoal.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                Criar Zap no Zapier
              </CardTitle>
              <CardDescription>Configure a automação entre WhatsApp e nossa API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-3">
                  <strong>3.1</strong> No Zapier, clique em "Create Zap"
                </p>
                <p className="text-sm mb-3">
                  <strong>3.2</strong> Busque por "WhatsApp Business" como trigger
                </p>
                <p className="text-sm mb-3">
                  <strong>3.3</strong> Escolha "New Message" como evento
                </p>
                <p className="text-sm">
                  <strong>3.4</strong> Conecte sua conta do WhatsApp Business
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                Configurar Webhook
              </CardTitle>
              <CardDescription>Conecte o Zapier com nossa API de IA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-3">
                  <strong>4.1</strong> Como ação, escolha "Webhooks by Zapier"
                </p>
                <p className="text-sm mb-3">
                  <strong>4.2</strong> Selecione "POST" como método
                </p>
                <p className="text-sm mb-3">
                  <strong>4.3</strong> Cole a URL do webhook abaixo:
                </p>
              </div>

              <div className="bg-white border-2 border-dashed border-gray-300 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <code className="text-sm bg-gray-100 px-3 py-2 rounded flex-1 mr-2">{webhookUrl}</code>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(webhookUrl, 4)}>
                    {copiedStep === 4 ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  <strong>Headers necessários:</strong>
                  <br />
                  Content-Type: application/json
                  <br />
                  Authorization: Bearer {verifyToken}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Step 5 */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                Configurar Dados do POST
              </CardTitle>
              <CardDescription>Estruture os dados que serão enviados para nossa IA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-3">
                  <strong>5.1</strong> No campo "Data", adicione os seguintes campos:
                </p>
                <div className="bg-white p-3 rounded border text-sm font-mono">
                  <div>from: {`{{WhatsApp Business Phone Number}}`}</div>
                  <div>message: {`{{WhatsApp Business Message Text}}`}</div>
                  <div>timestamp: {`{{WhatsApp Business Message Timestamp}}`}</div>
                  <div>type: "text"</div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  copyToClipboard(
                    `{
  "from": "{{WhatsApp Business Phone Number}}",
  "message": "{{WhatsApp Business Message Text}}",
  "timestamp": "{{WhatsApp Business Message Timestamp}}",
  "type": "text"
}`,
                    5,
                  )
                }
                className="w-full"
              >
                {copiedStep === 5 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar JSON
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Step 6 */}
          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                  6
                </div>
                Testar a Integração
              </CardTitle>
              <CardDescription>Verifique se tudo está funcionando corretamente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-3">
                  <strong>6.1</strong> No Zapier, clique em "Test & Continue"
                </p>
                <p className="text-sm mb-3">
                  <strong>6.2</strong> Envie uma mensagem de teste no WhatsApp Business
                </p>
                <p className="text-sm mb-3">
                  <strong>6.3</strong> Verifique se o webhook recebeu os dados
                </p>
                <p className="text-sm">
                  <strong>6.4</strong> Confirme se a resposta da IA foi gerada
                </p>
              </div>

              <Button variant="outline" onClick={() => window.open("/api/whatsapp/test", "_blank")} className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Testar API
              </Button>
            </CardContent>
          </Card>

          {/* Step 7 */}
          <Card className="border-l-4 border-l-pink-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                  7
                </div>
                Ativar o Zap
              </CardTitle>
              <CardDescription>Coloque sua automação em funcionamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-3">
                  <strong>7.1</strong> Se o teste passou, clique em "Turn on Zap"
                </p>
                <p className="text-sm mb-3">
                  <strong>7.2</strong> Dê um nome descritivo para seu Zap
                </p>
                <p className="text-sm">
                  <strong>7.3</strong> Sua automação está ativa! 🎉
                </p>
              </div>

              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  <strong>Parabéns!</strong> Seu WhatsApp Business agora está conectado com nossa IA. Todas as mensagens
                  serão analisadas automaticamente.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Step 8 */}
          <Card className="border-l-4 border-l-teal-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                  8
                </div>
                Monitorar e Otimizar
              </CardTitle>
              <CardDescription>Acompanhe o desempenho e faça ajustes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-3">
                  <strong>8.1</strong> Acesse o dashboard para ver as métricas
                </p>
                <p className="text-sm mb-3">
                  <strong>8.2</strong> Monitore a análise de sentimentos
                </p>
                <p className="text-sm mb-3">
                  <strong>8.3</strong> Ajuste as respostas da IA conforme necessário
                </p>
                <p className="text-sm">
                  <strong>8.4</strong> Configure alertas para mensagens negativas
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Ver Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open("/api/whatsapp/health", "_blank")}
                  className="w-full"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Status da API
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-yellow-500 mr-2" />
                <h3 className="text-xl font-bold">Sistema Configurado!</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Seu WhatsApp Business agora está integrado com nossa IA. Todas as mensagens serão analisadas e você
                receberá insights valiosos.
              </p>
              <div className="flex justify-center space-x-4">
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Análise de Sentimentos
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Respostas Automáticas
                </Badge>
                <Badge className="bg-purple-100 text-purple-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Dashboard em Tempo Real
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
