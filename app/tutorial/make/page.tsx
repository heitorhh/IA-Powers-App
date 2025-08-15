"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  AlertTriangle,
  ExternalLink,
  CheckCircle,
  XCircle,
  Zap,
  Settings,
  Smartphone,
  Globe,
  Code,
} from "lucide-react"
import Link from "next/link"

export default function MakeTutorialPage() {
  const [selectedAlternative, setSelectedAlternative] = useState<"zapier" | "n8n" | "typebot" | "twilio">("zapier")

  const alternatives = [
    {
      id: "zapier",
      name: "Zapier + WhatsApp Web",
      icon: Zap,
      difficulty: "Fácil",
      cost: "Gratuito (100 tarefas/mês)",
      pros: ["Não precisa Facebook", "Interface simples", "Funciona com WhatsApp Web", "Muitas integrações"],
      cons: ["Não é API oficial", "Pode ser instável", "Limitado a 100 tarefas grátis"],
      description: "Conecta diretamente com WhatsApp Web sem precisar de conta Facebook",
      color: "orange",
    },
    {
      id: "n8n",
      name: "n8n (Open Source)",
      icon: Settings,
      difficulty: "Médio",
      cost: "Gratuito (self-hosted)",
      pros: ["Totalmente gratuito", "Open source", "Controle total", "WhatsApp Web integration"],
      cons: ["Precisa hospedar", "Mais técnico", "Configuração complexa"],
      description: "Plataforma open source que você pode hospedar gratuitamente",
      color: "purple",
    },
    {
      id: "typebot",
      name: "Typebot + Evolution API",
      icon: Smartphone,
      difficulty: "Médio",
      cost: "Gratuito + $5/mês (Railway)",
      pros: ["Interface de chatbot visual", "Evolution API estável", "Não precisa Facebook", "Recursos avançados"],
      cons: ["Precisa Railway", "Configuração inicial", "Custo mensal baixo"],
      description: "Chatbot visual com Evolution API no Railway",
      color: "blue",
    },
    {
      id: "twilio",
      name: "Twilio WhatsApp",
      icon: Globe,
      difficulty: "Fácil",
      cost: "$0.005 por mensagem",
      pros: ["API oficial Twilio", "Muito estável", "Documentação excelente", "Suporte profissional"],
      cons: ["Pago por mensagem", "Precisa aprovação Twilio", "Mais caro em volume"],
      description: "API oficial do Twilio para WhatsApp Business",
      color: "red",
    },
  ]

  const currentAlternative = alternatives.find((alt) => alt.id === selectedAlternative)!

  const getSteps = () => {
    switch (selectedAlternative) {
      case "zapier":
        return [
          {
            title: "Criar conta no Zapier",
            description: "Acesse zapier.com e crie uma conta gratuita",
            details: [
              "1. Acesse https://zapier.com",
              "2. Clique em 'Sign up' (canto superior direito)",
              "3. Use seu email e crie uma senha",
              "4. Confirme seu email",
              "5. Faça login na sua conta",
            ],
          },
          {
            title: "Criar novo Zap",
            description: "Configure um novo Zap para WhatsApp",
            details: [
              "1. No dashboard, clique em 'Create Zap'",
              "2. Busque por 'WhatsApp' (não WhatsApp Business)",
              "3. Escolha 'New Message' como trigger",
              "4. Conecte sua conta WhatsApp Web",
              "5. Teste a conexão",
            ],
          },
          {
            title: "Configurar Webhook",
            description: "Adicione webhook para enviar dados",
            details: [
              "1. Clique em '+' para adicionar ação",
              "2. Busque por 'Webhooks by Zapier'",
              "3. Escolha 'POST'",
              "4. Cole a URL do webhook do seu sistema",
              "5. Configure os dados da mensagem",
            ],
          },
        ]

      case "n8n":
        return [
          {
            title: "Instalar n8n",
            description: "Configure n8n no seu servidor ou localmente",
            details: [
              "1. Instale Node.js no seu computador",
              "2. Execute: npm install n8n -g",
              "3. Execute: n8n start",
              "4. Acesse http://localhost:5678",
              "5. Crie sua conta admin",
            ],
          },
          {
            title: "Configurar WhatsApp Web",
            description: "Instale e configure o nó WhatsApp",
            details: [
              "1. No n8n, clique em 'New Workflow'",
              "2. Adicione nó 'WhatsApp Web'",
              "3. Configure credenciais WhatsApp",
              "4. Escaneie QR Code",
              "5. Teste a conexão",
            ],
          },
          {
            title: "Adicionar Webhook",
            description: "Configure webhook para seu sistema",
            details: [
              "1. Adicione nó 'HTTP Request'",
              "2. Configure método POST",
              "3. Cole URL do seu webhook",
              "4. Mapeie dados do WhatsApp",
              "5. Ative o workflow",
            ],
          },
        ]

      case "typebot":
        return [
          {
            title: "Criar conta Typebot",
            description: "Configure Typebot.io para chatbot visual",
            details: [
              "1. Acesse https://typebot.io",
              "2. Clique em 'Get started for free'",
              "3. Crie sua conta",
              "4. Crie um novo bot",
              "5. Configure fluxo básico",
            ],
          },
          {
            title: "Configurar Evolution API",
            description: "Deploy Evolution API no Railway",
            details: [
              "1. Acesse https://railway.app",
              "2. Faça deploy do Evolution API",
              "3. Configure variáveis de ambiente",
              "4. Obtenha URL da API",
              "5. Teste conexão",
            ],
          },
          {
            title: "Conectar Typebot + Evolution",
            description: "Integre Typebot com Evolution API",
            details: [
              "1. No Typebot, vá em Integrations",
              "2. Adicione WhatsApp integration",
              "3. Cole URL da Evolution API",
              "4. Configure webhook",
              "5. Publique o bot",
            ],
          },
        ]

      case "twilio":
        return [
          {
            title: "Criar conta Twilio",
            description: "Configure conta Twilio Console",
            details: [
              "1. Acesse https://twilio.com",
              "2. Clique em 'Sign up'",
              "3. Verifique seu telefone",
              "4. Complete o perfil",
              "5. Acesse o Console",
            ],
          },
          {
            title: "Configurar WhatsApp Business",
            description: "Ative WhatsApp Business API",
            details: [
              "1. No Console, vá em Messaging > WhatsApp",
              "2. Clique em 'Get started'",
              "3. Configure seu número business",
              "4. Aguarde aprovação (1-3 dias)",
              "5. Configure webhook URL",
            ],
          },
          {
            title: "Integrar com seu sistema",
            description: "Configure webhook e API calls",
            details: [
              "1. Obtenha Account SID e Auth Token",
              "2. Configure webhook URL no Twilio",
              "3. Teste recebimento de mensagens",
              "4. Configure envio via API",
              "5. Teste fluxo completo",
            ],
          },
        ]

      default:
        return []
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Alternativas ao Make.com</h1>
            <p className="text-gray-600">Soluções que não precisam de conta Facebook</p>
          </div>
        </div>

        {/* Problema com Facebook */}
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Problema identificado:</strong> Make.com + WhatsApp Business oficial requer conta Facebook Business.
            Aqui estão alternativas que funcionam sem Facebook!
          </AlertDescription>
        </Alert>

        {/* Seleção de Alternativas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {alternatives.map((alt) => (
            <Card
              key={alt.id}
              className={`cursor-pointer transition-all ${
                selectedAlternative === alt.id ? `ring-2 ring-${alt.color}-500` : ""
              }`}
              onClick={() => setSelectedAlternative(alt.id as any)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <alt.icon className={`w-6 h-6 text-${alt.color}-600`} />
                  {selectedAlternative === alt.id && <CheckCircle className="w-5 h-5 text-green-500" />}
                </div>
                <h3 className="font-medium mb-1">{alt.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{alt.description}</p>
                <div className="space-y-1">
                  <Badge variant="outline" className="text-xs">
                    {alt.difficulty}
                  </Badge>
                  <div className="text-xs text-gray-500">{alt.cost}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detalhes da Alternativa Selecionada */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prós e Contras */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <currentAlternative.icon className={`w-5 h-5 text-${currentAlternative.color}-600`} />
                <span>{currentAlternative.name}</span>
              </CardTitle>
              <CardDescription>{currentAlternative.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-green-700 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Vantagens:
                </h4>
                <ul className="space-y-1">
                  {currentAlternative.pros.map((pro, index) => (
                    <li key={index} className="text-sm text-green-600 flex items-center">
                      <span className="w-1 h-1 bg-green-500 rounded-full mr-2" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-red-700 mb-2 flex items-center">
                  <XCircle className="w-4 h-4 mr-2" />
                  Desvantagens:
                </h4>
                <ul className="space-y-1">
                  {currentAlternative.cons.map((con, index) => (
                    <li key={index} className="text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Dificuldade:</span>
                  <Badge variant="outline">{currentAlternative.difficulty}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="font-medium">Custo:</span>
                  <span className="text-gray-600">{currentAlternative.cost}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tutorial Passo-a-Passo */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="w-5 h-5" />
                <span>Tutorial: {currentAlternative.name}</span>
              </CardTitle>
              <CardDescription>Siga estes passos para configurar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {getSteps().map((step, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">{step.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <ul className="space-y-1">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="text-sm text-gray-700">
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recomendação */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-green-900 mb-2">Recomendação:</h3>
                <p className="text-green-800 mb-4">
                  Para começar rapidamente sem Facebook, recomendo o <strong>Zapier + WhatsApp Web</strong>. É a opção
                  mais simples e funciona imediatamente.
                </p>
                <div className="flex space-x-2">
                  <Button onClick={() => setSelectedAlternative("zapier")} className="bg-green-600 hover:bg-green-700">
                    Usar Zapier
                  </Button>
                  <Button variant="outline" onClick={() => window.open("https://zapier.com", "_blank")}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir Zapier
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparação Rápida */}
        <Card>
          <CardHeader>
            <CardTitle>Comparação Rápida</CardTitle>
            <CardDescription>Qual alternativa escolher?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Solução</th>
                    <th className="text-left p-2">Facilidade</th>
                    <th className="text-left p-2">Custo</th>
                    <th className="text-left p-2">Estabilidade</th>
                    <th className="text-left p-2">Melhor para</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Zapier</td>
                    <td className="p-2">⭐⭐⭐⭐⭐</td>
                    <td className="p-2">Gratuito</td>
                    <td className="p-2">⭐⭐⭐⭐</td>
                    <td className="p-2">Iniciantes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">n8n</td>
                    <td className="p-2">⭐⭐⭐</td>
                    <td className="p-2">Gratuito</td>
                    <td className="p-2">⭐⭐⭐⭐⭐</td>
                    <td className="p-2">Desenvolvedores</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Typebot</td>
                    <td className="p-2">⭐⭐⭐⭐</td>
                    <td className="p-2">$5/mês</td>
                    <td className="p-2">⭐⭐⭐⭐</td>
                    <td className="p-2">Chatbots</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Twilio</td>
                    <td className="p-2">⭐⭐⭐⭐</td>
                    <td className="p-2">Por mensagem</td>
                    <td className="p-2">⭐⭐⭐⭐⭐</td>
                    <td className="p-2">Empresas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
