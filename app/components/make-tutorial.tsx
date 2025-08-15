"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Copy,
  CheckCircle,
  Webhook,
  Eye,
  MousePointer,
  ArrowRight,
} from "lucide-react"

interface MakeTutorialProps {
  webhookUrl: string
}

export default function MakeTutorial({ webhookUrl }: MakeTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    {
      id: 1,
      title: "Criar Conta no Make.com",
      description: "Acesse o Make.com e crie sua conta gratuita",
      action: "https://make.com/en/register",
      details: [
        "1. Clique no link acima para abrir Make.com",
        "2. Clique em 'Sign up for free' (azul, canto superior direito)",
        "3. Preencha: Email, Senha, Confirmar senha",
        "4. Clique em 'Sign up'",
        "5. Verifique seu email e clique no link de confirmação",
        "6. Faça login na sua conta",
      ],
      screenshot: "/placeholder.svg?height=400&width=600&text=Make.com+Sign+Up+Page",
      tips: [
        "Use um email profissional",
        "A conta gratuita inclui 1.000 operações por mês",
        "Não precisa cartão de crédito para começar",
      ],
    },
    {
      id: 2,
      title: "Criar Novo Scenario",
      description: "Crie um novo cenário para automatizar o WhatsApp",
      details: [
        "1. No dashboard, clique em 'Create a new scenario' (botão azul grande)",
        "2. Você verá uma tela em branco com um '+' no centro",
        "3. Clique no '+' para adicionar o primeiro módulo",
        "4. Na busca, digite 'WhatsApp Business'",
        "5. Selecione 'WhatsApp Business' da lista",
      ],
      screenshot: "/placeholder.svg?height=400&width=600&text=Make.com+New+Scenario",
      tips: [
        "O scenario é como um fluxo de trabalho visual",
        "Cada círculo é um 'módulo' que executa uma ação",
        "Você pode salvar o scenario a qualquer momento",
      ],
    },
    {
      id: 3,
      title: "Configurar WhatsApp Business",
      description: "Configure o trigger do WhatsApp Business",
      details: [
        "1. Após selecionar WhatsApp Business, escolha 'Watch Messages'",
        "2. Clique em 'Create a connection'",
        "3. Digite um nome para a conexão (ex: 'Meu WhatsApp')",
        "4. Você precisará do WhatsApp Business API Token",
        "5. Se não tiver, clique em 'Get WhatsApp Business API' para criar",
        "6. Cole o token e clique em 'Save'",
      ],
      screenshot: "/placeholder.svg?height=400&width=600&text=WhatsApp+Business+Connection",
      tips: [
        "Você precisa de uma conta WhatsApp Business verificada",
        "O token é gratuito mas requer verificação",
        "Guarde o token em local seguro",
      ],
    },
    {
      id: 4,
      title: "Adicionar Webhook",
      description: "Configure o webhook para enviar dados para seu sistema",
      details: [
        "1. Clique no '+' à direita do módulo WhatsApp",
        "2. Busque por 'HTTP' e selecione",
        "3. Escolha 'Make a request'",
        "4. Configure:",
        "   - URL: Cole a URL do webhook abaixo",
        "   - Method: POST",
        "   - Headers: Content-Type: application/json",
        "5. No Body, adicione os campos do WhatsApp",
      ],
      screenshot: "/placeholder.svg?height=400&width=600&text=HTTP+Webhook+Configuration",
      tips: [
        "A URL do webhook é única para você",
        "Sempre use POST para enviar dados",
        "O Content-Type deve ser application/json",
      ],
    },
    {
      id: 5,
      title: "Mapear Dados",
      description: "Configure quais dados enviar para o webhook",
      details: [
        "1. No campo Body do HTTP, clique em 'JSON'",
        "2. Adicione os seguintes campos clicando nos dados do WhatsApp:",
        "   - from: Clique em 'From' do WhatsApp",
        "   - message: Clique em 'Text' do WhatsApp",
        "   - timestamp: Clique em 'Timestamp' do WhatsApp",
        "   - platform: Digite 'make' (texto fixo)",
        "3. O JSON deve ficar assim:",
        '   {"from": "{{1.from}}", "message": "{{1.text}}", "timestamp": "{{1.timestamp}}", "platform": "make"}',
      ],
      screenshot: "/placeholder.svg?height=400&width=600&text=Data+Mapping+JSON",
      tips: [
        "Os {{}} são variáveis do Make",
        "Clique nos campos para mapear automaticamente",
        "Teste sempre antes de ativar",
      ],
    },
    {
      id: 6,
      title: "Testar e Ativar",
      description: "Teste o scenario e ative a automação",
      details: [
        "1. Clique em 'Run once' (botão play, canto inferior esquerdo)",
        "2. Envie uma mensagem de teste no WhatsApp",
        "3. Verifique se o Make recebeu a mensagem",
        "4. Verifique se o webhook foi chamado (veja na aba Mensagens)",
        "5. Se tudo funcionou, clique no botão ON/OFF para ativar",
        "6. Pronto! Sua automação está funcionando 24/7",
      ],
      screenshot: "/placeholder.svg?height=400&width=600&text=Test+and+Activate+Scenario",
      tips: [
        "'Run once' executa apenas uma vez para teste",
        "Ativado, o scenario roda automaticamente",
        "Você pode pausar/reativar a qualquer momento",
      ],
    },
  ]

  const markStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex])
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Progresso da Configuração</h3>
            <Badge variant="outline">
              {completedSteps.length} de {steps.length} concluídos
            </Badge>
          </div>
          <div className="flex space-x-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex-1 h-2 rounded-full ${
                  completedSteps.includes(index)
                    ? "bg-green-500"
                    : index === currentStep
                      ? "bg-blue-500"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">{currentStepData.id}</span>
              </div>
              <div>
                <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
              </div>
            </div>
            {completedSteps.includes(currentStep) && <CheckCircle className="w-6 h-6 text-green-500" />}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Screenshot */}
          <div className="border rounded-lg overflow-hidden">
            <img
              src={currentStepData.screenshot || "/placeholder.svg"}
              alt={`Passo ${currentStepData.id}`}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center">
              <MousePointer className="w-4 h-4 mr-2" />
              Instruções Detalhadas:
            </h4>
            <div className="space-y-2">
              {currentStepData.details.map((detail, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm">{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Special content for webhook step */}
          {currentStep === 3 && (
            <Alert className="border-blue-200 bg-blue-50">
              <Webhook className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="space-y-2">
                  <strong>URL do Webhook para usar no Make:</strong>
                  <div className="flex space-x-2">
                    <code className="flex-1 p-2 bg-white rounded border text-xs font-mono break-all">{webhookUrl}</code>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(webhookUrl)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Dicas Importantes:
            </h4>
            <ul className="space-y-1">
              {currentStepData.tips.map((tip, index) => (
                <li key={index} className="text-sm text-yellow-700 flex items-start">
                  <span className="w-1 h-1 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          {currentStepData.action && (
            <Button onClick={() => window.open(currentStepData.action, "_blank")} className="w-full" size="lg">
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir {currentStep === 0 ? "Make.com" : "Link"}
            </Button>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => markStepComplete(currentStep)}
                disabled={completedSteps.includes(currentStep)}
              >
                {completedSteps.includes(currentStep) ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Concluído
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Concluído
                  </>
                )}
              </Button>

              <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Referência Rápida</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="json" className="w-full">
            <TabsList>
              <TabsTrigger value="json">JSON do Webhook</TabsTrigger>
              <TabsTrigger value="fields">Campos Obrigatórios</TabsTrigger>
              <TabsTrigger value="troubleshoot">Solução de Problemas</TabsTrigger>
            </TabsList>

            <TabsContent value="json" className="space-y-3">
              <p className="text-sm text-gray-600">Cole este JSON no campo Body do módulo HTTP:</p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <pre>{`{
  "from": "{{1.from}}",
  "message": "{{1.text}}",
  "timestamp": "{{1.timestamp}}",
  "platform": "make"
}`}</pre>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(`{
  "from": "{{1.from}}",
  "message": "{{1.text}}",
  "timestamp": "{{1.timestamp}}",
  "platform": "make"
}`)
                }
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar JSON
              </Button>
            </TabsContent>

            <TabsContent value="fields" className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Campos do WhatsApp:</h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      • <code>from</code> - Número do remetente
                    </li>
                    <li>
                      • <code>text</code> - Conteúdo da mensagem
                    </li>
                    <li>
                      • <code>timestamp</code> - Data/hora
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Configurações HTTP:</h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      • <strong>Method:</strong> POST
                    </li>
                    <li>
                      • <strong>Content-Type:</strong> application/json
                    </li>
                    <li>
                      • <strong>URL:</strong> Sua URL do webhook
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="troubleshoot" className="space-y-3">
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-medium text-red-700">Erro: "Connection failed"</h4>
                  <p className="text-sm text-gray-600">Verifique se o token do WhatsApp Business está correto</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-medium text-yellow-700">Erro: "Webhook timeout"</h4>
                  <p className="text-sm text-gray-600">Verifique se a URL do webhook está acessível</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-blue-700">Mensagens não chegam</h4>
                  <p className="text-sm text-gray-600">Certifique-se de que o scenario está ativado (ON)</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
