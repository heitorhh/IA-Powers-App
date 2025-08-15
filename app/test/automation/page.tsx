"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, TestTube, Send, CheckCircle, AlertCircle, Zap, MessageSquare, Clock, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function AutomationTestPage() {
  const [testData, setTestData] = useState({
    from: "+5511999999999",
    message: "Olá! Esta é uma mensagem de teste do Zapier.",
    platform: "zapier",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [webhookUrl, setWebhookUrl] = useState("")

  const generateWebhookUrl = () => {
    const clientId = "test_client"
    const timestamp = Date.now()
    const url = `${process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app"}/api/webhooks/whatsapp/${clientId}_${timestamp}`
    setWebhookUrl(url)
  }

  const testWebhook = async () => {
    if (!webhookUrl) {
      generateWebhookUrl()
      return
    }

    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...testData,
          timestamp: new Date().toISOString(),
        }),
      })

      const result = await response.json()
      setTestResult({
        success: response.ok,
        status: response.status,
        data: result,
        timestamp: new Date().toLocaleString("pt-BR"),
      })
    } catch (error) {
      setTestResult({
        success: false,
        status: 0,
        data: { error: "Erro de conexão" },
        timestamp: new Date().toLocaleString("pt-BR"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const zapierTestSteps = [
    {
      step: 1,
      title: "Configure o Trigger",
      description: "No Zapier, configure o trigger para 'New Message' no WhatsApp",
      status: "pending",
    },
    {
      step: 2,
      title: "Adicione Webhook Action",
      description: "Adicione uma ação 'Webhooks by Zapier' → 'POST'",
      status: "pending",
    },
    {
      step: 3,
      title: "Configure URL",
      description: "Cole a URL do webhook gerada abaixo",
      status: "pending",
    },
    {
      step: 4,
      title: "Mapeie os Dados",
      description: "Configure os campos: from, message, timestamp",
      status: "pending",
    },
    {
      step: 5,
      title: "Teste o Zap",
      description: "Use o botão 'Test' no Zapier para enviar dados",
      status: "pending",
    },
    {
      step: 6,
      title: "Ative o Zap",
      description: "Publique o Zap para começar a receber mensagens reais",
      status: "pending",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Teste de Automação</h1>
            <p className="text-gray-600">Teste sua configuração do Zapier + WhatsApp</p>
          </div>
        </div>

        {/* Alerta de Teste */}
        <Alert className="border-blue-200 bg-blue-50">
          <TestTube className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Ambiente de Teste:</strong> Use esta página para testar se sua configuração do Zapier está
            funcionando corretamente antes de ativar.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuração do Teste */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-orange-600" />
                <span>Configuração do Teste</span>
              </CardTitle>
              <CardDescription>Configure os dados para testar o webhook</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* URL do Webhook */}
              <div className="space-y-2">
                <Label htmlFor="webhook-url">URL do Webhook</Label>
                <div className="flex space-x-2">
                  <Input
                    id="webhook-url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="Cole a URL do webhook aqui..."
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="sm" onClick={generateWebhookUrl}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
                {webhookUrl && (
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(webhookUrl)}>
                    Copiar URL
                  </Button>
                )}
              </div>

              {/* Dados do Teste */}
              <div className="space-y-2">
                <Label htmlFor="from">Número de Origem</Label>
                <Input
                  id="from"
                  value={testData.from}
                  onChange={(e) => setTestData({ ...testData, from: e.target.value })}
                  placeholder="+5511999999999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem de Teste</Label>
                <Textarea
                  id="message"
                  value={testData.message}
                  onChange={(e) => setTestData({ ...testData, message: e.target.value })}
                  placeholder="Digite uma mensagem de teste..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Plataforma</Label>
                <Input
                  id="platform"
                  value={testData.platform}
                  onChange={(e) => setTestData({ ...testData, platform: e.target.value })}
                  placeholder="zapier"
                />
              </div>

              {/* Botão de Teste */}
              <Button onClick={testWebhook} disabled={isLoading || !webhookUrl} className="w-full">
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Testar Webhook
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Resultado do Teste */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TestTube className="w-5 h-5" />
                <span>Resultado do Teste</span>
              </CardTitle>
              <CardDescription>Resposta do webhook</CardDescription>
            </CardHeader>
            <CardContent>
              {!testResult ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum teste executado</h3>
                  <p className="text-gray-600">Configure os dados e clique em "Testar Webhook"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status:</span>
                    {testResult.success ? (
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Sucesso
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Erro
                      </Badge>
                    )}
                  </div>

                  {/* Código HTTP */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Código HTTP:</span>
                    <Badge variant="outline">{testResult.status}</Badge>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Horário:</span>
                    <span className="text-sm text-gray-600 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {testResult.timestamp}
                    </span>
                  </div>

                  {/* Resposta */}
                  <div className="space-y-2">
                    <span className="font-medium">Resposta:</span>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(testResult.data, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {/* Análise */}
                  {testResult.success && testResult.data.sentiment && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Análise de Sentimento:</strong> {testResult.data.sentiment} detectado na mensagem.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Checklist do Zapier */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-orange-600" />
              <span>Checklist: Configuração do Zapier</span>
            </CardTitle>
            <CardDescription>Siga estes passos no Zapier para configurar corretamente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {zapierTestSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-orange-600">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Pendente
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* JSON de Exemplo */}
        <Card>
          <CardHeader>
            <CardTitle>JSON de Exemplo para o Zapier</CardTitle>
            <CardDescription>Use este formato no seu Zap</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm text-gray-700">
                {JSON.stringify(
                  {
                    from: "{{phone_number}}",
                    message: "{{message_body}}",
                    timestamp: "{{timestamp}}",
                    platform: "zapier",
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 bg-transparent"
              onClick={() =>
                copyToClipboard(
                  JSON.stringify(
                    {
                      from: "{{phone_number}}",
                      message: "{{message_body}}",
                      timestamp: "{{timestamp}}",
                      platform: "zapier",
                    },
                    null,
                    2,
                  ),
                )
              }
            >
              Copiar JSON
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
